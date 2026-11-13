using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using QLTB_API.Models.QLTB.QLTB_DANH_MUC;
using QLTB_API.Models.QLTB.DANH_MUC;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;


namespace QLTB_API.Controllers.QLTB.DANH_MUC
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    //[Authorize]
    public class QLTB_DANH_MUCController : ControllerBase
    {
        private readonly QLTB_DANH_MUC_Manager _manager;

        public QLTB_DANH_MUCController()
        {
            _manager = new QLTB_DANH_MUC_Manager();
        }

        #region Danh mục nước SX
        //[AllowAnonymous]
        [HttpGet]
        [Route("nuocsx/get")]
        public ActionResult Get_QLTB_DM_NUOCSX([FromQuery] string id, string ma_nuoc_sx, string ten_nuoc_sx, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_NUOCSX_Model> data = _manager.Get_QLTB_DM_NUOCSX(pageIndex, pageSize, id, ma_nuoc_sx, ten_nuoc_sx, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("nuocsx/insert")]
        public IActionResult INSERT_QLTB_DM_NUOCSX([FromBody] QLTB_DM_NUOCSX_Model model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DM_NUOCSX(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("nuocsx/update")]
        public IActionResult Update_QLTB_DM_NUOCSX([FromBody] QLTB_DM_NUOCSX_Model model)
        {
            try
            {
                string result = _manager.Update_QLTB_DM_NUOCSX(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("nuocsx/delete/{id}")]
        public IActionResult Delete_QLTB_DM_NUOCSX(int id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_NUOCSX(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục nhóm thiết bị

        [HttpGet]
        [Route("nhom/get")]
        public ActionResult Get_QLTB_DM_NHOM([FromQuery] string searchData, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_NHOM_Model> data = _manager.Get_QLTB_DM_NHOM(pageIndex, pageSize, searchData, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("loai_nghiepvu/get")]
        public ActionResult Get_TBI_DM_LOAI_NGHIEPVU([FromQuery] string ma_loai_nghiepvu, string ten_loai_nghiepvu, int? loai_bban, int? cap_nghiepvu)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_LOAI_NGHIEPVU_Model> data = _manager.Get_TBI_DM_LOAI_NGHIEPVU(ma_loai_nghiepvu, ten_loai_nghiepvu, loai_bban, cap_nghiepvu, out totalItems);
                var result = new
                {
                    totalItems,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("nhom/insert")]
        public IActionResult Insert_QLTB_DM_NHOM([FromBody] QLTB_DM_NHOM_Model model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DM_NHOM(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("nhom/update")]
        public IActionResult Update_QLTB_DM_NHOM([FromBody] QLTB_DM_NHOM_Model model)
        {
            try
            {
                string result = _manager.Update_QLTB_DM_NHOM(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("nhom/delete/{id}")]
        public IActionResult Delete_QLTB_DM_NHOM(int id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_NHOM(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục chủng loại thiết bị

        [HttpGet]
        [Route("chungloai/get")]
        public ActionResult Get_QLTB_DM_CHUNGLOAI([FromQuery] string id, string ma_nhom, string ma_chungloai, string ten_chungloai, string can_chon_nsd, string co_thongtin_ct, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_CHUNGLOAI_Model> data = _manager.Get_QLTB_DM_CHUNGLOAI(pageIndex, pageSize, id, ma_nhom, ma_chungloai, ten_chungloai, can_chon_nsd, co_thongtin_ct, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("chungloai/insert")]
        public IActionResult Insert_QLTB_DM_CHUNGLOAI([FromBody] QLTB_DM_CHUNGLOAI_Model model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DM_CHUNGLOAI(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("chungloai/update")]
        public IActionResult Update_QLTB_DM_CHUNGLOAI([FromBody] QLTB_DM_CHUNGLOAI_Model model)
        {
            try
            {
                string result = _manager.Update_QLTB_DM_CHUNGLOAI(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("chungloai/delete/{id}")]
        public IActionResult Delete_QLTB_DM_CHUNGLOAI(int id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_CHUNGLOAI(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục hãng sản xuất

        [HttpGet]
        [Route("hangsx/get")]
        public ActionResult Get_QLTB_DM_HANGSX([FromQuery] string searchData, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_HANGSX_Model> data = _manager.Get_QLTB_DM_HANGSX(pageIndex, pageSize, searchData, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("hangsx/insert")]
        public IActionResult Insert_QLTB_DM_HANGSX([FromBody] QLTB_DM_HANGSX_Model model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DM_HANGSX(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("hangsx/update")]
        public IActionResult Update_QLTB_DM_HANGSX([FromBody] QLTB_DM_HANGSX_Model model)
        {
            try
            {
                string result = _manager.Update_QLTB_DM_HANGSX(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("hangsx/delete/{id}")]
        public IActionResult Delete_QLTB_DM_HANGSX(int id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_HANGSX(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục trạng thái thiết bị
        [HttpGet]
        [Route("trangthai/get")]
        public ActionResult Get_QLTB_DM_TRANGTHAI([FromQuery] string id, string ma, string ten, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_TRANGTHAI_Model> data = _manager.Get_QLTB_DM_TRANGTHAI(pageIndex, pageSize, id, ma, ten, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục đơn vị tính
        [HttpGet]
        [Route("donvitinh/get")]
        public ActionResult Get_QLTB_DM_DONVITINH([FromQuery] string id, string ma, string ten, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_DONVITINH_Model> data = _manager.Get_QLTB_DM_DONVITINH(pageIndex, pageSize, id, ma, ten, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục kho
        [HttpGet]
        [Route("kho/get")]
        public ActionResult Get_QLTB_DM_KHO([FromQuery] string id, string ma_dviqly, string ma_kho, string ten_kho, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_KHO_Model> data = _manager.Get_QLTB_DM_KHO(pageIndex, pageSize, id, ma_dviqly, ma_kho, ten_kho, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("kho/insert")]
        public IActionResult Insert_QLTB_DM_KHO([FromBody] QLTB_DM_KHO_Model model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DM_KHO(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("kho/update")]
        public IActionResult Update_QLTB_DM_KHO([FromBody] QLTB_DM_KHO_Model model)
        {
            try
            {
                string result = _manager.Update_QLTB_DM_KHO(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("kho/delete/{id}")]
        public IActionResult Delete_QLTB_DM_KHO(int id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_KHO(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Danh mục thiết bị
        [HttpGet]
        [Route("thietbi/get")]
        public ActionResult Get_QLTB_DM_THIETBI([FromQuery] string id, string tbi_dm_chungloai_id, string ma_nhom_tbi, string tbi_dm_hangsx_id,
            string tbi_nuocsx_id, string tbi_kho_id, string tbi_trangthai_id, string dm_donvitinh_id, string dm_donvi_id, string dm_phongban_id,
            string search_thietbi, string qr_code, string ngay_vanhanh, string ngay_tao, string ngay_duyet,
            string nguoi_tao, string nguoi_duyet, string khoa_tbi, string duyet_tbi, string ma_dviqly, string namsx, string thong_tin_khac, int? trang_thai_khoa, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.Get_QLTB_DM_THIETBI(pageIndex, pageSize, id, tbi_dm_chungloai_id, ma_nhom_tbi, tbi_dm_hangsx_id,
                    tbi_nuocsx_id, tbi_kho_id, tbi_trangthai_id, dm_donvitinh_id, dm_donvi_id, dm_phongban_id,
                    search_thietbi, qr_code, ngay_vanhanh, ngay_tao, ngay_duyet,
                    nguoi_tao, nguoi_duyet, khoa_tbi, duyet_tbi, ma_dviqly, namsx, thong_tin_khac, trang_thai_khoa, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("thietbi/get_giaonhan")]
        public ActionResult Get_TBI_BANGIAO_CNTT([FromQuery] string id, int bban_id, string tbi_dm_chungloai_id, string tbi_kho_id,
        string ma_thietbi, string no_thietbi, string ten_thietbi, string ma_dviqly, string phongban_id, string loai_nghiepvu, string nguoi_sd, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.Get_TBI_BANGIAO_CNTT(pageIndex, pageSize, id, bban_id, tbi_dm_chungloai_id, tbi_kho_id, 
                    ma_thietbi, no_thietbi, ten_thietbi, ma_dviqly, phongban_id, loai_nghiepvu, nguoi_sd, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        //Lấy danh sách thiết bị đo xa hoặc CNTT ở kho P4 để thu hồi về Cty hoặc xác nhận cũ hỏng để thanh lý:
        [HttpGet]
        [Route("thietbi/get_trongkhoC4")]
        public ActionResult get_TBI_CNTT_TRONGKHO_C4([FromQuery] string id, int bban_id, string ma_nhom_thietbi, string tbi_dm_chungloai_id, string tbi_kho_id,
        string ma_thietbi, string no_thietbi, string ten_thietbi, string ma_dviqly, string phongban_id, string loai_nghiepvu, string nguoi_sd, int pageIndex = 1, int pageSize = 10)
         {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.get_TBI_CNTT_TRONGKHO_C4(pageIndex, pageSize, id, bban_id, ma_nhom_thietbi, tbi_dm_chungloai_id, tbi_kho_id,
                    ma_thietbi, no_thietbi, ten_thietbi, ma_dviqly, phongban_id, loai_nghiepvu, nguoi_sd, out totalItems);
                var result = new
                {
                    totalItems,
                    pageIndex,
                    pageSize,
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("thietbi/insert")]
        public IActionResult Insert_QLTB_DM_THIETBI([FromBody] QLTB_DM_THIETBI_Model model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DM_THIETBI(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("thietbi/update")]
        public IActionResult Update_QLTB_DM_THIETBI([FromBody] QLTB_DM_THIETBI_Model model)
        {
            try
            {
                string result = _manager.Update_QLTB_DM_THIETBI(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("thietbi/delete/{id}")]
        public IActionResult Delete_QLTB_DM_THIETBI(string id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_THIETBI(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("thietbi/deletemulti")]
        public IActionResult Delete_QLTB_DM_THIETBI_MULTI([FromBody] List<string> ids)
        {
            try
            {
                string result = _manager.Delete_QLTB_DM_THIETBI_MULTI(ids);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Import thiết bị từ excel
        // Tải file Excel mẫu nhập thiết bị
        [HttpGet("thietbi/download-template")]
        public IActionResult DownloadTemplate([FromQuery] string current_madviqly)
        {
            if (string.IsNullOrEmpty(current_madviqly))
                return BadRequest("Thiếu mã đơn vị.");

            // Lấy byte array của file Excel từ manager
            var excelBytes = _manager.GetThietBiTemplate(current_madviqly);

            // Tên file động theo ngày
            var fileName = $"MauNhapThietBi_{DateTime.Now:yyyyMMdd}.xlsx";

            return File(
                excelBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName
            );
        }

        [HttpPost("thietbi/import")]
        public async Task<IActionResult> ImportThietBi(IFormFile file, [FromQuery] string ma_dvi,string username, string duyet_ngay)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Chưa upload file Excel." });

            try
            {
                // Gọi service xử lý import
                var (totalValid, errors) = await _manager.ImportExcelThietBi(file, ma_dvi, username, duyet_ngay);

                // Trả về kết quả
                return Ok(new
                {
                    success = totalValid > 0, //trạng thái thành công phụ thuộc có bản ghi nào được thêm vào không
                    totalValid,
                    totalError = errors.Count,
                    errors
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server: " + ex });
            }
        }

        [HttpPost("thietbi/import_v2")]
        public async Task<IActionResult> ImportExcelThietBi_WithErrorFile(
            IFormFile file,
            [FromQuery] string ma_dvi,
            string username,
            string duyet_ngay)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Chưa upload file Excel."
                });
            }

            try
            {
                var result = await _manager.ImportExcelThietBi_WithErrorFile(
                    file, ma_dvi, username, duyet_ngay
                );

                /* ===== CÓ LỖI → TRẢ FILE EXCEL ===== */
                if (result.ErrorFile != null)
                {
                    return Ok(new
                    {
                        success = false,
                        totalValid = result.TotalValid,
                        fileName = "ThietBi_Loi.xlsx",
                        fileContent = Convert.ToBase64String(result.ErrorFile),
                        message = $"Import thành công {result.TotalValid} thiết bị. Một số dòng import có lỗi. Vui lòng mở file để chỉnh sửa."
                    });
                }   

                /* ===== KHÔNG CÓ LỖI ===== */
                return Ok(new
                {
                    success = true,
                    totalValid = result.TotalValid,
                    message = $"Import thành công {result.TotalValid} thiết bị."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi server",
                    detail = ex.Message
                });
            }
        }


        #endregion
    }
}
