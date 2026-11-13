using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.QLTB_BAOCAO;
using System;
using System.Collections.Generic;

namespace QLTB_API.Controllers.QLTB.QLTB_BAOCAO
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    public class QLTB_BAOCAOController : ControllerBase
    {
        private readonly QLTB_BAOCAO_Manager _manager;

        public QLTB_BAOCAOController()
        {
            _manager = new QLTB_BAOCAO_Manager();
        }

        #region Báo cáo chi tiết thiết bị
        [HttpGet]
        [Route("get_chitietthietbi")]
        public ActionResult GET_BC_CHITIET_TBI_CNTT([FromQuery] string ma_dviqly, string ma_nhom, string dm_chungloai_id, string trang_thai_tbi, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_BaoCaoChiTiet_Model> data = _manager.GET_BC_CHITIET_TBI_CNTT(pageIndex, pageSize, ma_dviqly, ma_nhom, dm_chungloai_id, trang_thai_tbi, out totalItems);
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

        [HttpGet]
        [Route("get_lichsugiaonhanthietbi")]
        public ActionResult GET_LICHSU_GIAONHAN_TBI([FromQuery] string thietbi_id, string tu_ngay, string den_ngay, string loai_nghiepvu, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_BaoCaoLichSuGiaoNhan_Model> data = _manager.GET_LICHSU_GIAONHAN_TBI(pageIndex, pageSize, thietbi_id, tu_ngay, den_ngay, loai_nghiepvu, out totalItems);
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

        [Route("get_slthietbi_dashboard")]
        [HttpGet]
        public IActionResult GET_DASHBOARD_THIETBI_CNTT(string ma_dviqly)
        {
            try
            {
                var results = _manager.GET_DASHBOARD_THIETBI_CNTT(ma_dviqly);
                return results != null ? Ok(results) : NotFound("No data found!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("get_baocao_dongbo_thietbicu")]
        public ActionResult GET_BC_DONGBO_THIETBICU([FromQuery] string ma_dviqly, string? ma_nhom, int? trang_thai_tbi, int? chungloai_id)
        {
            try
            {
                List<QLTB_BaoCaoDongBoDuLieuCu_Model> data = _manager.GET_BC_DONGBO_THIETBICU(ma_dviqly, ma_nhom, trang_thai_tbi, chungloai_id);
                var result = new
                {
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
        [Route("get_baocao_tonghop_thietbi")]
        public ActionResult GET_BC_TONGHOP_THIETBI([FromQuery] string ma_dviqly, string? ma_nhom, int? trang_thai_tbi, int? chungloai_id)
        {
            try
            {
                List<QLTB_BaoCaoTongHopThietBi_Model> data = _manager.GET_BC_TONGHOP_THIETBI(ma_dviqly, ma_nhom, trang_thai_tbi, chungloai_id);
                var result = new
                {
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
        [Route("get_baocao_tonghop_tinhtrang_giaonhan")]
        public ActionResult GET_BC_TONGHOP_TINHTRANG_GIAONHAN([FromQuery] string ma_donvi_nhan, string? ma_nhom, string tu_ngay, string den_ngay)
        {
            try
            {
                List<QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model> data = _manager.GET_BC_TONGHOP_TINHTRANG_GIAONHAN(ma_donvi_nhan, ma_nhom, tu_ngay, den_ngay);
                var result = new
                {
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
        [Route("get_baocao_chitiet_tinhtrang_giaonhan")]
        public ActionResult GET_BC_TINHTRANG_GIAONHAN_THIETBI([FromQuery] string ma_donvi_nhan, string? ma_nhom, string tu_ngay, string den_ngay, int? tinhtrang_capphat, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                int totalItems = 0;
                List<QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model> data = _manager.GET_BC_TINHTRANG_GIAONHAN_THIETBI(pageIndex, pageSize, ma_donvi_nhan, ma_nhom, tu_ngay, den_ngay, tinhtrang_capphat, out totalItems);
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
        [Route("get_baocao_tonghop_bienban_c4")]
        public ActionResult GET_BC_TONGHOP_BIENBAN_C4([FromQuery] string ma_donvi_kt, string? loai_nghiepvu, string tu_ngay, string den_ngay)
        {
            try
            {
                List<QLTB_BaoCaoTongHopBienBan_Model> data = _manager.GET_BC_TONGHOP_BIENBAN_C4(ma_donvi_kt, loai_nghiepvu, tu_ngay, den_ngay);
                var result = new
                {
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
        [Route("get_baocao_tonghop_bienban_c3")]
        public ActionResult GET_BC_TONGHOP_BIENBAN_C3([FromQuery] string ma_phong_kt, string? loai_nghiepvu, string tu_ngay, string den_ngay)
        {
            try
            {
                List<QLTB_BaoCaoTongHopBienBan_Model> data = _manager.GET_BC_TONGHOP_BIENBAN_C3(ma_phong_kt, loai_nghiepvu, tu_ngay, den_ngay);
                var result = new
                {
                    data
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
    }
}
