using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using QLTB_API.Models.QUAN_TRI.HT_MENU;
using QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG;
using APIPCHY_PhanQuyen.Services;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using GrapeCity.Documents.Word;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QLTB_API.Helpers;
using QLTB_API.Services.Audit;
using System.IO;

namespace QLTB_API.Controllers.QUAN_TRI.HT_NGUOIDUNG
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    public class HT_NGUOIDUNGController : ControllerBase
    {
        private readonly HT_NGUOIDUNG_Manager _manager;
        private readonly TokenService _tokenService; // Thêm biến cho TokenService
        private static readonly HttpClient LoginAdHttpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(8)
        };

        public HT_NGUOIDUNGController(IConfiguration configuration)
        {
            _manager = new HT_NGUOIDUNG_Manager(configuration);
            _tokenService = new TokenService(configuration); // Khởi tạo TokenService
        }

        [Route("refresh-token")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult RefreshToken()
        {
            // Lấy Refresh Token từ cookie
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Refresh token không tồn tại");
            }

            var principal = _tokenService.ValidateRefreshToken(refreshToken);

            if (principal == null)
                return Unauthorized("Token không hợp lệ hoặc đã hết hạn");

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = principal.Identity?.Name;

            var user = new HT_NGUOIDUNG_Model
            {
                id = userId,
                ten_dang_nhap = username,
                ho_ten = principal.FindFirst("ho_ten")?.Value,
                ma_dviqly = principal.FindFirst("ma_dviqly")?.Value,
            };

            // Tạo lại Access Token mới
            var newAccessToken = _tokenService.GenerateAccessToken(
                user,
                principal.FindFirst("sid")?.Value);
            _tokenService.SetAccessTokenInCookie(Response, newAccessToken);

            ////Tạo lại danh sách menu mới:
            //List<string> allowedMenus = _manager.get_allowedMenusByUserName(username);
            //string menuJson = JsonConvert.SerializeObject(allowedMenus);
            //_tokenService.SetAllowedMenusInCookie(Response, menuJson);

            return Ok(new { message = "Token refreshed" });
        }

        [Route("check-login")]
        [AllowAnonymous]
        [HttpGet]
        public IActionResult CheckAuth()
        {
            try
            {
                var accessToken = Request.Cookies["accessToken"];
                var refreshToken = Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(accessToken) && string.IsNullOrEmpty(refreshToken)) return Unauthorized();

                var principal = _tokenService.ValidateAccessToken(accessToken);
                // Nếu accessToken không hợp lệ, thử làm mới bằng refreshToken
                if (principal == null)
                {
                    var principalRefresh = _tokenService.ValidateRefreshToken(refreshToken);
                    if (principalRefresh == null)
                        return Unauthorized("Token không hợp lệ hoặc đã hết hạn");
                    var userId = principalRefresh.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var username = principalRefresh.Identity?.Name;

                    var user = new HT_NGUOIDUNG_Model
                    {
                        id = userId,
                        ten_dang_nhap = username,
                        ho_ten = principalRefresh.FindFirst("ho_ten")?.Value,
                        ma_dviqly = principalRefresh.FindFirst("ma_dviqly")?.Value,
                    };

                    // Tạo lại Access Token mới
                    var newAccessToken = _tokenService.GenerateAccessToken(
                        user,
                        principalRefresh.FindFirst("sid")?.Value);
                    _tokenService.SetAccessTokenInCookie(Response, newAccessToken);

                }
                return Ok();
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                return BadRequest("Đã có lỗi xảy ra trong quá trình kiểm tra đăng nhập");
            }
        }

        //Hàm dùng chung sinhtoken
        IActionResult IssueTokens(HT_NGUOIDUNG_Model user)
        {
            string sessionId = Guid.NewGuid().ToString("N");
            HttpContext.Items[NhatKyHeThongItems.MaNguoiDung] = user.ten_dang_nhap;
            HttpContext.Items[NhatKyHeThongItems.TenNguoiDung] =
                string.IsNullOrWhiteSpace(user.ho_ten) ? user.ten_dang_nhap : user.ho_ten;
            HttpContext.Items[NhatKyHeThongItems.MaDonVi] = user.ma_dviqly;
            HttpContext.Items[NhatKyHeThongItems.MaPhienGiaoDich] = sessionId;

            var accessToken = _tokenService.GenerateAccessToken(user, sessionId);
            var refreshToken = _tokenService.GenerateRefreshToken(user, sessionId);

            _tokenService.SetAccessTokenInCookie(Response, accessToken);
            _tokenService.SetRefreshTokenInCookie(Response, refreshToken);

            return Ok(new { user });
        }


        [Route("login")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] HT_NGUOIDUNG_Model model)
        {
            if (!string.IsNullOrWhiteSpace(model?.ten_dang_nhap))
            {
                // Chỉ đưa tên đăng nhập vào ngữ cảnh nhật ký; tuyệt đối không ghi mật khẩu.
                HttpContext.Items[NhatKyHeThongItems.MaNguoiDung] = model.ten_dang_nhap.Trim();
            }

            if (model == null
                || string.IsNullOrWhiteSpace(model.ten_dang_nhap)
                || string.IsNullOrWhiteSpace(model.mat_khau))
            {
                return BadRequest("Tên đăng nhập và mật khẩu không được để trống.");
            }

            string username = model.ten_dang_nhap.Trim();
            string password = model.mat_khau;
            if (username.Length > 100 || password.Length > 256)
            {
                return BadRequest("Tên đăng nhập hoặc mật khẩu vượt quá độ dài cho phép.");
            }

            // --- helper function: login DB + set token ---
            IActionResult LoginWithDb(string loginUsername, string loginPassword, bool needCheckPass)
            {
                var user = _manager.login_HT_NGUOIDUNG(loginUsername, loginPassword, needCheckPass);
                if (user == null)
                {
                    return Unauthorized("Tên đăng nhập, mật khẩu không đúng hoặc người dùng chưa được phân quyền.");
                }

                return IssueTokens(user);
            }

            try
            {
                // --- TH1: tài khoản không thuộc domain NPC => đăng nhập DB local ---
                //if (!username.StartsWith("npc\\", StringComparison.OrdinalIgnoreCase))
                //{
                    return LoginWithDb(username, password, true);
                //}

                // --- TH2: user thường => gọi API AD mới bằng POST JSON ---
                const string apiUrl = "http://10.47.0.19:99/APIPCHY/LoginADNPC/GET_LOGIN_ADNPC";
                var loginPayload = new
                {
                    strTEN_DANG_NHAP = username,
                    strMAT_KHAU = password
                };
                string requestBody = JsonConvert.SerializeObject(loginPayload);

                using var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                using HttpResponseMessage response = await LoginAdHttpClient.PostAsync(apiUrl, content);
                string responseBody = await response.Content.ReadAsStringAsync();

                JObject responseJson = null;
                try
                {
                    responseJson = JObject.Parse(responseBody);
                }
                catch (JsonException)
                {
                    // Phản hồi không đúng định dạng của API LoginAD.
                }

                string status = responseJson?
                    .GetValue("status", StringComparison.OrdinalIgnoreCase)?
                    .ToString();
                string message = responseJson?
                    .GetValue("message", StringComparison.OrdinalIgnoreCase)?
                    .ToString();

                if (response.IsSuccessStatusCode
                    && string.Equals(status, "Success", StringComparison.OrdinalIgnoreCase))
                {
                    // AD đã xác thực thành công; lấy thông tin/phân quyền local và phát token của QLTB.
                    return LoginWithDb(username, password, false);
                }

                // API máy 19 trả HTTP 401 cho cả Failed, Locked và Error.
                // Đọc status trong body để trả đúng thông báo/ngữ nghĩa cho frontend.
                if ((int)response.StatusCode == StatusCodes.Status401Unauthorized)
                {
                    if (string.Equals(status, "Locked", StringComparison.OrdinalIgnoreCase))
                    {
                        return Unauthorized(new
                        {
                            status = "Locked",
                            message = string.IsNullOrWhiteSpace(message)
                                ? "Tài khoản đã bị khóa do nhập sai mật khẩu quá nhiều lần. Vui lòng liên hệ hỗ trợ để mở khóa."
                                : message
                        });
                    }

                    if (string.Equals(status, "Error", StringComparison.OrdinalIgnoreCase))
                    {
                        // API LOGIN ADNPC dùng status Error khi hệ thống xác thực phía sau
                        // không kết nối được hoặc phát sinh lỗi hạ tầng.
                        // Khi đó mới cho phép kiểm tra lại bằng mật khẩu local.
                        return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                        {
                            status = "Error",
                            message = string.IsNullOrWhiteSpace(message)
                            ? "Không thể kết nối đến máy chủ xác thực."
                            : message
                        });
                        //return LoginWithDb(username, password, true);
                    }

                    return Unauthorized(new
                    {
                        status = "Failed",
                        message = string.IsNullOrWhiteSpace(message)
                            ? "Sai tên tài khoản hoặc mật khẩu."
                            : message
                    });
                }

                if ((int)response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(string.IsNullOrWhiteSpace(message)
                        ? "Dữ liệu đăng nhập không hợp lệ."
                        : message);
                }

                //Chỉnh lại khi sửa API LoginADNPC:
                if ((int)response.StatusCode == StatusCodes.Status429TooManyRequests)
                {
                    return LoginWithDb(username, password, true);
                    //return StatusCode(StatusCodes.Status429TooManyRequests,
                    //    "Bạn gửi quá nhiều yêu cầu đăng nhập trong 1 phút. Vui lòng thử lại sau 1 phút.");
                }

                if (string.Equals(status, "Error", StringComparison.OrdinalIgnoreCase))
                {
                    return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                    {
                        status = "Error",
                        message = string.IsNullOrWhiteSpace(message)
                        ? "Không thể kết nối đến máy chủ xác thực."
                        : message
                    });
                    //return LoginWithDb(username, password, true);
                }

                return StatusCode(StatusCodes.Status502BadGateway,
                    "Phản hồi từ máy chủ xác thực không hợp lệ.");
            }
            catch (TaskCanceledException) // Timeout khi gọi API xác thực
            {
                //return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                //{
                //    status = "Error",
                //    message = "Máy chủ xác thực không phản hồi. Vui lòng thử lại sau."
                //});
                return LoginWithDb(username, password, true);
            }
            catch (HttpRequestException) // API không kết nối được
            {
                //return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                //{
                //    status = "Error",
                //    message = "Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau."
                //});
                return LoginWithDb(username, password, true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Đã xảy ra lỗi hệ thống trong quá trình đăng nhập.");
            }
        }

        //Xác thực token và user từ hệ thống root:
        [Route("verify-temp-token")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult VerifyTempToken([FromBody] SsoLoginRequest model)

        {
            //Console.WriteLine("--------------");
            //Console.WriteLine(model.Username);
            //Console.WriteLine(model.TempToken);
            //Console.WriteLine(model.Code);
            //Console.WriteLine("--------------");
            if (string.IsNullOrEmpty(model.TempToken) || string.IsNullOrEmpty(model.Username))
                return BadRequest(new { Message = "Missing SSO info" });

            if (!_tokenService.ValidateTempToken(model.Username, model.TempToken))
                return Unauthorized(new { Message = "Invalid SSO token" });

            var user = _manager.login_HT_NGUOIDUNG(model.Username, "", false);
            if (user == null)
                return Unauthorized(new { Message = "User chưa tồn tại trong hệ thống mới" });

            if (string.IsNullOrEmpty(user.dm_donvi_id) || string.IsNullOrEmpty(user.dm_phongban_id))
                return Unauthorized(new { Message = "User chưa được cập nhật đơn vị hoặc phòng ban" });

            List<HT_MENU_Model> menuList = _manager.get_HT_MENU_ByIDUser(user.id);

            if (menuList == null || !menuList.Any())
                return StatusCode(403, new { Message = "User chưa được cấp quyền" });

            // Lọc menu theo tiện ích nếu có code
            var appCode = model.Code?.Trim().ToLower();
            if (!string.IsNullOrEmpty(appCode))
            {
                var code = appCode.Trim().ToLower();

                // Chỉ lấy menu cha tương ứng tiện ích
                var appMenus = menuList
                    .Where(m => m.parent_id == null && m.ma_menu?.Trim().ToLower() == code)
                    .ToList();

                if (!appMenus.Any())
                {
                    return StatusCode(403, new
                    {
                        Message = "User chưa có quyền sử dụng tiện ích này",
                        AppCode = appCode
                    });
                }
            }

            // Token hợp lệ
            return Ok(new { Message = "Token và user hợp lệ" });
        }

        //đăng nhập khi đã xác thực từ hệ thống root
        [Route("sso-login")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult SsoLogin([FromBody] SsoLoginRequest request)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(request?.Username))
                {
                    HttpContext.Items[NhatKyHeThongItems.TenNguoiDung] = request.Username.Trim();
                }

                if (!_tokenService.ValidateTempToken(request.Username, request.TempToken))
                    return Unauthorized(new { Message = "Token không hợp lệ" });

                var user = _manager.login_HT_NGUOIDUNG(request.Username, "", false);

                List<string> allowedMenus = user.allowedMenus;
                List<string> filteredMenus;

                if (!string.IsNullOrEmpty(request.Code))
                {
                    string appPrefix = "/" + request.Code.Trim().ToLower(); // chuẩn hóa code
                    filteredMenus = allowedMenus
                        .Where(m => m.Trim().ToLower().StartsWith(appPrefix))
                        .ToList();

                    if (!filteredMenus.Any())
                        return StatusCode(403, new { Message = "User không có quyền vào tiện ích này" });
                }
                else
                {
                    filteredMenus = allowedMenus
                        .Where(m => !m.Trim().ToLower().StartsWith("/quanlythinghiem"))
                        .ToList();
                }

                var dsQuyen = (user.ds_quyen ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(q => q.Trim().ToUpper())
                    .ToList();

                bool isAdmin = dsQuyen.Contains("ADMIN") || dsQuyen.Contains("ADMIN_DL");
                if (isAdmin)
                {
                    var adminMenus = allowedMenus
                        .Where(m => m.Trim().ToLower().StartsWith("/quantrihethong"))
                        .ToList();
                    filteredMenus.InsertRange(0, adminMenus);
                }

                user.allowedMenus = filteredMenus;

                return IssueTokens(user); // Phát token và set cookie
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SSO Login Error: {ex}");
                return StatusCode(500, new { Message = "Có lỗi xảy ra khi đăng nhập SSO", Detail = ex.Message });
            }
        }


        //Lấy thông tin người dùng gán localstorage:
        [HttpGet("me")]
        public IActionResult GetUserForLogin(string? code)
        {
            try
            {
                var username = User.Identity.Name; // từ token cookie
                var user = _manager.login_HT_NGUOIDUNG(username, "", false);

                List<string> allowedMenus = user.allowedMenus;

                List<string> filteredMenus;

                if (!string.IsNullOrEmpty(code))
                {
                    string appPrefix = "/" + code.Trim().ToLower(); // chuẩn hóa code
                    filteredMenus = allowedMenus
                        .Where(m => m.Trim().ToLower().StartsWith(appPrefix))
                        .ToList();

                    if (!filteredMenus.Any())
                        return StatusCode(403, new { Message = "User không có quyền vào tiện ích này" });
                }
                else
                {
                    // Nếu không có code, trả tất cả menu trừ /quanlythinghiem
                    filteredMenus = allowedMenus
                        .Where(m => !m.Trim().ToLower().StartsWith("/quanlythinghiem"))
                        .ToList();
                }


                // Kiểm tra quyền ADMIN/ADMIN_DL để thêm menu quản trị
                var dsQuyen = (user.ds_quyen ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(q => q.Trim().ToUpper())
                    .ToList();

                bool isAdmin = dsQuyen.Contains("ADMIN") || dsQuyen.Contains("ADMIN_DL");
                if (isAdmin)
                {
                    var adminMenus = allowedMenus
                        .Where(m => m.Trim().ToLower().StartsWith("/quantrihethong"))
                        .ToList();
                    // Đưa menu quản trị lên đầu
                    filteredMenus.InsertRange(0, adminMenus);
                }


                // Gán danh sách menu đã lọc cho user để frontend dùng
                user.allowedMenus = filteredMenus;

                //Console.WriteLine("--------");
                //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(filteredMenus, new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));
                //Console.WriteLine("--------");
                return Ok(user);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost("get_ListNguoiDung")]
        public IActionResult GET_HT_NGUOIDUNG([FromBody] Dictionary<string, string> formData)
        {
            try
            {
                long total = 0;

                if (formData == null || !formData.ContainsKey("pageIndex") || !formData.ContainsKey("pageSize"))
                {
                    return BadRequest("Invalid request data. pageIndex and pageSize are required.");
                }
                if (!int.TryParse(formData["pageIndex"], out int pageIndex) ||
                    !int.TryParse(formData["pageSize"], out int pageSize))
                {
                    return BadRequest("Invalid pageIndex or pageSize format.");
                }

                var data = _manager.GET_HT_NGUOIDUNG(pageIndex, pageSize, out total);

                var result = new
                {
                    page = pageIndex,
                    Total = total,
                    PageSize = pageSize,
                    Data = data
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"ERROR: {ex.Message}");
            }
        }


        [HttpGet("{id}")]
        public IActionResult GetNguoiDungById(string id)
        {
            try
            {
                var nguoiDung = _manager.GET_DM_NGUOIDUNG_byID(id);
                if (nguoiDung == null)
                {
                    return NotFound($"Không tìm thấy người dùng với ID: {id}");
                }
                return Ok(nguoiDung);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("get_by_username")]
        public IActionResult GetNguoiDungByUsername(string username)
        {
            try
            {
                var nguoiDung = _manager.GET_DM_NGUOIDUNG_byUsername(username);
                if (nguoiDung == null)
                {
                    return NotFound($"Không tìm thấy người dùng với username: {username}");
                }
                return Ok(nguoiDung);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }


        [HttpPost("create")]
        public IActionResult PostInsertNguoiDung([FromBody] HT_NGUOIDUNG_Model nd)
        {
            try
            {
                var result = _manager.Insert_QLTB_NGUOI_DUNG(nd);

                if (result.p_Error == "Username already exists")
                {
                    return StatusCode(400, $"{result.p_Error}");
                }

                return Ok(new { message = "Thêm người dùng thành công", result.data });
            } catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }


        }
        [Route("getHT_NGUOIDUNGByMA_DVIQLY")]
        [HttpPost]

        public IActionResult getHT_NGUOIDUNGByMA_DVIQLY([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                string ma_dviqly = null;
                string db_maphongban = null;
                string vai_tro = null;
                if (formData.Keys.Contains("ma_dviqly") && !string.IsNullOrEmpty(formData["ma_dviqly"].ToString()))
                {
                    ma_dviqly = formData["ma_dviqly"].ToString();
                }
                if (formData.Keys.Contains("db_maphongban") && !string.IsNullOrEmpty(formData["db_maphongban"].ToString()))
                {
                    db_maphongban = formData["db_maphongban"].ToString();
                }
                if (formData.Keys.Contains("vai_tro") && !string.IsNullOrEmpty(formData["vai_tro"].ToString()))
                {
                    vai_tro = formData["vai_tro"].ToString();
                }
                var reuslt = _manager.getHT_NGUOIDUNGByMA_DVIQLY(ma_dviqly, db_maphongban, vai_tro);
                return reuslt != null ? Ok(reuslt) : NotFound("not found!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get_HT_NGUOIDUNGByDONVIIDS")]
        [HttpPost]

        public IActionResult get_HT_NGUOIDUNGByDONVIIDS([FromBody] DonviRequest request)
        {
            try
            {
                string donvi_ids = request.donvi_ids != null
                    ? string.Join(",", request.donvi_ids)
                    : null;

                var reuslt = _manager.get_HT_NGUOIDUNGByDONVIIDS(donvi_ids);
                return reuslt != null ? Ok(reuslt) : NotFound("not found!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("update")]
        public void UpdateQuyen([FromBody] HT_NGUOIDUNG_Model nd)
        {
            _manager.Update_HT_NGUOIDUNG(nd);
        }


        [HttpPost("search")]
        public IActionResult FilterUsers([FromBody] UserFilterRequest request)
        {
            try
            {
                int totalRecords;
                List<UserResponse> users = _manager.FILTER_HT_NGUOIDUNG(request, out totalRecords);

                int totalPages = (int)Math.Ceiling((double)totalRecords / request.PageSize);

                var result = new
                {
                    page = request.PageIndex,
                    TotalRecords = totalRecords,
                    TotalPages = totalPages,
                    PageSize = request.PageSize,
                    data = users
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        //đổi mật khẩu 
        [HttpPost("resetPassword")]
        public IActionResult Reset_Password_HT_NGUOIDUNG([FromBody] Dictionary<string, string> request)
        {
            // Lấy các giá trị từ Dictionary
            if (!request.TryGetValue("ID", out string id) ||
                !request.TryGetValue("currentPassword", out string currentPassword) ||
                !request.TryGetValue("newPassword", out string newPassword))
            {
                return BadRequest(new { message = "Thiếu thông tin yêu cầu." });
            }

            // Gọi hàm reset password
            string resultMessage = _manager.Reset_Password_HT_NGUOIDUNG(id, currentPassword, newPassword);

            if (resultMessage == "Mật khẩu hiện tại không chính xác.")
            {
                return Unauthorized(new { message = resultMessage });
            }

            return Ok(new { message = resultMessage });
        }

        //Reset mật khẩu 
        [HttpPost("resetDefaultPassword")]
        public IActionResult Reset_DefaultPassword_HT_NGUOIDUNG([FromBody] Dictionary<string, string> request)
        {
            try
            {
                // Lấy các giá trị từ Dictionary
                if (!request.TryGetValue("ID", out string id) ||
                    !request.TryGetValue("defaultPassword", out string defaultPassword))
                {
                    Console.WriteLine("Thiếu thông tin yêu cầu");
                    return BadRequest(new { message = "Thiếu thông tin yêu cầu." });
                }

                // Gọi hàm reset password
                string resultMessage = _manager.Reset_DefaultPassword_HT_NGUOIDUNG(id, defaultPassword);

                return Ok(new { message = resultMessage });
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("delete/{id}")]
        public IActionResult Delete_HT_NGUOIDUNG(string id)
        {
            _manager.Delete_HT_NGUOIDUNG(id);
            return Ok("Xoa thanh cong");
        }

        [HttpPut("update_Trangthai/{id}/{trangthai}")]
        public IActionResult updateTrangThai(string id, int trangthai)
        {
            _manager.updateTrangThai_NguoiDung(id, trangthai);
            return Ok("Thành công");
        }

        [Route("get_HT_MENUByIdUser")]
        [HttpGet]
        public IActionResult get_HT_MENUByIdUser(string userId)
        {
            try
            {
                List<HT_MENU_Model> result = _manager.get_HT_MENU_ByIDUser(userId);
                return result != null ? Ok(result) : NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("GET_MENU_WAIT_SIGN")]
        [HttpGet]
        public IActionResult GET_MENU_WAIT_SIGN(string username)
        {
            try
            {
                List<MenuWaitSign_Model> result = _manager.GET_MENU_WAIT_SIGN(username);
                return result != null ? Ok(result) : NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [Route("logout")]
        [HttpPost]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("accessToken", new CookieOptions
            {
                HttpOnly = true,
                Path = "/",
                Secure = true, // Cần HTTPS
                SameSite = SameSiteMode.None
            });

            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Path = "/",
                Secure = true, // Cần HTTPS
                SameSite = SameSiteMode.None
            });
            //Response.Cookies.Delete("allowedMenus", new CookieOptions
            //{
            //    HttpOnly = false,
            //    Path = "/",
            //    Secure = true, // Cần HTTPS
            //    SameSite = SameSiteMode.None
            //});
            return Ok(new { message = "Đăng xuất thành công" });
        }


        [HttpGet("user-image")]
        public async Task<IActionResult> GetUserImage([FromQuery] string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                return NotFound();

            // Chuẩn hóa path
            path = path.Replace("\\", "/").Trim();

            // Giới hạn độ dài path (tránh abuse)
            if (path.Length > 300)
                return BadRequest("Path too long");

            // Chặn leo thư mục
            if (path.Contains(".."))
                return BadRequest("Invalid path");

            // Chỉ cho phép file ảnh
            string ext = Path.GetExtension(path)?.ToLowerInvariant();
            var allowedExt = new HashSet<string>
            {
                ".jpg", ".jpeg", ".png", ".gif", ".webp"
            };

            if (string.IsNullOrEmpty(ext) || !allowedExt.Contains(ext))
                return BadRequest("Invalid image type");

            // Thư mục gốc cố định trên FTP
            const string rootDir = "/Backup_SRV/SRV-19-DuLieuQLTB";

            // Ép path luôn nằm dưới rootDir
            path = path.TrimStart('/');

            string fullPath = $"{rootDir}/{path}";

            var bytes = await FtpHelper.GetImgBytesFromFTPAsync(fullPath);
            if (bytes == null || bytes.Length == 0)
                return NotFound();

            // Map MIME type
            string contentType = ext switch
            {
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "image/jpeg"
            };

            // Cache 1 ngày quan trọng cho avatar
            Response.Headers["Cache-Control"] = "public,max-age=86400";

            return File(bytes, contentType);
        }


    }

}
