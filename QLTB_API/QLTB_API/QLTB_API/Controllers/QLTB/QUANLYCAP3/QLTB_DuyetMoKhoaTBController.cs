using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.DANH_MUC;
using QLTB_API.Models.QLTB.QUANLYCAP3;

namespace QLTB_API.Controllers.QLTB.QUANLYCAP3
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    //[Authorize]
    public class QLTB_DuyetMoKhoaTBController : ControllerBase
    {
        private readonly QLTB_DuyetMoKhoaTB_Manager _manager;

        public QLTB_DuyetMoKhoaTBController()
        {
            _manager = new QLTB_DuyetMoKhoaTB_Manager();
        }

        #region Duyệt thiết bị mới
        [HttpGet]
        [Route("duyetthietbimoi/get")]
        public ActionResult GET_DUYET_TBIMOI_CNTT([FromQuery] string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_DUYET_TBIMOI_CNTT(pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
                    ma_nhom_tbi, trang_thai, mk_ngay_khoa_tu, mk_ngay_khoa_den, out totalItems);
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
        [Route("duyetthietbimoi/get_v2")]
        public ActionResult GET_DUYET_TBIMOI_CNTT_V2([FromQuery] string id, string search_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string tbi_dm_chungloai_id, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_DUYET_TBIMOI_CNTT_V2(pageIndex, pageSize, id, search_thietbi, ma_dviqly,
                    ma_nhom_tbi, tbi_dm_chungloai_id, trang_thai, mk_ngay_khoa_tu, mk_ngay_khoa_den, out totalItems);
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

        [HttpPut]
        [Route("duyetthietbimoi/update")]
        public IActionResult Update_DUYET_TBIMOI([FromBody]  DuyetThietBiRequest request)
        {
            try
            {
                string result = _manager.Update_DUYET_TBIMOI(request);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("duyetthietbimoi/updatemulti")]
        public IActionResult Update_DUYET_TBIMOI_MULTI([FromBody] DuyetThietBiMultiRequest request)
        {
            try
            {
                string result = _manager.Update_DUYET_TBIMOI_MULTI(request);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion

        #region Duyệt mở khóa thiết bị được yêu cầu
        [HttpGet]
        [Route("duyetmokhoa/get")]
        public ActionResult GET_DUYETMOKHOA_CNTT([FromQuery] string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_DUYETMOKHOA_CNTT(pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
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
        [Route("duyetmokhoa/get_v2")]
        public ActionResult GET_DUYETMOKHOA_CNTT_V2([FromQuery] string id, string search_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string tbi_dm_chungloai_id, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_DUYETMOKHOA_CNTT_V2(pageIndex, pageSize, id, search_thietbi, ma_dviqly,
                    ma_nhom_tbi, tbi_dm_chungloai_id, trang_thai, duyet_tbi, mk_ngay_khoa_tu, mk_ngay_khoa_den, out totalItems);
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

        [HttpPut]
        [Route("duyetmokhoa/update")]
        public IActionResult Update_DUYET_MOKHOA([FromBody] DuyetThietBiRequest request)
        {
            try
            {
                string result = _manager.Update_DUYET_MOKHOA(request);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("duyetmokhoa/updatemulti")]
        public IActionResult Update_DUYET_MOKHOA_MULTI([FromBody] DuyetThietBiMultiRequest request)
        {
            try
            {
                string result = _manager.Update_DUYET_MOKHOA_MULTI(request);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }


        #endregion
    }
}
