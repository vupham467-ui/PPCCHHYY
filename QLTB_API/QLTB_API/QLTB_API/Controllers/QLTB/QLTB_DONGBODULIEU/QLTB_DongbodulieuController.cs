using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.QLTB_DONGBODULIEU;

namespace QLTB_API.Controllers.QLTB.QLTB_DONGBODULIEU
{
    [Route("APIPCHY/[controller]")]
    [ApiController]

    public class QLTB_DongbodulieuController : ControllerBase
    {
        private readonly QLTB_DONGBODULIEU_Manager _manager;

        public QLTB_DongbodulieuController()
        {
            _manager = new QLTB_DONGBODULIEU_Manager();
        }

        [HttpGet]
        [Route("dongbothietbicu/getthietbi")]
        public ActionResult get_STG_THIETBI_OLD([FromQuery] int? sync_status, string ma_dviqly, string ma_nhom_tbi, string tbi_trangthai_new, string duyet_tbi,
            string tbi_dm_chungloai_id, string no_thietbi, string ma_thietbi, string ten_thietbi, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_DULIEU_THIETBI_MAPPING_Model> data = _manager.get_STG_THIETBI_OLD(pageIndex, pageSize, sync_status, ma_dviqly, ma_nhom_tbi, tbi_trangthai_new, duyet_tbi,
                    tbi_dm_chungloai_id, no_thietbi, ma_thietbi, ten_thietbi, out totalItems);
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
        [Route("dongbothietbicu/get_by_id")]
        public ActionResult get_STG_THIETBI_OLD_BY_ID([FromQuery] string id)
        {
            try
            {
                QLTB_DULIEU_THIETBI_MAPPING_Model data = _manager.get_STG_THIETBI_OLD_BY_ID(id);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dongbothietbicu/update")]
        public IActionResult update_STG_THIETBI_OLD([FromBody] QLTB_UpdateData_TBCu_Model model)
        {
            try
            {
                string result = _manager.update_STG_THIETBI_OLD(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dongbothietbicu/update_doxa_multi")]
        public IActionResult update_STG_THIETBI_DX_BY_DVI([FromBody] QLTB_UpdateData_TBDoxaCu_Model model)
        {
            try
            {
                string result = _manager.update_STG_THIETBI_DX_BY_DVI(model);
                bool isSuccess =
                    result.Contains("Cập nhật thành công", StringComparison.OrdinalIgnoreCase);
                return isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dongbothietbicu/rollback_doxa_multi")]
        public IActionResult rollback_STG_THIETBI_DX_BY_DVI([FromBody] QLTB_UpdateData_TBDoxaCu_Model model)
        {
            try
            {
                string result = _manager.rollback_STG_THIETBI_DX_BY_DVI(model);
                bool isSuccess =
                    result.Contains("Rollback thành công", StringComparison.OrdinalIgnoreCase);
                return isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dongbothietbicu/sync")]
        public IActionResult sync_one_TBI_from_STG([FromBody] QLTB_SyncData_TBCu_Model model)
        {
            try
            {
                string result = _manager.sync_one_TBI_from_STG(model);
                return string.IsNullOrEmpty(result) ? Ok("Đồng bộ thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("dongbothietbicu/sync_multi")]
        public IActionResult sync_list_TBI_from_STG([FromBody] QLTB_SyncData_TBCu_Multi_Model request)
        {
            try
            {
                string result = _manager.sync_list_TBI_from_STG(request);
                bool isSuccess =
                    result.Contains("Đồng bộ hoàn tất", StringComparison.OrdinalIgnoreCase) ||
                    result.Contains("Đồng bộ thành công", StringComparison.OrdinalIgnoreCase);

                return isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
    }
}
