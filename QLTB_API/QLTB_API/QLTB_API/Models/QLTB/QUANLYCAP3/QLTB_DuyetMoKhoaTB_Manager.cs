using APIPCHY.Helpers;
using System.Collections.Generic;
using System;
using System.Data;
using QLTB_API.Models.QLTB.DANH_MUC;

namespace QLTB_API.Models.QLTB.QUANLYCAP3
{
    public class QLTB_DuyetMoKhoaTB_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        #region Duyệt thiết bị mới
        public List<QLTB_DM_THIETBI_Model> GET_DUYET_TBIMOI_CNTT(
            int pageIndex, int pageSize, string id , string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly, 
            string ma_nhom_tbi, string trang_thai, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_DUYET_TBIMOI_CNTT",
                    "p_page_index", "p_page_size", "p_ID", "p_TEN_THIETBI", "p_MA_THIETBI", "p_NO_THIETBI", "p_MA_DVIQLY", 
                    "p_MA_NHOM_TBI", "p_TRANG_THAI", "p_MK_NGAY_KHOA_TU", "p_MK_NGAY_KHOA_DEN",
                     pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
                     ma_nhom_tbi, trang_thai, mk_ngay_khoa_tu, mk_ngay_khoa_den
                );

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["NGAY_TAO"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        //model.mk_ngay_mo = ds.Rows[i]["NGAY_MO"] != DBNull.Value ? ds.Rows[i]["NGAY_MO"].ToString() : null;
                        //model.mk_nguoi_mo = ds.Rows[i]["NGUOI_MO"] != DBNull.Value ? ds.Rows[i]["NGUOI_MO"].ToString() : null;
                        //model.mk_ngay_khoa = ds.Rows[i]["NGAY_KHOA"] != DBNull.Value ? ds.Rows[i]["NGAY_KHOA"].ToString() : null;
                        //model.mk_nguoi_khoa = ds.Rows[i]["NGUOI_KHOA"] != DBNull.Value ? ds.Rows[i]["NGUOI_KHOA"].ToString() : null;
                        //model.mk_ly_do = ds.Rows[i]["LY_DO"] != DBNull.Value ? ds.Rows[i]["LY_DO"].ToString() : null;
                        //model.mk_noi_dung = ds.Rows[i]["NOI_DUNG"] != DBNull.Value ? ds.Rows[i]["NOI_DUNG"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["ngay_vanhanh"] != DBNull.Value ? ds.Rows[i]["ngay_vanhanh"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["trang_thai"] != DBNull.Value ? ds.Rows[i]["trang_thai"].ToString() : null;


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

        public List<QLTB_DM_THIETBI_Model> GET_DUYET_TBIMOI_CNTT_V2(
            int pageIndex, int pageSize, string id, string search_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string tbi_dm_chungloai_id, string trang_thai, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, out int totalItems
        )
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_DUYET_TBIMOI_CNTT_V2",
                    "p_page_index", "p_page_size", "p_ID", "p_SEARCH_THIETBI", "p_MA_DVIQLY",
                    "p_MA_NHOM_TBI", "p_TBI_DM_CHUNGLOAI_ID", "p_TRANG_THAI", "p_MK_NGAY_KHOA_TU", "p_MK_NGAY_KHOA_DEN",
                     pageIndex, pageSize, id, search_thietbi, ma_dviqly,
                     ma_nhom_tbi, tbi_dm_chungloai_id, trang_thai, mk_ngay_khoa_tu, mk_ngay_khoa_den
                );

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["NGAY_TAO"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        //model.mk_ngay_mo = ds.Rows[i]["NGAY_MO"] != DBNull.Value ? ds.Rows[i]["NGAY_MO"].ToString() : null;
                        //model.mk_nguoi_mo = ds.Rows[i]["NGUOI_MO"] != DBNull.Value ? ds.Rows[i]["NGUOI_MO"].ToString() : null;
                        //model.mk_ngay_khoa = ds.Rows[i]["NGAY_KHOA"] != DBNull.Value ? ds.Rows[i]["NGAY_KHOA"].ToString() : null;
                        //model.mk_nguoi_khoa = ds.Rows[i]["NGUOI_KHOA"] != DBNull.Value ? ds.Rows[i]["NGUOI_KHOA"].ToString() : null;
                        //model.mk_ly_do = ds.Rows[i]["LY_DO"] != DBNull.Value ? ds.Rows[i]["LY_DO"].ToString() : null;
                        //model.mk_noi_dung = ds.Rows[i]["NOI_DUNG"] != DBNull.Value ? ds.Rows[i]["NOI_DUNG"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["ngay_vanhanh"] != DBNull.Value ? ds.Rows[i]["ngay_vanhanh"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["trang_thai"] != DBNull.Value ? ds.Rows[i]["trang_thai"].ToString() : null;


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

        public string Update_DUYET_TBIMOI(DuyetThietBiRequest request)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_DUYET_TBIMOI", "p_Error",
                                                   "p_ID", "p_NGUOI_DUYET", request.id, request.nguoi_duyet);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_DUYET_TBIMOI_MULTI(DuyetThietBiMultiRequest request)
        {
            try
            {
                if (request.ids == null || request.ids.Count == 0)
                    return "Danh sách ID rỗng.";

                string idList = string.Join(",", request.ids); //chuyển sang chuỗi

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_DUYET_TBIMOI_MULTI", "p_Error",
                                                   "p_IDS", "p_NGUOI_DUYET", idList, request.nguoi_duyet);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        #endregion

        #region Duyệt mở khóa thiết bị được yêu cầu
        public List<QLTB_DM_THIETBI_Model> GET_DUYETMOKHOA_CNTT(
           int pageIndex, int pageSize, string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
           string ma_nhom_tbi, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, out int totalItems
       )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_DUYETMOKHOA_CNTT",
                    "p_page_index", "p_page_size", "p_ID", "p_TEN_THIETBI", "p_MA_THIETBI", "p_NO_THIETBI", "p_MA_DVIQLY",
                    "p_MA_NHOM_TBI", "p_TRANG_THAI", "p_DUYET_TBI", "p_MK_NGAY_KHOA_TU", "p_MK_NGAY_KHOA_DEN",
                     pageIndex, pageSize, id, ten_thietbi, ma_thietbi, no_thietbi, ma_dviqly,
                     ma_nhom_tbi, trang_thai, duyet_tbi, mk_ngay_khoa_tu, mk_ngay_khoa_den
                );

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.khoa_tbi = ds.Rows[i]["KHOA_TBI"] != DBNull.Value ? ds.Rows[i]["KHOA_TBI"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.mk_ngay_tao = ds.Rows[i]["MK_NGAY_TAO"] != DBNull.Value ? ds.Rows[i]["MK_NGAY_TAO"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.mk_nguoi_tao = ds.Rows[i]["MK_NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["MK_NGUOI_TAO"].ToString() : null;
                        model.mk_ngay_mo = ds.Rows[i]["NGAY_MO"] != DBNull.Value ? ds.Rows[i]["NGAY_MO"].ToString() : null;
                        model.mk_nguoi_mo = ds.Rows[i]["NGUOI_MO"] != DBNull.Value ? ds.Rows[i]["NGUOI_MO"].ToString() : null;
                        model.mk_ngay_khoa = ds.Rows[i]["NGAY_KHOA"] != DBNull.Value ? ds.Rows[i]["NGAY_KHOA"].ToString() : null;
                        model.mk_nguoi_khoa = ds.Rows[i]["NGUOI_KHOA"] != DBNull.Value ? ds.Rows[i]["NGUOI_KHOA"].ToString() : null;
                        model.mk_ly_do = ds.Rows[i]["LY_DO"] != DBNull.Value ? ds.Rows[i]["LY_DO"].ToString() : null;
                        model.mk_noi_dung = ds.Rows[i]["NOI_DUNG"] != DBNull.Value ? ds.Rows[i]["NOI_DUNG"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["ngay_vanhanh"] != DBNull.Value ? ds.Rows[i]["ngay_vanhanh"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["trang_thai"] != DBNull.Value ? ds.Rows[i]["trang_thai"].ToString() : null;


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

        public List<QLTB_DM_THIETBI_Model> GET_DUYETMOKHOA_CNTT_V2(
          int pageIndex, int pageSize, string id, string search_thietbi, string ma_dviqly,
          string ma_nhom_tbi, string tbi_dm_chungloai_id, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, out int totalItems
      )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_DUYETMOKHOA_CNTT_V2",
                    "p_page_index", "p_page_size", "p_ID", "p_SEARCH_THIETBI", "p_MA_DVIQLY",
                    "p_MA_NHOM_TBI", "p_TBI_DM_CHUNGLOAI_ID", "p_TRANG_THAI", "p_DUYET_TBI", "p_MK_NGAY_KHOA_TU", "p_MK_NGAY_KHOA_DEN",
                     pageIndex, pageSize, id, search_thietbi, ma_dviqly,
                     ma_nhom_tbi, tbi_dm_chungloai_id, trang_thai, duyet_tbi, mk_ngay_khoa_tu, mk_ngay_khoa_den
                );

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.khoa_tbi = ds.Rows[i]["KHOA_TBI"] != DBNull.Value ? ds.Rows[i]["KHOA_TBI"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.mk_ngay_tao = ds.Rows[i]["MK_NGAY_TAO"] != DBNull.Value ? ds.Rows[i]["MK_NGAY_TAO"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.mk_nguoi_tao = ds.Rows[i]["MK_NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["MK_NGUOI_TAO"].ToString() : null;
                        model.mk_ngay_mo = ds.Rows[i]["NGAY_MO"] != DBNull.Value ? ds.Rows[i]["NGAY_MO"].ToString() : null;
                        model.mk_nguoi_mo = ds.Rows[i]["NGUOI_MO"] != DBNull.Value ? ds.Rows[i]["NGUOI_MO"].ToString() : null;
                        model.mk_ngay_khoa = ds.Rows[i]["NGAY_KHOA"] != DBNull.Value ? ds.Rows[i]["NGAY_KHOA"].ToString() : null;
                        model.mk_nguoi_khoa = ds.Rows[i]["NGUOI_KHOA"] != DBNull.Value ? ds.Rows[i]["NGUOI_KHOA"].ToString() : null;
                        model.mk_ly_do = ds.Rows[i]["LY_DO"] != DBNull.Value ? ds.Rows[i]["LY_DO"].ToString() : null;
                        model.mk_noi_dung = ds.Rows[i]["NOI_DUNG"] != DBNull.Value ? ds.Rows[i]["NOI_DUNG"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["ten_hang_sx"] != DBNull.Value ? ds.Rows[i]["ten_hang_sx"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["ngay_vanhanh"] != DBNull.Value ? ds.Rows[i]["ngay_vanhanh"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["trang_thai"] != DBNull.Value ? ds.Rows[i]["trang_thai"].ToString() : null;


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

        public string Update_DUYET_MOKHOA(DuyetThietBiRequest request)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.UPDATE_MOKHOA", "p_Error",
                                                   "p_ID", "p_NGUOI_MO", request.id, request.nguoi_duyet);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_DUYET_MOKHOA_MULTI(DuyetThietBiMultiRequest request)
        {
            try
            {
                if (request.ids == null || request.ids.Count == 0)
                    return "Danh sách ID rỗng.";

                string idList = string.Join(",", request.ids); //chuyển sang chuỗi

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.UPDATE_MOKHOA_MULTI", "p_Error",
                                                   "p_IDS", "p_NGUOI_MO", idList, request.nguoi_duyet);

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
