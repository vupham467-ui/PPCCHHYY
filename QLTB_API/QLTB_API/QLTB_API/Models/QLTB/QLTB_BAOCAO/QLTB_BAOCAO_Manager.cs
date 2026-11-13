using System.Collections.Generic;
using System;
using System.Data;
using APIPCHY.Helpers;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;

namespace QLTB_API.Models.QLTB.QLTB_BAOCAO
{
    public class QLTB_BAOCAO_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        #region Báo cáo chi tiết thiết bị
        public List<QLTB_BaoCaoChiTiet_Model> GET_BC_CHITIET_TBI_CNTT(int pageIndex, int pageSize, string ma_dviqly, string ma_nhom, string dm_chungloai_id, string trang_thai_tbi, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_CHITIET_TBI_CNTT", "p_page_index", "p_page_size", "p_MA_DVIQLY", "p_MA_NHOM", "p_DM_CHUNGLOAI_ID", "p_TRANG_THAI_TBI", pageIndex, pageSize, ma_dviqly, ma_nhom, dm_chungloai_id, trang_thai_tbi);
                List<QLTB_BaoCaoChiTiet_Model> list = new List<QLTB_BaoCaoChiTiet_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoChiTiet_Model model = new QLTB_BaoCaoChiTiet_Model();
                        model.id = ds.Rows[i]["id"] != DBNull.Value ? ds.Rows[i]["id"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.don_vi = ds.Rows[i]["don_vi"] != DBNull.Value ? ds.Rows[i]["don_vi"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["ten_nhom"] != DBNull.Value ? ds.Rows[i]["ten_nhom"].ToString() : null;
                        model.ten_chungloai = ds.Rows[i]["ten_chungloai"] != DBNull.Value ? ds.Rows[i]["ten_chungloai"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["no_thietbi"] != DBNull.Value ? ds.Rows[i]["no_thietbi"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["ma_thietbi"] != DBNull.Value ? ds.Rows[i]["ma_thietbi"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["ten_thietbi"] != DBNull.Value ? ds.Rows[i]["ten_thietbi"].ToString() : null;
                        model.trang_thai = ds.Rows[i]["trang_thai"] != DBNull.Value ? ds.Rows[i]["trang_thai"].ToString() : null;
                        model.nam_sx = ds.Rows[i]["nam_sx"] != DBNull.Value ? ds.Rows[i]["nam_sx"].ToString() : null;
                        model.trangthai_duyet = ds.Rows[i]["trangthai_duyet"] != DBNull.Value ? ds.Rows[i]["trangthai_duyet"].ToString() : null;
                        model.phongban_sd = ds.Rows[i]["phongban_sd"] != DBNull.Value ? ds.Rows[i]["phongban_sd"].ToString() : null;
                        model.ten_kho = ds.Rows[i]["ten_kho"] != DBNull.Value ? ds.Rows[i]["ten_kho"].ToString() : null;
                        model.ten_nuoc_sx = ds.Rows[i]["ten_nuoc_sx"] != DBNull.Value ? ds.Rows[i]["ten_nuoc_sx"].ToString() : null;
                        model.ten_hang_sx = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.nguoi_sd = ds.Rows[i]["nguoi_sd"] != DBNull.Value ? ds.Rows[i]["nguoi_sd"].ToString() : null;
                        model.thong_tin_khac = ds.Rows[i]["thong_tin_khac"] != DBNull.Value ? ds.Rows[i]["thong_tin_khac"].ToString() : null;

                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }

        #endregion

        #region Lịch sử giao nhận thiết bị
        public List<QLTB_BaoCaoLichSuGiaoNhan_Model> GET_LICHSU_GIAONHAN_TBI(int pageIndex, int pageSize, string thietbi_id, string tu_ngay, string den_ngay, string loai_nghiepvu, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_LICHSU_GIAONHAN_TBI", 
                    "p_page_index", "p_page_size", "p_THIETBI_ID", "p_TU_NGAY", "p_DEN_NGAY", "P_LOAI_NGHIEPVU",
                    pageIndex, pageSize, thietbi_id, tu_ngay, den_ngay, loai_nghiepvu);
                List<QLTB_BaoCaoLichSuGiaoNhan_Model> list = new List<QLTB_BaoCaoLichSuGiaoNhan_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoLichSuGiaoNhan_Model model = new QLTB_BaoCaoLichSuGiaoNhan_Model();
                        model.thietbi_id = ds.Rows[i]["thietbi_id"] != DBNull.Value ? ds.Rows[i]["thietbi_id"].ToString() : null;
                        model.bban_id = ds.Rows[i]["bban_id"] != DBNull.Value ? int.Parse(ds.Rows[i]["bban_id"].ToString()) : null;
                        model.loai_bban = ds.Rows[i]["loai_bban"] != DBNull.Value ? int.Parse(ds.Rows[i]["loai_bban"].ToString()) : null;
                        model.ten_loai_bban = ds.Rows[i]["ten_loai_bban"] != DBNull.Value ? ds.Rows[i]["ten_loai_bban"].ToString() : null;
                        model.loai_nghiepvu = ds.Rows[i]["loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["loai_nghiepvu"].ToString() : null;
                        model.ten_loai_nghiepvu = ds.Rows[i]["ten_loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["ten_loai_nghiepvu"].ToString() : null;
                        model.donvi_cu = ds.Rows[i]["donvi_cu"] != DBNull.Value ? ds.Rows[i]["donvi_cu"].ToString() : null;
                        model.donvi_moi = ds.Rows[i]["donvi_moi"] != DBNull.Value ? ds.Rows[i]["donvi_moi"].ToString() : null;
                        model.ten_donvi_cu = ds.Rows[i]["ten_donvi_cu"] != DBNull.Value ? ds.Rows[i]["ten_donvi_cu"].ToString() : null;
                        model.ten_donvi_moi = ds.Rows[i]["ten_donvi_moi"] != DBNull.Value ? ds.Rows[i]["ten_donvi_moi"].ToString() : null;
                        model.ten_phongban_cu = ds.Rows[i]["ten_phongban_cu"] != DBNull.Value ? ds.Rows[i]["ten_phongban_cu"].ToString() : null;
                        model.ten_phongban_moi = ds.Rows[i]["ten_phongban_moi"] != DBNull.Value ? ds.Rows[i]["ten_phongban_moi"].ToString() : null;
                        model.nguoi_giao = ds.Rows[i]["nguoi_giao"] != DBNull.Value ? ds.Rows[i]["nguoi_giao"].ToString() : null;
                        model.nguoi_nhan = ds.Rows[i]["nguoi_nhan"] != DBNull.Value ? ds.Rows[i]["nguoi_nhan"].ToString() : null;
                        model.ten_nguoi_giao = ds.Rows[i]["ten_nguoi_giao"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_giao"].ToString() : null;
                        model.ten_nguoi_nhan = ds.Rows[i]["ten_nguoi_nhan"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_nhan"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["ngay_tao"] != DBNull.Value ? ds.Rows[i]["ngay_tao"].ToString() : null;
                        model.ngay_nhan = ds.Rows[i]["ngay_nhan"] != DBNull.Value ? ds.Rows[i]["ngay_nhan"].ToString() : null;
                        model.nguoi_sd_cu = ds.Rows[i]["nguoi_sd_cu"] != DBNull.Value ? ds.Rows[i]["nguoi_sd_cu"].ToString() : null;
                        model.nguoi_sd_moi = ds.Rows[i]["nguoi_sd_moi"] != DBNull.Value ? ds.Rows[i]["nguoi_sd_moi"].ToString() : null;
                        model.ten_nguoi_sd_cu = ds.Rows[i]["ten_nguoi_sd_cu"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_sd_cu"].ToString() : null;
                        model.ten_nguoi_sd_moi = ds.Rows[i]["ten_nguoi_sd_moi"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_sd_moi"].ToString() : null;
                        model.ten_kho_cu = ds.Rows[i]["ten_kho_cu"] != DBNull.Value ? ds.Rows[i]["ten_kho_cu"].ToString() : null;
                        model.ten_kho_moi = ds.Rows[i]["ten_kho_moi"] != DBNull.Value ? ds.Rows[i]["ten_kho_moi"].ToString() : null;
                        model.trangthai_cu = ds.Rows[i]["trangthai_cu"] != DBNull.Value ? ds.Rows[i]["trangthai_cu"].ToString() : null;
                        model.trangthai_moi = ds.Rows[i]["trangthai_moi"] != DBNull.Value ? ds.Rows[i]["trangthai_moi"].ToString() : null;
                        model.trangthai_bb = ds.Rows[i]["trangthai_bb"] != DBNull.Value ? ds.Rows[i]["trangthai_bb"].ToString() : null;
                        model.trangthai_thanhly = ds.Rows[i]["trangthai_thanhly"] != DBNull.Value ? int.Parse(ds.Rows[i]["trangthai_thanhly"].ToString()) : null;
                        model.thoigian_xacnhan = ds.Rows[i]["thoigian_xacnhan"] != DBNull.Value ? ds.Rows[i]["thoigian_xacnhan"].ToString() : null;

                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion

        #region Thiết bị dashboard
        public object GET_DASHBOARD_THIETBI_CNTT(string ma_dviqly)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            try
            {
                OracleCommand cmd = new OracleCommand
                {
                    Connection = cn,
                    CommandType = CommandType.StoredProcedure,
                    CommandText = "PKG_QLTB_THIETBI.GET_DASHBOARD_THIETBI_CNTT"
                };

                // Thêm tham số đầu vào
                cmd.Parameters.Add("p_MADVIQLY", OracleDbType.Varchar2).Value = ma_dviqly;
                // Thêm tham số OUT
                cmd.Parameters.Add("p_TONG_SO", OracleDbType.Decimal).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("p_DANG_SU_DUNG", OracleDbType.Decimal).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("p_TRONG_KHO", OracleDbType.Decimal).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("p_CHO_DUYET", OracleDbType.Decimal).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("p_THANH_LY", OracleDbType.Decimal).Direction = ParameterDirection.Output;

                cmd.ExecuteNonQuery();

                // Chuyển đổi giá trị:
                var result = new
                {
                    tong_so = cmd.Parameters["p_TONG_SO"].Value is OracleDecimal val1 ? val1.ToInt32() : 0,
                    sl_dang_dung = cmd.Parameters["p_DANG_SU_DUNG"].Value is OracleDecimal val2 ? val2.ToInt32() : 0,
                    sl_trong_kho = cmd.Parameters["p_TRONG_KHO"].Value is OracleDecimal val3 ? val3.ToInt32() : 0,
                    sl_cho_duyet = cmd.Parameters["p_CHO_DUYET"].Value is OracleDecimal val4 ? val4.ToInt32() : 0,
                    sl_thanh_ly= cmd.Parameters["p_THANH_LY"].Value is OracleDecimal val5 ? val5.ToInt32() : 0,
                };

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi: " + ex.Message);
                throw;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }
        #endregion

        #region Báo cáo đồng bộ thiết bị cũ
        public List<QLTB_BaoCaoDongBoDuLieuCu_Model> GET_BC_DONGBO_THIETBICU(string ma_dviqly, string? ma_nhom, int? trang_thai_tbi, int? chungloai_id)
        {
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_DONGBO_THIETBICU_V2",
                    "p_ma_dviqly", "p_ma_nhom", "p_trang_thai", "p_chungloai_id",
                    ma_dviqly, ma_nhom, trang_thai_tbi, chungloai_id);
                List<QLTB_BaoCaoDongBoDuLieuCu_Model> list = new List<QLTB_BaoCaoDongBoDuLieuCu_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoDongBoDuLieuCu_Model model = new QLTB_BaoCaoDongBoDuLieuCu_Model();
                        model.stt = i + 1;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.don_vi = ds.Rows[i]["don_vi"] != DBNull.Value ? ds.Rows[i]["don_vi"].ToString() : null;
                        model.ma_nhom = ds.Rows[i]["ma_nhom"] != DBNull.Value ? ds.Rows[i]["ma_nhom"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["ten_nhom"] != DBNull.Value ? ds.Rows[i]["ten_nhom"].ToString() : null;
                        model.ma_chungloai = ds.Rows[i]["ma_chungloai"] != DBNull.Value ? ds.Rows[i]["ma_chungloai"].ToString() : null;
                        model.ten_chungloai = ds.Rows[i]["ten_chungloai"] != DBNull.Value ? ds.Rows[i]["ten_chungloai"].ToString() : null;
                        model.tong_so_thiet_bi = ds.Rows[i]["tong_so_thiet_bi"] != DBNull.Value ? int.Parse(ds.Rows[i]["tong_so_thiet_bi"].ToString()) : 0;
                        model.da_dong_bo = ds.Rows[i]["da_dong_bo"] != DBNull.Value ? int.Parse(ds.Rows[i]["da_dong_bo"].ToString()) : 0;
                        model.chua_dong_bo = ds.Rows[i]["chua_dong_bo"] != DBNull.Value ? int.Parse(ds.Rows[i]["chua_dong_bo"].ToString()) : 0;
                        model.dong_bo_loi = ds.Rows[i]["dong_bo_loi"] != DBNull.Value ? int.Parse(ds.Rows[i]["dong_bo_loi"].ToString()) : 0;
      
                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion

        #region Báo cáo tổng hợp thiết bị
        public List<QLTB_BaoCaoTongHopThietBi_Model> GET_BC_TONGHOP_THIETBI(string ma_dviqly, string? ma_nhom, int? trang_thai_tbi, int? chungloai_id)
        {
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_TONGHOP_THIETBI",
                    "p_ma_dviqly", "p_ma_nhom", "p_trang_thai", "p_chungloai_id",
                    ma_dviqly, ma_nhom, trang_thai_tbi, chungloai_id);
                List<QLTB_BaoCaoTongHopThietBi_Model> list = new List<QLTB_BaoCaoTongHopThietBi_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoTongHopThietBi_Model model = new QLTB_BaoCaoTongHopThietBi_Model();
                        model.stt = i + 1;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.don_vi = ds.Rows[i]["don_vi"] != DBNull.Value ? ds.Rows[i]["don_vi"].ToString() : null;
                        model.ma_nhom = ds.Rows[i]["ma_nhom"] != DBNull.Value ? ds.Rows[i]["ma_nhom"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["ten_nhom"] != DBNull.Value ? ds.Rows[i]["ten_nhom"].ToString() : null;
                        model.ma_chungloai = ds.Rows[i]["ma_chungloai"] != DBNull.Value ? ds.Rows[i]["ma_chungloai"].ToString() : null;
                        model.ten_chungloai = ds.Rows[i]["ten_chungloai"] != DBNull.Value ? ds.Rows[i]["ten_chungloai"].ToString() : null;
                        model.trang_thai = ds.Rows[i]["trang_thai"] != DBNull.Value ? ds.Rows[i]["trang_thai"].ToString() : null;
                        model.tong_so_thiet_bi = ds.Rows[i]["tong_so_thiet_bi"] != DBNull.Value ? int.Parse(ds.Rows[i]["tong_so_thiet_bi"].ToString()) : 0;

                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion

        #region Báo cáo tổng hợp tình trạng giao nhận thiết bị trong tháng
        public List<QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model> GET_BC_TONGHOP_TINHTRANG_GIAONHAN(string ma_donvi_nhan, string? ma_nhom, string tu_ngay, string den_ngay)
        {
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_TONGHOP_TINHTRANG_GIAONHAN",
                    "p_MA_DONVI_NHAN", "p_MA_NHOM", "P_TU_NGAY", "P_DEN_NGAY",
                    ma_donvi_nhan, ma_nhom, tu_ngay, den_ngay);
                List<QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model> list = new List<QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model model = new QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model();
                        model.stt = i + 1;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.don_vi = ds.Rows[i]["don_vi"] != DBNull.Value ? ds.Rows[i]["don_vi"].ToString() : null;
                        model.ma_nhom = ds.Rows[i]["ma_nhom"] != DBNull.Value ? ds.Rows[i]["ma_nhom"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["ten_nhom"] != DBNull.Value ? ds.Rows[i]["ten_nhom"].ToString() : null;
                        model.tong_thietbi = ds.Rows[i]["tong_thietbi"] != DBNull.Value ? int.Parse(ds.Rows[i]["tong_thietbi"].ToString()) : 0;
                        model.da_cap_trong_ky = ds.Rows[i]["da_cap_trong_ky"] != DBNull.Value ? int.Parse(ds.Rows[i]["da_cap_trong_ky"].ToString()) : 0;
                        model.cap_sau = ds.Rows[i]["cap_sau"] != DBNull.Value ? int.Parse(ds.Rows[i]["cap_sau"].ToString()) : 0;
                        model.chua_cap = ds.Rows[i]["chua_cap"] != DBNull.Value ? int.Parse(ds.Rows[i]["chua_cap"].ToString()) : 0;

                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion

        #region Báo cáo chi tiết tình trạng giao nhận thiêt bị trong tháng
        public List<QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model> GET_BC_TINHTRANG_GIAONHAN_THIETBI(int pageIndex, int pageSize, string ma_donvi_nhan, string? ma_nhom, string tu_ngay, string den_ngay, int? tinhtrang_capphat, out int totalItems)
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_TINHTRANG_GIAONHAN_THIETBI", "p_page_index", "p_page_size", "p_MA_DONVI_NHAN", "p_MA_NHOM", "p_TU_NGAY", "p_DEN_NGAY", "p_TINHTRANG_CAPPHAT", 
                    pageIndex, pageSize, ma_donvi_nhan, ma_nhom, tu_ngay, den_ngay, tinhtrang_capphat);
                List<QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model> list = new List<QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model model = new QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model();

                        model.id = ds.Rows[i]["id"] != DBNull.Value ? ds.Rows[i]["id"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.don_vi = ds.Rows[i]["don_vi"] != DBNull.Value ? ds.Rows[i]["don_vi"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["ten_nhom"] != DBNull.Value ? ds.Rows[i]["ten_nhom"].ToString() : null;
                        model.ten_chungloai = ds.Rows[i]["ten_chungloai"] != DBNull.Value ? ds.Rows[i]["ten_chungloai"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["no_thietbi"] != DBNull.Value ? ds.Rows[i]["no_thietbi"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["ma_thietbi"] != DBNull.Value ? ds.Rows[i]["ma_thietbi"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["ten_thietbi"] != DBNull.Value ? ds.Rows[i]["ten_thietbi"].ToString() : null;
                        model.ngay_ban_giao_dvi = ds.Rows[i]["ngay_ban_giao_dvi"] != DBNull.Value ? ds.Rows[i]["ngay_ban_giao_dvi"].ToString() : null;
                        model.ngay_cap_phat = ds.Rows[i]["ngay_cap_phat"] != DBNull.Value ? ds.Rows[i]["ngay_cap_phat"].ToString() : null;
                        model.tinh_trang_cap_phat = ds.Rows[i]["tinh_trang_cap_phat"] != DBNull.Value ? ds.Rows[i]["tinh_trang_cap_phat"].ToString() : null;
                        model.tinhtrang_id = ds.Rows[i]["tinhtrang_id"] != DBNull.Value ? int.Parse(ds.Rows[i]["tinhtrang_id"].ToString()) : 0;
                        model.so_ngay_ton = ds.Rows[i]["so_ngay_ton"] != DBNull.Value ? int.Parse(ds.Rows[i]["so_ngay_ton"].ToString()) : 0;


                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion

        #region Báo cáo tổng hợp biên bản với đơn vị cấp 4
        public List<QLTB_BaoCaoTongHopBienBan_Model> GET_BC_TONGHOP_BIENBAN_C4(string ma_donvi_kt, string? loai_nghiepvu, string tu_ngay, string den_ngay)
        {
            try
            {
        
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_TONGHOP_BIENBAN_C4",
                    "p_MA_DONVI_KT", "p_LOAI_NGHIEPVU", "P_TU_NGAY", "P_DEN_NGAY",
                    ma_donvi_kt, loai_nghiepvu, tu_ngay, den_ngay);
                List<QLTB_BaoCaoTongHopBienBan_Model> list = new List<QLTB_BaoCaoTongHopBienBan_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoTongHopBienBan_Model model = new QLTB_BaoCaoTongHopBienBan_Model();
                        model.stt = i + 1;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.don_vi = ds.Rows[i]["don_vi"] != DBNull.Value ? ds.Rows[i]["don_vi"].ToString() : null;
                        model.loai_nghiepvu = ds.Rows[i]["loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["loai_nghiepvu"].ToString() : null;
                        model.ten_loai_nghiepvu = ds.Rows[i]["ten_loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["ten_loai_nghiepvu"].ToString() : null;
                        model.tong_bienban = ds.Rows[i]["tong_bienban"] != DBNull.Value ? int.Parse(ds.Rows[i]["tong_bienban"].ToString()) : 0;
                        model.da_hoan_thanh = ds.Rows[i]["da_hoan_thanh"] != DBNull.Value ? int.Parse(ds.Rows[i]["da_hoan_thanh"].ToString()) : 0;
                        model.chua_ky_du = ds.Rows[i]["chua_ky_du"] != DBNull.Value ? int.Parse(ds.Rows[i]["chua_ky_du"].ToString()) : 0;
                        model.chua_ky = ds.Rows[i]["chua_ky"] != DBNull.Value ? int.Parse(ds.Rows[i]["chua_ky"].ToString()) : 0;
                        model.ty_le_hoan_thanh = ds.Rows[i]["ty_le_hoan_thanh"] != DBNull.Value
                                ? Convert.ToDecimal(ds.Rows[i]["ty_le_hoan_thanh"])
                                : 0;

                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion
        #region Báo cáo tổng hợp biên bản với đơn vị cấp 3
        public List<QLTB_BaoCaoTongHopBienBan_Model> GET_BC_TONGHOP_BIENBAN_C3(string ma_phong_kt, string? loai_nghiepvu, string tu_ngay, string den_ngay)
        {
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BC_TONGHOP_BIENBAN_C3",
                    "p_MA_PHONG_KT", "p_LOAI_NGHIEPVU", "P_TU_NGAY", "P_DEN_NGAY",
                    ma_phong_kt, loai_nghiepvu, tu_ngay, den_ngay);
                List<QLTB_BaoCaoTongHopBienBan_Model> list = new List<QLTB_BaoCaoTongHopBienBan_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_BaoCaoTongHopBienBan_Model model = new QLTB_BaoCaoTongHopBienBan_Model();
                        model.stt = i + 1;
                        model.id_phong = ds.Rows[i]["id_phong"] != DBNull.Value ? ds.Rows[i]["id_phong"].ToString() : null;
                        model.ten_phong = ds.Rows[i]["ten_phong"] != DBNull.Value ? ds.Rows[i]["ten_phong"].ToString() : null;
                        model.loai_nghiepvu = ds.Rows[i]["loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["loai_nghiepvu"].ToString() : null;
                        model.ten_loai_nghiepvu = ds.Rows[i]["ten_loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["ten_loai_nghiepvu"].ToString() : null;
                        model.tong_bienban = ds.Rows[i]["tong_bienban"] != DBNull.Value ? int.Parse(ds.Rows[i]["tong_bienban"].ToString()) : 0;
                        model.da_hoan_thanh = ds.Rows[i]["da_hoan_thanh"] != DBNull.Value ? int.Parse(ds.Rows[i]["da_hoan_thanh"].ToString()) : 0;
                        model.chua_ky_du = ds.Rows[i]["chua_ky_du"] != DBNull.Value ? int.Parse(ds.Rows[i]["chua_ky_du"].ToString()) : 0;
                        model.chua_ky = ds.Rows[i]["chua_ky"] != DBNull.Value ? int.Parse(ds.Rows[i]["chua_ky"].ToString()) : 0;
                        model.ty_le_hoan_thanh = ds.Rows[i]["ty_le_hoan_thanh"] != DBNull.Value
                                ? Convert.ToDecimal(ds.Rows[i]["ty_le_hoan_thanh"])
                                : 0;

                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }
        #endregion

    }
}
