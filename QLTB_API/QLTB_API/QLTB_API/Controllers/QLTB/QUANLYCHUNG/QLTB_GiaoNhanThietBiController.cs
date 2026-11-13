using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.QUANLYCHUNG;
using QLTB_API.Models.QLTB.DANH_MUC;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;

namespace QLTB_API.Controllers.QLTB.QUANLYCHUNG
{
    [Route("APIPCHY/[controller]")]
    [ApiController]

    public class QLTB_GiaoNhanThietBiController : ControllerBase
    {
        private readonly QLTB_GiaoNhanThietBi_Manager _manager;

        public QLTB_GiaoNhanThietBiController()
        {
            _manager = new QLTB_GiaoNhanThietBi_Manager();
        }

        #region Giao nhận thiết bị
        [HttpGet]
        [Route("giaonhanthietbi/get")]
        public ActionResult GET_BBGIAONHAN_TB_CNTT([FromQuery] string id, string loai_bban, string loai_nghiepvu, string ma_dvi_giao, string ma_dvi_nhan, string phongban_giao_id, string phongban_nhan_id,
                string nguoi_giao, string nguoi_nhan, int? trang_thai, string tu_ngay, string den_ngay, string user, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_GiaoNhanThietBi_Model> data = _manager.GET_BBGIAONHAN_TB_CNTT(pageIndex, pageSize, id, loai_bban, loai_nghiepvu, ma_dvi_giao, ma_dvi_nhan, phongban_giao_id, phongban_nhan_id,
                    nguoi_giao, nguoi_nhan, trang_thai, tu_ngay, den_ngay, user, out totalItems);
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
        [Route("giaonhanthietbi/get_by_id")]
        public ActionResult GET_BBGIAONHAN_TB_CNTT_BY_ID([FromQuery] string id)
        {
            try
            {
                QLTB_GiaoNhanThietBi_Model data = _manager.GET_BBGIAONHAN_TB_CNTT_BY_ID(id);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("giaonhanthietbi/getthietbi")]
        public ActionResult GET_TBI_BY_BBAN_ID([FromQuery] string bban_id)
        {
            try
            {
                List<QLTB_DM_THIETBI_Model> data = _manager.GET_TBI_BY_BBAN_ID(bban_id);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("giaonhanthietbi/insert")]
        public IActionResult INSERT_BBAN_GIAONHAN_CNTT([FromBody] GiaoNhanThietBiRequest model)
        {
            try
            {
                string result = _manager.INSERT_BBAN_GIAONHAN_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("giaonhanthietbi/update")]
        public IActionResult UPDATE_BBAN_GIAONHAN_CNTT([FromBody] GiaoNhanThietBiRequest model)
        {
            try
            {
                string result = _manager.UPDATE_BBAN_GIAONHAN_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
        [HttpDelete]
        [Route("giaonhanthietbi/delete/{id}")]
        public IActionResult DELETE_BBAN_GIAONHAN_CNTT(string id)
        {
            try
            {
                string result = _manager.DELETE_BBAN_GIAONHAN_CNTT(id);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("giaonhanthietbi/cancel")]
        public IActionResult HUY_BBAN_GIAONHAN_CNTT([FromBody] CancelGiaoNhanRequest req)
        {
            try
            {
                string result = _manager.HUY_BBAN_GIAONHAN_CNTT(req);
                return string.IsNullOrEmpty(result) ? Ok("Xóa thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
        #endregion

        #region Biên bản kiểm tra thanh lý TB CNTT
        [HttpGet]
        [Route("giaonhanthietbi/get_bbkiemtrathanhly")]
        public ActionResult GET_BBAN_KIEMTRA_TBI_CNTT([FromQuery] string id, string loai_bban, string loai_nghiepvu, string ma_dvi_giao, string ma_dvi_nhan, string phongban_giao_id, string phongban_nhan_id,
            string nguoi_tao, string nguoi_nhan, int? trang_thai, int? trang_thai_thanh_ly, string tu_ngay, string den_ngay, string user, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_GiaoNhanThietBi_Model> data = _manager.GET_BBAN_KIEMTRA_TBI_CNTT(pageIndex, pageSize, id, loai_bban, loai_nghiepvu, ma_dvi_giao, ma_dvi_nhan, phongban_giao_id, phongban_nhan_id,
                    nguoi_tao, nguoi_nhan, trang_thai, trang_thai_thanh_ly, tu_ngay, den_ngay, user, out totalItems);
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
        [Route("giaonhanthietbi/insert_bbkiemtrathanhly")]
        public IActionResult INSERT_BBAN_KIEMTRA_TBI_CNTT([FromBody] GiaoNhanThietBiRequest model)
        {
            try
            {
                string result = _manager.INSERT_BBAN_KIEMTRA_TBI_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("giaonhanthietbi/update_bbkiemtrathanhly")]
        public IActionResult UPDATE_BBAN_KIEMTRA_TBI_CNTT([FromBody] GiaoNhanThietBiRequest model)
        {
            try
            {
                string result = _manager.UPDATE_BBAN_KIEMTRA_TBI_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("giaonhanthietbi/get_thongtin_duyetthanhly")]
        public ActionResult GET_THONGTIN_DUYETTHANHLY([FromQuery] string id)
        {
            try
            {
                QLTB_ThongTinDuyetThanhLy_Model data = _manager.GET_THONGTIN_DUYETTHANHLY(id);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("giaonhanthietbi/insert_thongtin_duyetthanhly")]
        public IActionResult INSERT_THONGTIN_DUYETTHANHLY([FromBody] QLTB_ThongTinDuyetThanhLy_Model model)
        {
            try
            {
                string result = _manager.INSERT_THONGTIN_DUYETTHANHLY(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("giaonhanthietbi/update_thongtin_duyetthanhly")]
        public IActionResult UPDATE_THONGTIN_DUYETTHANHLY([FromBody] QLTB_ThongTinDuyetThanhLy_Model model)
        {
            try
            {
                string result = _manager.UPDATE_THONGTIN_DUYETTHANHLY(model);
                return string.IsNullOrEmpty(result) ? Ok("Cập nhật thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("giaonhanthietbi/duyet_thanhly")]
        public IActionResult DUYET_THANH_LY_CNTT([FromBody] QLTB_DuyetThanhLy_Model model)
        {
            try
            {
                Console.WriteLine(model);
                string result = _manager.DUYET_THANH_LY_CNTT(model);
                return string.IsNullOrEmpty(result) ? Ok("Thêm mới thành công") : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        #endregion
    }
}
