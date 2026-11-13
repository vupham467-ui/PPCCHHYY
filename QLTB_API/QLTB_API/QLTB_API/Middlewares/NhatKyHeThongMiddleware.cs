using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Newtonsoft.Json;
using QLTB_API.Services.Audit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLTB_API.Middlewares
{
    public sealed class NhatKyHeThongMiddleware
    {
        private readonly RequestDelegate _next;

        public NhatKyHeThongMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, INhatKyHeThongQueue queue)
        {
            NhatKyPlan plan = NhatKyClassifier.Classify(context);
            if (plan == null)
            {
                await _next(context);
                return;
            }

            Exception requestException = null;
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                requestException = ex;
                throw;
            }
            finally
            {
                queue.Enqueue(BuildEntry(context, plan, requestException));
            }
        }

        private static NhatKyHeThongEntry BuildEntry(
            HttpContext context,
            NhatKyPlan plan,
            Exception requestException)
        {
            int statusCode = requestException == null
                ? context.Response.StatusCode
                : StatusCodes.Status500InternalServerError;

            string trangThai;
            if (context.RequestAborted.IsCancellationRequested)
            {
                trangThai = TrangThaiNhatKy.DA_HUY;
            }
            else if (statusCode == StatusCodes.Status401Unauthorized || statusCode == StatusCodes.Status403Forbidden)
            {
                trangThai = TrangThaiNhatKy.BI_TU_CHOI;
            }
            else if (requestException != null || statusCode >= StatusCodes.Status400BadRequest)
            {
                trangThai = TrangThaiNhatKy.THAT_BAI;
            }
            else
            {
                trangThai = TrangThaiNhatKy.THANH_CONG;
            }

            string overrideStatus = GetItem(context, NhatKyHeThongItems.TrangThai);
            if (!string.IsNullOrWhiteSpace(overrideStatus))
            {
                trangThai = overrideStatus;
            }

            string username = GetItem(context, NhatKyHeThongItems.MaNguoiDung)
                ?? context.User.Identity?.Name;
            string fullName = GetItem(context, NhatKyHeThongItems.TenNguoiDung)
                ?? context.User.FindFirst("ho_ten")?.Value
                ?? username;
            string unitCode = GetItem(context, NhatKyHeThongItems.MaDonVi)
                ?? context.User.FindFirst("ma_dviqly")?.Value;

            var details = new Dictionary<string, object>
            {
                ["thao_tac"] = plan.MaThaoTac,
                ["ma_doi_tuong"] = GetObjectCode(context),
                ["ma_don_vi_tac_dong"] = GetTargetUnit(context)
            };

            if (context.Items.TryGetValue(NhatKyHeThongItems.ChiTietBoSung, out object additional)
                && additional != null)
            {
                details["chi_tiet_nghiep_vu"] = additional;
            }

            string error = GetItem(context, NhatKyHeThongItems.ThongBaoLoi);
            if (string.IsNullOrWhiteSpace(error) && requestException != null)
            {
                error = requestException.GetType().Name + ": " + requestException.Message;
            }
            else if (string.IsNullOrWhiteSpace(error) && statusCode >= StatusCodes.Status400BadRequest)
            {
                error = "Yêu cầu kết thúc với HTTP " + statusCode;
            }

            return new NhatKyHeThongEntry
            {
                MaUngDung = ResolveApplicationCode(context),
                MaChucNang = Truncate(plan.MaChucNang, 80),
                MaThaoTac = Truncate(plan.MaThaoTac, 80),
                TrangThai = trangThai,
                MaNguoiDung = Truncate(username, 100),
                TenNguoiDung = Truncate(fullName, 200),
                MaDonVi = Truncate(unitCode, 20),
                NoiDung = Truncate(GetItem(context, NhatKyHeThongItems.NoiDung) ?? plan.NoiDung, 1000),
                ChiTietJson = JsonConvert.SerializeObject(details),
                MaPhienGiaoDich = Truncate(
                    GetItem(context, NhatKyHeThongItems.MaPhienGiaoDich)
                    ?? context.User.FindFirst("sid")?.Value
                    ?? context.TraceIdentifier,
                    64),
                NenTangThietBi = Truncate(GetPlatform(context), 100),
                DiaChiIp = Truncate(GetClientIp(context), 64),
                ThongBaoLoi = Truncate(error, 2000),
                SoLuongDoiTuong = GetIntItem(context, NhatKyHeThongItems.SoLuongDoiTuong, 1)
            };
        }

        private static string GetPlatform(HttpContext context)
        {
            string platform = SafeHeader(context, "Sec-CH-UA-Platform", 30)?.Replace("\"", string.Empty);
            string userAgent = SafeHeader(context, "User-Agent", 70);
            if (string.IsNullOrWhiteSpace(platform))
            {
                return userAgent;
            }

            return string.IsNullOrWhiteSpace(userAgent) ? platform : platform + " - " + userAgent;
        }

        private static string ResolveApplicationCode(HttpContext context)
        {
            string configuredCode = GetItem(context, NhatKyHeThongItems.MaUngDung);
            if (!string.IsNullOrWhiteSpace(configuredCode))
            {
                return Truncate(configuredCode.ToUpperInvariant(), 50);
            }

            string clientHeader = SafeHeader(context, "X-Client-App", 50);
            if (!string.IsNullOrWhiteSpace(clientHeader))
            {
                string normalizedClient = clientHeader.Trim().ToUpperInvariant();
                if (normalizedClient.Contains("MOBILE")) return "UNG_DUNG_MOBILE";
                if (normalizedClient.Contains("WEB")) return "UNG_DUNG_WEB";
                return Truncate(normalizedClient, 50);
            }

            bool hasBrowserContext = !string.IsNullOrWhiteSpace(SafeHeader(context, "X-Menu-Path", 500))
                || !string.IsNullOrWhiteSpace(SafeHeader(context, "Origin", 500))
                || !string.IsNullOrWhiteSpace(SafeHeader(context, "Referer", 500));
            string userAgent = SafeHeader(context, "User-Agent", 1000);
            bool isBrowser = !string.IsNullOrWhiteSpace(userAgent)
                && userAgent.IndexOf("Mozilla/", StringComparison.OrdinalIgnoreCase) >= 0;

            return hasBrowserContext || isBrowser ? "UNG_DUNG_WEB" : "UNG_DUNG_API";
        }

        private static string GetClientIp(HttpContext context)
        {
            // ForwardedHeadersMiddleware đã xác thực reverse proxy và chuyển IP thiết bị
            // vào RemoteIpAddress. Không đọc header trực tiếp tại đây để tránh giả mạo IP.
            string ip = context.Connection.RemoteIpAddress?.ToString();

            const string ipv4MappedPrefix = "::ffff:";
            if (!string.IsNullOrWhiteSpace(ip)
                && ip.StartsWith(ipv4MappedPrefix, StringComparison.OrdinalIgnoreCase))
            {
                ip = ip.Substring(ipv4MappedPrefix.Length);
            }

            return ip;
        }

        private static string GetObjectCode(HttpContext context)
        {
            string[] preferredKeys = { "deviceId", "assetId", "fileId", "scopeId", "id" };
            foreach (string key in preferredKeys)
            {
                if (context.Request.RouteValues.TryGetValue(key, out object routeValue))
                {
                    return Truncate(Convert.ToString(routeValue), 500);
                }

                if (context.Request.Query.TryGetValue(key, out var queryValue))
                {
                    return Truncate(queryValue.ToString(), 500);
                }
            }

            return null;
        }

        private static string GetTargetUnit(HttpContext context)
        {
            string[] preferredKeys = { "ma_dviqly", "maDviqly", "maDvi", "root_id", "rootId" };
            foreach (string key in preferredKeys)
            {
                if (context.Request.Query.TryGetValue(key, out var queryValue))
                {
                    return Truncate(queryValue.ToString(), 100);
                }

                if (context.Request.RouteValues.TryGetValue(key, out object routeValue))
                {
                    return Truncate(Convert.ToString(routeValue), 100);
                }
            }

            return null;
        }

        private static string SafeHeader(HttpContext context, string name, int maxLength)
        {
            return Truncate(context.Request.Headers[name].ToString(), maxLength);
        }

        private static string GetItem(HttpContext context, string key)
        {
            return context.Items.TryGetValue(key, out object value) ? Convert.ToString(value) : null;
        }

        private static int GetIntItem(HttpContext context, string key, int defaultValue)
        {
            if (context.Items.TryGetValue(key, out object value)
                && int.TryParse(Convert.ToString(value), out int result))
            {
                return result;
            }

            return defaultValue;
        }

        private static string Truncate(string value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            value = value.Trim();
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }
    }

    internal sealed class NhatKyPlan
    {
        public string MaChucNang { get; set; }
        public string MaThaoTac { get; set; }
        public string NoiDung { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
    }

    internal static class NhatKyClassifier
    {
        public static NhatKyPlan Classify(HttpContext context)
        {
            Endpoint endpoint = context.GetEndpoint();
            if (endpoint == null || endpoint.Metadata.GetMetadata<BoQuaNhatKyAttribute>() != null)
            {
                return null;
            }

            ControllerActionDescriptor descriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
            string controller = descriptor?.ControllerName ?? string.Empty;
            string action = descriptor?.ActionName ?? string.Empty;
            string path = context.Request.Path.Value ?? string.Empty;
            string combined = Normalize(controller + " " + action + " " + path);
            string method = context.Request.Method?.ToUpperInvariant();

            GhiNhatKyAttribute configured = endpoint.Metadata.GetMetadata<GhiNhatKyAttribute>();
            if (configured != null)
            {
                return CreatePlan(configured.MaChucNang, configured.MaThaoTac,
                    configured.NoiDung, controller, action);
            }

            string actionCode = GetActionCode(method, combined, Normalize(action), controller);
            if (actionCode == null)
            {
                return null;
            }

            string functionCode = GetFunctionCode(controller, actionCode);
            return CreatePlan(functionCode, actionCode, null, controller, action);
        }

        private static string GetFunctionCode(string controller, string actionCode)
        {
            if (actionCode == MaThaoTacNhatKy.DANG_NHAP
                || actionCode == MaThaoTacNhatKy.DANG_XUAT)
            {
                return MaChucNangNhatKy.XAC_THUC;
            }

            string controllerCode = NormalizeCode(controller);
            if (controllerCode.Contains("QUYEN_NGUOIDUNG", StringComparison.Ordinal)
                || controllerCode.Contains("QUYEN_NGUOI_DUNG", StringComparison.Ordinal)
                || controllerCode.Contains("PHANQUYEN", StringComparison.Ordinal)
                || controllerCode.Contains("PHAN_QUYEN", StringComparison.Ordinal))
            {
                return MaChucNangNhatKy.PHAN_QUYEN_NGUOI_DUNG;
            }

            if (controllerCode.Contains("HT_NGUOIDUNG", StringComparison.Ordinal)
                || controllerCode.Contains("HT_NGUOI_DUNG", StringComparison.Ordinal))
            {
                return MaChucNangNhatKy.QUAN_LY_NGUOI_DUNG;
            }

            if (DanhMucChucNangNhatKy.TryGet(controller, out ThongTinChucNangNhatKy function))
            {
                return function.Ma;
            }

            return controllerCode;
        }

        private static string GetActionCode(string method, string combined, string action, string controller)
        {
            if (ContainsAny(combined, "CHECK LOGIN", "REFRESH TOKEN", "VERIFY TEMP TOKEN"))
                return null;

            bool isReportRequest = (DanhMucChucNangNhatKy.TryGet(controller, out ThongTinChucNangNhatKy function)
                    && function.GhiNhanThaoTacDoc)
                || ContainsAny(combined, "BAO CAO", "BAOCAO", "REPORT", "THONG KE", "THONGKE");

            // Không ghi các thao tác chỉ đọc/tạo báo cáo: dashboard tự tải, mở báo cáo,
            // tìm kiếm trong báo cáo và xuất báo cáo đều không làm thay đổi dữ liệu.
            if (ContainsAny(combined, "DASHBOARD")
                || isReportRequest
                || ContainsAny(combined, "XUAT BAO CAO", "EXPORT"))
                return null;

            if (ContainsAny(combined, "DANG XUAT", "LOGOUT")) return MaThaoTacNhatKy.DANG_XUAT;
            if (ContainsAny(combined, "DANG NHAP", "LOGIN")) return MaThaoTacNhatKy.DANG_NHAP;

            if (ContainsAny(combined, "DOWNLOAD", "TAI XUONG"))
                return MaThaoTacNhatKy.TAI_XUONG;

            // Ưu tiên ý nghĩa của action để các route nằm trong phân hệ import/sync
            // vẫn được ghi đúng là hủy, xóa, xác nhận hoặc cập nhật.
            if (ContainsAny(action, "CANCEL") || ContainsWord(action, "HUY")) return MaThaoTacNhatKy.HUY;
            if (ContainsAny(action, "REJECT") || ContainsAny(action, "TU CHOI")) return MaThaoTacNhatKy.TU_CHOI;
            if (ContainsAny(action, "RESTORE", "KHOI PHUC")) return MaThaoTacNhatKy.KHOI_PHUC;
            if (ContainsAny(action, "UNLOCK", "MO KHOA")) return MaThaoTacNhatKy.MO_KHOA;
            if (ContainsAny(action, "RESET PASSWORD", "RESETDEFAULTPASSWORD", "DAT LAI MAT KHAU"))
                return MaThaoTacNhatKy.DAT_LAI_MAT_KHAU;
            if (ContainsAny(action, "CHANGE PASSWORD", "DOI MAT KHAU")) return MaThaoTacNhatKy.DOI_MAT_KHAU;
            if (ContainsAny(action, "APPROVE", "PHE DUYET", "DUYET")) return MaThaoTacNhatKy.PHE_DUYET;
            if (ContainsAny(action, "CONFIRM", "ACTIVATE", "XAC NHAN")) return MaThaoTacNhatKy.XAC_NHAN;
            if (ContainsAny(action, "DELETE", "REMOVE") || ContainsWord(action, "XOA")) return MaThaoTacNhatKy.XOA;
            if (ContainsAny(action, "CREATE", "INSERT", "THEM MOI")
                || action.StartsWith("ADD", StringComparison.Ordinal)
                || ContainsWord(action, "THEM"))
                return MaThaoTacNhatKy.THEM_MOI;
            if (ContainsAny(action, "UPDATE", "EDIT", "CAP NHAT", "SAVE")) return MaThaoTacNhatKy.CAP_NHAT;

            if (string.Equals(method, "POST", StringComparison.Ordinal)
                && ContainsAny(combined, "NHAP DU LIEU", "NHAPDULIEU", "IMPORT", "UPLOAD"))
                return MaThaoTacNhatKy.NHAP_DU_LIEU;

            // Các API xem trước/kiểm tra tiến trình không phải là lần đồng bộ thực tế.
            bool technicalRead = ContainsAny(combined,
                "PREVIEW", "VALIDATE", "PROGRESS", "STATUS", "SCHEMA", "OPTIONS", "RESOLVE",
                "CHECK LOGIN", "REFRESH TOKEN", "VERIFY TEMP TOKEN");
            if (!technicalRead && ContainsAny(combined, "DONG BO", "DONGBO", "SYNC"))
                return MaThaoTacNhatKy.DONG_BO;

            if (ContainsAny(combined, "KHOI PHUC", "RESTORE")) return MaThaoTacNhatKy.KHOI_PHUC;
            if (ContainsAny(combined, "MO KHOA", "UNLOCK")) return MaThaoTacNhatKy.MO_KHOA;
            if (ContainsAny(combined, "RESET PASSWORD", "RESETDEFAULTPASSWORD", "DAT LAI MAT KHAU"))
                return MaThaoTacNhatKy.DAT_LAI_MAT_KHAU;
            if (ContainsAny(combined, "CHANGE PASSWORD", "DOI MAT KHAU")) return MaThaoTacNhatKy.DOI_MAT_KHAU;
            if (ContainsAny(combined, "LOCK") || ContainsWord(combined, "KHOA")) return MaThaoTacNhatKy.KHOA;
            if (ContainsAny(combined, "PHE DUYET", "APPROVE", "DUYET")) return MaThaoTacNhatKy.PHE_DUYET;
            if (ContainsAny(combined, "TU CHOI", "REJECT")) return MaThaoTacNhatKy.TU_CHOI;
            if (ContainsAny(combined, "XAC NHAN", "CONFIRM")) return MaThaoTacNhatKy.XAC_NHAN;
            if (ContainsAny(combined, "CANCEL", "HUY")) return MaThaoTacNhatKy.HUY;
            if (ContainsAny(combined, "DELETE", "REMOVE") || ContainsWord(combined, "XOA"))
                return MaThaoTacNhatKy.XOA;
            if (ContainsAny(combined, "CREATE", "INSERT", "ADD", "THEM MOI") || ContainsWord(combined, "THEM"))
                return MaThaoTacNhatKy.THEM_MOI;
            if (ContainsAny(combined, "UPDATE", "EDIT", "CAP NHAT", "SAVE")) return MaThaoTacNhatKy.CAP_NHAT;

            if (string.Equals(method, "DELETE", StringComparison.Ordinal)) return MaThaoTacNhatKy.XOA;
            if (string.Equals(method, "PUT", StringComparison.Ordinal)
                || string.Equals(method, "PATCH", StringComparison.Ordinal))
                return MaThaoTacNhatKy.CAP_NHAT;

            if (string.Equals(method, "POST", StringComparison.Ordinal))
            {
                // POST đang được dùng cho cả tìm kiếm; loại các API chỉ đọc để giảm log rác.
                if (technicalRead || IsReadAction(action) || ContainsAny(combined,
                    "SEARCH", "TIM KIEM", "GET ", "GET_", "DANH SACH", "LIST", "FILTER"))
                {
                    return null;
                }

                // POST nghiệp vụ không đặt tên chuẩn vẫn phải được ghi để không bỏ sót cập nhật.
                return MaThaoTacNhatKy.CAP_NHAT;
            }

            return null;
        }

        private static NhatKyPlan CreatePlan(
            string functionCode,
            string actionCode,
            string description,
            string controller,
            string action)
        {
            return new NhatKyPlan
            {
                MaChucNang = string.IsNullOrWhiteSpace(functionCode) ? "HE_THONG" : functionCode,
                MaThaoTac = actionCode,
                NoiDung = string.IsNullOrWhiteSpace(description)
                    ? BuildDescription(actionCode, controller)
                    : description,
                Controller = controller,
                Action = action
            };
        }

        private static string GetActionLabel(string actionCode)
        {
            switch (actionCode)
            {
                case MaThaoTacNhatKy.DANG_NHAP: return "Đăng nhập";
                case MaThaoTacNhatKy.DANG_XUAT: return "Đăng xuất";
                case MaThaoTacNhatKy.XEM: return "Xem dữ liệu";
                case MaThaoTacNhatKy.TIM_KIEM: return "Tìm kiếm";
                case MaThaoTacNhatKy.TAI_XUONG: return "Tải xuống";
                case MaThaoTacNhatKy.XUAT_BAO_CAO: return "Xuất báo cáo";
                case MaThaoTacNhatKy.NHAP_DU_LIEU: return "Nhập dữ liệu";
                case MaThaoTacNhatKy.DONG_BO: return "Đồng bộ dữ liệu";
                case MaThaoTacNhatKy.THEM_MOI: return "Thêm mới dữ liệu";
                case MaThaoTacNhatKy.XOA: return "Xóa dữ liệu";
                case MaThaoTacNhatKy.KHOI_PHUC: return "Khôi phục dữ liệu";
                case MaThaoTacNhatKy.PHE_DUYET: return "Phê duyệt";
                case MaThaoTacNhatKy.TU_CHOI: return "Từ chối";
                case MaThaoTacNhatKy.XAC_NHAN: return "Xác nhận";
                case MaThaoTacNhatKy.HUY: return "Hủy thao tác";
                case MaThaoTacNhatKy.KHOA: return "Khóa";
                case MaThaoTacNhatKy.MO_KHOA: return "Mở khóa";
                case MaThaoTacNhatKy.DOI_MAT_KHAU: return "Đổi mật khẩu";
                case MaThaoTacNhatKy.DAT_LAI_MAT_KHAU: return "Đặt lại mật khẩu";
                default: return "Cập nhật dữ liệu";
            }
        }

        private static string BuildDescription(string actionCode, string controller)
        {
            string actionLabel = GetActionLabel(actionCode);
            if (DanhMucChucNangNhatKy.TryGet(controller, out ThongTinChucNangNhatKy function)
                && !string.IsNullOrWhiteSpace(function.Ten))
            {
                return actionLabel + " - " + function.Ten;
            }

            return actionLabel;
        }

        private static bool ContainsAny(string value, params string[] terms)
        {
            return terms.Any(term => value.Contains(term, StringComparison.Ordinal));
        }

        private static bool ContainsWord(string value, string word)
        {
            return (" " + value + " ").Contains(" " + word + " ", StringComparison.Ordinal);
        }

        private static bool IsReadAction(string action)
        {
            string[] prefixes =
            {
                "GET", "SEARCH", "TIM", "LIST", "DANH SACH", "CHECK",
                "PREVIEW", "VALIDATE", "FILTER", "LOAD"
            };
            return prefixes.Any(prefix => action.StartsWith(prefix, StringComparison.Ordinal));
        }

        private static string NormalizeCode(string value)
        {
            string normalized = Normalize(value).Replace(' ', '_');
            return string.IsNullOrWhiteSpace(normalized) ? "HE_THONG" : normalized;
        }

        private static string Normalize(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            string decomposed = value.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder(decomposed.Length);
            foreach (char character in decomposed)
            {
                if (character == 'Đ' || character == 'đ')
                {
                    builder.Append('D');
                    continue;
                }

                var category = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(character);
                if (category != System.Globalization.UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(char.IsLetterOrDigit(character) ? char.ToUpperInvariant(character) : ' ');
                }
            }

            return string.Join(" ", builder.ToString()
                .Normalize(NormalizationForm.FormC)
                .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
        }
    }
}
