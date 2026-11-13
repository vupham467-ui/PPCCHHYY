using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.DANH_MUC;
using QLTB_API.Models.QLTB.QUANLYCAP3;
using System.Collections.Generic;
using System;

namespace QLTB_API.Controllers.QLTB.QUANLYCAP3
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    //[Authorize]
    public class QLTB_KiemTraTBController : ControllerBase
    {
        private readonly QLTB_KiemTraTB_Manager _manager;

        public QLTB_KiemTraTBController()
        {
            _manager = new QLTB_KiemTraTB_Manager();
        }

        #region Kiểm tra thiết bị
        [HttpGet]
        [Route("kiemtrathietbi/get")]
        public ActionResult GET_KIEMTRA_TB_CNTT([FromQuery] string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
            string donvi_kiemtra, string nguoi_kiemtra, string ket_qua, string tbi_trangthai_id, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_KiemTraTB_Model> data = _manager.GET_KIEMTRA_TB_CNTT(pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
                    donvi_kiemtra, nguoi_kiemtra, ket_qua, tbi_trangthai_id, out totalItems);
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
        [Route("kiemtrathietbi/get_v2")]
        public ActionResult GET_KIEMTRA_TB_CNTT_V2([FromQuery] string id, string search_thietbi, string ma_nhom_tbi, string tbi_dm_chungloai_id, string check, string ma_dviqly,
            string donvi_kiemtra, string nguoi_kiemtra, string ket_qua, string tbi_trangthai_id, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_KiemTraTB_Model> data = _manager.GET_KIEMTRA_TB_CNTT_V2(pageIndex, pageSize, id, search_thietbi, ma_nhom_tbi, tbi_dm_chungloai_id, check, ma_dviqly,
                    donvi_kiemtra, nguoi_kiemtra, ket_qua, tbi_trangthai_id, out totalItems);
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
        [Route("kiemtrathietbi/get_lichsu")]
        public ActionResult GET_LS_KIEMTRA_CNTT([FromQuery] string tbi_id, string donvi_kiemtra, string nguoi_kiemtra, string ket_qua, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_KiemTraTB_Model> data = _manager.GET_LS_KIEMTRA_CNTT(pageIndex, pageSize, tbi_id,
                    donvi_kiemtra, nguoi_kiemtra, ket_qua, out totalItems);
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
        [Route("kiemtrathietbi/insert")]
        public IActionResult INSERT_KIEMTRATB_CNTT([FromBody] KiemTraThietBiRequest request)
        {
            try
            {
                string result = _manager.INSERT_KIEMTRATB_CNTT(request);
                return string.IsNullOrEmpty(result) ? Ok("Thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("kiemtrathietbi/insertmulti")]
        public IActionResult INSERT_KIEMTRATB_CNTT_MULTI([FromBody] KiemTraThietBiMultiRequest request)
        {
            try
            {
                string result = _manager.INSERT_KIEMTRATB_CNTT_MULTI(request);
                return string.IsNullOrEmpty(result) ? Ok("Thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
        #endregion
    }
}
