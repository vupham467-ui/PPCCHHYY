using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.QUANLYCHUNG;

namespace QLTB_API.Controllers.QLTB.QUANLYCHUNG
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    public class QLTB_KiemKeThietBiController : ControllerBase
    {
        private readonly QLTB_KiemKeThietBi_Manager _manager;

        public QLTB_KiemKeThietBiController()
        {
            _manager = new QLTB_KiemKeThietBi_Manager();
        }

        #region Kiểm kê thiết bị CNTT

        [HttpGet]
        [Route("kiemkethietbi/get")]
        public ActionResult GET_BBAN_KIEMKE_CNTT([FromQuery] string id, int? loai_kiemke, string ma_dvi_kiemke, string phongban_kiemke_id, string ma_nhom_thietbi,
            int? trang_thai, string tu_ngay, string den_ngay, string user, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                if (loai_kiemke == 3)
                {
                    ma_dvi_kiemke = "PA23";
                }
                else if (loai_kiemke == 4)
                {
                    phongban_kiemke_id = null;
                }

                int totalItems = 0;
                List<QLTB_KiemKeThietBi_Model> data = _manager.GET_BBAN_KIEMKE_CNTT(
                    pageIndex, pageSize, id, loai_kiemke, ma_dvi_kiemke, phongban_kiemke_id, ma_nhom_thietbi,
                    trang_thai, tu_ngay, den_ngay, user, out totalItems);

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
        [Route("kiemkethietbi/get_by_id")]
        public ActionResult GET_BBAN_KIEMKE_CNTT_BY_ID([FromQuery] string id)
        {
            try
            {
                QLTB_KiemKeThietBi_Model data = _manager.GET_BBAN_KIEMKE_CNTT_BY_ID(id);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("kiemkethietbi/getthietbi")]
        public ActionResult GET_TBI_BY_BBAN_KIEMKE_ID([FromQuery] string bban_id)
        {
            try
            {
                List<QLTB_KiemKeThietBiDetail_Model> data = _manager.GET_TBI_BY_BBAN_KIEMKE_ID(bban_id);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("kiemkethietbi/preview_thietbi")]
        public ActionResult GET_DS_TBI_DE_KIEMKE([FromQuery] int loai_kiemke, string ma_dviqly, string phongban_id, string ma_nhom_thietbi = "CNTT")
        {
            try
            {
                if (loai_kiemke != 3 && loai_kiemke != 4)
                {
                    return BadRequest("LOAI_KIEMKE chỉ nhận giá trị 3 hoặc 4.");
                }
                List<QLTB_KiemKeThietBiDetail_Model> data = _manager.GET_DS_TBI_DE_KIEMKE(loai_kiemke, ma_dviqly, phongban_id, ma_nhom_thietbi);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("kiemkethietbi/insert")]
        public IActionResult INSERT_BBAN_KIEMKE_CNTT([FromBody] KiemKeThietBiInsertRequest model)
        {
            try
            {
                if (model == null || (model.loai_kiemke != 3 && model.loai_kiemke != 4))
                {
                    return BadRequest("LOAI_KIEMKE chỉ nhận giá trị 3 hoặc 4.");
                }
                if (string.IsNullOrWhiteSpace(model.ma_nhom_thietbi) || string.IsNullOrWhiteSpace(model.ten_nhom_thietbi))
                {
                    return BadRequest("Vui lòng chọn nhóm thiết bị.");
                }
                if (model.loai_kiemke == 3)
                {
                    if (string.IsNullOrWhiteSpace(model.phongban_kiemke_id) || string.IsNullOrWhiteSpace(model.ten_phongban_kiemke))
                    {
                        return BadRequest("Vui lòng chọn phòng ban sử dụng.");
                    }
                    model.ma_dvi_kiemke = "PA23";
                    model.ten_dvi_kiemke = model.ten_phongban_kiemke;
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(model.ma_dvi_kiemke) || string.IsNullOrWhiteSpace(model.ten_dvi_kiemke))
                    {
                        return BadRequest("Vui lòng chọn đơn vị cấp 4 sử dụng.");
                    }
                    model.phongban_kiemke_id = null;
                    model.ten_phongban_kiemke = null;
                }
                string result = _manager.INSERT_BBAN_KIEMKE_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Tạo biên bản kiểm kê thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("kiemkethietbi/update")]
        public IActionResult UPDATE_BBAN_KIEMKE_CNTT([FromBody] KiemKeThietBiUpdateRequest model)
        {
            try
            {
                string result = _manager.UPDATE_BBAN_KIEMKE_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật kết quả kiểm kê thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("kiemkethietbi/delete")]
        public IActionResult DELETE_BBAN_KIEMKE_CNTT([FromQuery] string id)
        {
            try
            {
                string result = _manager.DELETE_BBAN_KIEMKE_CNTT(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa biên bản thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("kiemkethietbi/cancel")]
        public IActionResult HUY_BBAN_KIEMKE_CNTT([FromBody] CancelKiemKeRequest model)
        {
            try
            {
                string result = _manager.HUY_BBAN_KIEMKE_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Hủy biên bản thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion
    }
}
