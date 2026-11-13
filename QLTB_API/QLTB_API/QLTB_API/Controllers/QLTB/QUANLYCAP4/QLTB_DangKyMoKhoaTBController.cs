using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.DANH_MUC;
using QLTB_API.Models.QLTB.QUANLYCAP4;

namespace QLTB_API.Controllers.QLTB.QUANLYCAP4
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    //[Authorize]
    public class QLTB_DangKyMoKhoaTBController : ControllerBase
    {
        private readonly QLTB_DangKyMoKhoaTB_Manager _manager;

        public QLTB_DangKyMoKhoaTBController()
        {
            _manager = new QLTB_DangKyMoKhoaTB_Manager();
        }

        #region Mở khóa thiết bị được yêu cầu
        [HttpGet]
        [Route("dangkymokhoa/get")]
        public ActionResult GET_MOKHOA_TBI_CNTT([FromQuery] string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_MOKHOA_TBI_CNTT(pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
                    ma_nhom_tbi, trang_thai, duyet_tbi, mk_ngay_khoa_tu, mk_ngay_khoa_den, out totalItems);
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
        [Route("dangkymokhoa/get_v2")]
        public ActionResult GET_MOKHOA_TBI_CNTT_V2([FromQuery] string id, string search_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string tbi_dm_chungloai_id, string tbi_trangthai_id, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_MOKHOA_TBI_CNTT_V2(pageIndex, pageSize, id, search_thietbi, ma_dviqly,
                    ma_nhom_tbi, tbi_dm_chungloai_id, tbi_trangthai_id, trang_thai, duyet_tbi, mk_ngay_khoa_tu, mk_ngay_khoa_den, out totalItems);
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
        [Route("dangkymokhoa/insert")]
        public IActionResult Insert_QLTB_DKMOKHOA([FromBody] DangKyMoKhoaRequest model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DKMOKHOA(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dangkymokhoa/insertmulti")]
        public IActionResult Insert_QLTB_DKMOKHOA_MULTI([FromBody] DangKyMoKhoaMultiRequest model)
        {
            try
            {
                string result = _manager.Insert_QLTB_DKMOKHOA_MULTI(model);
                bool isSuccess = string.IsNullOrEmpty(result) || result.ToString().StartsWith("Đăng ký mở khóa thành công");
                return isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }


        [HttpDelete]
        [Route("dangkymokhoa/delete/{id}")]
        public IActionResult Delete_QLTB_DKMOKHOA(string id)
        {
            try
            {
                string result = _manager.Delete_QLTB_DKMOKHOA(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dangkymokhoa/deletemulti")]
        public IActionResult Delete_QLTB_DKMOKHOA_MULTI([FromBody] List<string> ids)
        {
            try
            {
                string result = _manager.Delete_QLTB_DKMOKHOA_MULTI(ids);
                bool isSuccess = string.IsNullOrEmpty(result) || result.ToString().StartsWith("Hủy đăng ký thành công");
                return isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }

        }
        #endregion
    }
}
