using APIPCHY.Helpers;
using System.Collections.Generic;
using System;
using System.Data;

namespace QLTB_API.Models.QLTB.QUANLYCAP3
{
    public class QLTB_KiemTraTB_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        #region Kiểm tra thiết bị
        public List<QLTB_KiemTraTB_Model> GET_KIEMTRA_TB_CNTT(
            int pageIndex, int pageSize, string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
            string donvi_kiemtra, string nguoi_kiemtra, string ket_qua, string tbi_trangthai_id, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_KIEMTRA_TB_CNTT",
                    "p_page_index", "p_page_size", "p_ID", "p_TEN_THIETBI", "p_MA_THIETBI", "p_NO_THIETBI", "p_MA_DVIQLY",
                    "p_DONVI_KIEMTRA", "p_NGUOI_KIEMTRA", "p_KET_QUA", "p_TRANG_THAI",
                     pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
                     donvi_kiemtra, nguoi_kiemtra, ket_qua, tbi_trangthai_id
                );

                List<QLTB_KiemTraTB_Model> list = new List<QLTB_KiemTraTB_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_KiemTraTB_Model model = new QLTB_KiemTraTB_Model();
                        model.id_kiemtra = ds.Rows[i]["id_kiemtra"] != DBNull.Value ? ds.Rows[i]["id_kiemtra"].ToString() : null;
                        model.tbi_id = ds.Rows[i]["tbi_id"] != DBNull.Value ? ds.Rows[i]["tbi_id"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["ten_thietbi"] != DBNull.Value ? ds.Rows[i]["ten_thietbi"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["ma_thietbi"] != DBNull.Value ? ds.Rows[i]["ma_thietbi"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["no_thietbi"] != DBNull.Value ? ds.Rows[i]["no_thietbi"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.ten_kho = ds.Rows[i]["ten_kho"] != DBNull.Value ? ds.Rows[i]["ten_kho"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["tbi_dm_chungloai_ten"] != DBNull.Value ? ds.Rows[i]["tbi_dm_chungloai_ten"].ToString() : null;
                        model.ten_hang_sx = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.donvi_kiemtra = ds.Rows[i]["donvi_kiemtra"] != DBNull.Value ? ds.Rows[i]["donvi_kiemtra"].ToString() : null;
                        model.nguoi_kiemtra = ds.Rows[i]["nguoi_kiemtra"] != DBNull.Value ? ds.Rows[i]["nguoi_kiemtra"].ToString() : null;
                        model.ngay_kiemtra = ds.Rows[i]["ngay_kiemtra"] != DBNull.Value ? ds.Rows[i]["ngay_kiemtra"].ToString() : null;
                        model.ghi_chu = ds.Rows[i]["ghi_chu"] != DBNull.Value ? ds.Rows[i]["ghi_chu"].ToString() : null;
                        model.ket_qua = ds.Rows[i]["ket_qua"] != DBNull.Value ? ds.Rows[i]["ket_qua"].ToString() : null;
                        model.tbi_trangthai_id = ds.Rows[i]["tbi_trangthai_id"] != DBNull.Value ? ds.Rows[i]["tbi_trangthai_id"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["tbi_trangthai_ten"] != DBNull.Value ? ds.Rows[i]["tbi_trangthai_ten"].ToString() : null;
                        model.can_xu_ly = ds.Rows[i]["can_xu_ly"] != DBNull.Value ? ds.Rows[i]["can_xu_ly"].ToString() : null;
                        model.co_the_kiemtra = ds.Rows[i]["co_the_kiemtra"] != DBNull.Value ? ds.Rows[i]["co_the_kiemtra"].ToString() : null;


                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<QLTB_KiemTraTB_Model> GET_KIEMTRA_TB_CNTT_V2(
            int pageIndex, int pageSize, string id, string search_thietbi, string ma_nhom_tbi, string tbi_dm_chungloai_id, string check, string ma_dviqly,
            string donvi_kiemtra, string nguoi_kiemtra, string ket_qua, string tbi_trangthai_id, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_KIEMTRA_TB_CNTT_V2",
                    "p_page_index", "p_page_size", "p_ID", "p_SEARCH_THIETBI", "p_MA_NHOM", "p_TBI_DM_CHUNGLOAI_ID", "p_CHECK", "p_MA_DVIQLY",
                    "p_DONVI_KIEMTRA", "p_NGUOI_KIEMTRA", "p_KET_QUA", "p_TRANG_THAI",
                     pageIndex, pageSize, id, search_thietbi, ma_nhom_tbi, tbi_dm_chungloai_id, check, ma_dviqly,
                     donvi_kiemtra, nguoi_kiemtra, ket_qua, tbi_trangthai_id
                );

                List<QLTB_KiemTraTB_Model> list = new List<QLTB_KiemTraTB_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_KiemTraTB_Model model = new QLTB_KiemTraTB_Model();
                        model.id_kiemtra = ds.Rows[i]["id_kiemtra"] != DBNull.Value ? ds.Rows[i]["id_kiemtra"].ToString() : null;
                        model.tbi_id = ds.Rows[i]["tbi_id"] != DBNull.Value ? ds.Rows[i]["tbi_id"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["ten_thietbi"] != DBNull.Value ? ds.Rows[i]["ten_thietbi"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["ma_thietbi"] != DBNull.Value ? ds.Rows[i]["ma_thietbi"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["no_thietbi"] != DBNull.Value ? ds.Rows[i]["no_thietbi"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.ten_kho = ds.Rows[i]["ten_kho"] != DBNull.Value ? ds.Rows[i]["ten_kho"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["tbi_dm_chungloai_ten"] != DBNull.Value ? ds.Rows[i]["tbi_dm_chungloai_ten"].ToString() : null;
                        model.ten_hang_sx = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.donvi_kiemtra = ds.Rows[i]["donvi_kiemtra"] != DBNull.Value ? ds.Rows[i]["donvi_kiemtra"].ToString() : null;
                        model.nguoi_kiemtra = ds.Rows[i]["nguoi_kiemtra"] != DBNull.Value ? ds.Rows[i]["nguoi_kiemtra"].ToString() : null;
                        model.ngay_kiemtra = ds.Rows[i]["ngay_kiemtra"] != DBNull.Value ? ds.Rows[i]["ngay_kiemtra"].ToString() : null;
                        model.ghi_chu = ds.Rows[i]["ghi_chu"] != DBNull.Value ? ds.Rows[i]["ghi_chu"].ToString() : null;
                        model.ket_qua = ds.Rows[i]["ket_qua"] != DBNull.Value ? ds.Rows[i]["ket_qua"].ToString() : null;
                        model.tbi_trangthai_id = ds.Rows[i]["tbi_trangthai_id"] != DBNull.Value ? ds.Rows[i]["tbi_trangthai_id"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["tbi_trangthai_ten"] != DBNull.Value ? ds.Rows[i]["tbi_trangthai_ten"].ToString() : null;
                        model.can_xu_ly = ds.Rows[i]["can_xu_ly"] != DBNull.Value ? ds.Rows[i]["can_xu_ly"].ToString() : null;
                        model.co_the_kiemtra = ds.Rows[i]["co_the_kiemtra"] != DBNull.Value ? ds.Rows[i]["co_the_kiemtra"].ToString() : null;


                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<QLTB_KiemTraTB_Model> GET_LS_KIEMTRA_CNTT(
           int pageIndex, int pageSize, string tbi_id, string donvi_kiemtra, string nguoi_kiemtra, string ket_qua, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_LS_KIEMTRA_CNTT",
                    "p_page_index", "p_page_size", "p_TBI_ID", "p_DONVI_KIEMTRA", "p_NGUOI_KIEMTRA", "p_KET_QUA",
                     pageIndex, pageSize, tbi_id, donvi_kiemtra, nguoi_kiemtra, ket_qua
                );

                List<QLTB_KiemTraTB_Model> list = new List<QLTB_KiemTraTB_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_KiemTraTB_Model model = new QLTB_KiemTraTB_Model();
                        model.id_kiemtra = ds.Rows[i]["id_kiemtra"] != DBNull.Value ? ds.Rows[i]["id_kiemtra"].ToString() : null;
                        model.tbi_id = ds.Rows[i]["tbi_id"] != DBNull.Value ? ds.Rows[i]["tbi_id"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["ten_thietbi"] != DBNull.Value ? ds.Rows[i]["ten_thietbi"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["ma_thietbi"] != DBNull.Value ? ds.Rows[i]["ma_thietbi"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["no_thietbi"] != DBNull.Value ? ds.Rows[i]["no_thietbi"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["ma_dviqly"] != DBNull.Value ? ds.Rows[i]["ma_dviqly"].ToString() : null;
                        model.donvi_kiemtra = ds.Rows[i]["donvi_kiemtra"] != DBNull.Value ? ds.Rows[i]["donvi_kiemtra"].ToString() : null;
                        model.nguoi_kiemtra = ds.Rows[i]["nguoi_kiemtra"] != DBNull.Value ? ds.Rows[i]["nguoi_kiemtra"].ToString() : null;
                        model.ngay_kiemtra = ds.Rows[i]["ngay_kiemtra"] != DBNull.Value ? ds.Rows[i]["ngay_kiemtra"].ToString() : null;
                        model.ghi_chu = ds.Rows[i]["ghi_chu"] != DBNull.Value ? ds.Rows[i]["ghi_chu"].ToString() : null;
                        model.ket_qua = ds.Rows[i]["ket_qua"] != DBNull.Value ? ds.Rows[i]["ket_qua"].ToString() : null;


                        list.Add(model);
                    }
                }

                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string INSERT_KIEMTRATB_CNTT(KiemTraThietBiRequest request)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.INSERT_KIEMTRATB_CNTT", "p_Error",
                                                   "p_TBI_ID", "p_DONVI_KIEMTRA", "p_NGUOI_KIEMTRA", "p_KET_QUA", "p_NGAY_KIEMTRA", "p_GHI_CHU",
                                                   request.tbi_id, request.donvi_kiemtra, request.nguoi_kiemtra, request.ket_qua, request.ngay_kiemtra, request.ghi_chu);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string INSERT_KIEMTRATB_CNTT_MULTI(KiemTraThietBiMultiRequest request)
        {
            try
            {
                if (request.tbi_ids == null || request.tbi_ids.Count == 0)
                    return "Danh sách TBI_ID rỗng.";

                string idList = string.Join(",", request.tbi_ids); //chuyển sang chuỗi

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.INSERT_KIEMTRATB_CNTT_MULTI", "p_Error",
                                                   "p_TBI_IDS", "p_DONVI_KIEMTRA", "p_NGUOI_KIEMTRA", "p_KET_QUA", "p_NGAY_KIEMTRA", "p_GHI_CHU",
                                                   idList, request.donvi_kiemtra, request.nguoi_kiemtra, request.ket_qua, request.ngay_kiemtra, request.ghi_chu);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }
        #endregion
    }
}
