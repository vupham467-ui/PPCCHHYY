using System.Collections.Generic;
using System;
using System.Data;
using APIPCHY.Helpers;
using QLTB_API.Models.QLTB.DANH_MUC;
using QLTB_API.Models.QLTB.QUANLYCAP3;
using System.Linq;

namespace QLTB_API.Models.QLTB.QUANLYCAP4
{
    public class QLTB_DangKyMoKhoaTB_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        #region Đăng ký mở khóa thiết bị
        public List<QLTB_DM_THIETBI_Model> GET_MOKHOA_TBI_CNTT(
            int pageIndex, int pageSize, string id, string ten_thietbi, string ma_thietbi, string no_thietbi, string ma_dviqly,
            string ma_nhom_tbi, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_MOKHOA_TBI_CNTT",
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
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.mk_ngay_tao = ds.Rows[i]["NGAY_TAO"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO"].ToString() : null;
                        model.mk_nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        model.mk_ngay_mo = ds.Rows[i]["NGAY_MO"] != DBNull.Value ? ds.Rows[i]["NGAY_MO"].ToString() : null;
                        model.mk_nguoi_mo = ds.Rows[i]["NGUOI_MO"] != DBNull.Value ? ds.Rows[i]["NGUOI_MO"].ToString() : null;
                        model.mk_ngay_khoa = ds.Rows[i]["NGAY_KHOA"] != DBNull.Value ? ds.Rows[i]["NGAY_KHOA"].ToString() : null;
                        model.mk_nguoi_khoa = ds.Rows[i]["NGUOI_KHOA"] != DBNull.Value ? ds.Rows[i]["NGUOI_KHOA"].ToString() : null;
                        model.mk_ly_do = ds.Rows[i]["LY_DO"] != DBNull.Value ? ds.Rows[i]["LY_DO"].ToString() : null;
                        model.mk_noi_dung = ds.Rows[i]["NOI_DUNG"] != DBNull.Value ? ds.Rows[i]["NOI_DUNG"].ToString() : null;
                        model.mk_trang_thai = ds.Rows[i]["TRANG_THAI1"] != DBNull.Value ? ds.Rows[i]["TRANG_THAI1"].ToString() : null;
                        model.mk_trang_thai_ten = ds.Rows[i]["TRANG_THAI"] != DBNull.Value ? ds.Rows[i]["TRANG_THAI"].ToString() : null;


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

        public List<QLTB_DM_THIETBI_Model> GET_MOKHOA_TBI_CNTT_V2(
           int pageIndex, int pageSize, string id, string search_thietbi, string ma_dviqly,
           string ma_nhom_tbi, string tbi_dm_chungloai_id, string tbi_trangthai_id, string trang_thai, string duyet_tbi, string mk_ngay_khoa_tu, string mk_ngay_khoa_den, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_MOKHOA_TBI_CNTT_V2",
                    "p_page_index", "p_page_size", "p_ID", "p_SEARCH_THIETBI", "p_MA_DVIQLY",
                    "p_MA_NHOM_TBI", "p_TBI_DM_CHUNGLOAI_ID", "p_TBI_TRANGTHAI_ID", "p_TRANG_THAI", "p_DUYET_TBI", "p_MK_NGAY_KHOA_TU", "p_MK_NGAY_KHOA_DEN",
                     pageIndex, pageSize, id, search_thietbi, ma_dviqly,
                     ma_nhom_tbi, tbi_dm_chungloai_id, tbi_trangthai_id, trang_thai, duyet_tbi, mk_ngay_khoa_tu, mk_ngay_khoa_den
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
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.mk_ngay_tao = ds.Rows[i]["NGAY_TAO"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO"].ToString() : null;
                        model.mk_nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        model.mk_ngay_mo = ds.Rows[i]["NGAY_MO"] != DBNull.Value ? ds.Rows[i]["NGAY_MO"].ToString() : null;
                        model.mk_nguoi_mo = ds.Rows[i]["NGUOI_MO"] != DBNull.Value ? ds.Rows[i]["NGUOI_MO"].ToString() : null;
                        model.mk_ngay_khoa = ds.Rows[i]["NGAY_KHOA"] != DBNull.Value ? ds.Rows[i]["NGAY_KHOA"].ToString() : null;
                        model.mk_nguoi_khoa = ds.Rows[i]["NGUOI_KHOA"] != DBNull.Value ? ds.Rows[i]["NGUOI_KHOA"].ToString() : null;
                        model.mk_ly_do = ds.Rows[i]["LY_DO"] != DBNull.Value ? ds.Rows[i]["LY_DO"].ToString() : null;
                        model.mk_noi_dung = ds.Rows[i]["NOI_DUNG"] != DBNull.Value ? ds.Rows[i]["NOI_DUNG"].ToString() : null;
                        model.mk_trang_thai = ds.Rows[i]["TRANG_THAI1"] != DBNull.Value ? ds.Rows[i]["TRANG_THAI1"].ToString() : null;
                        model.mk_trang_thai_ten = ds.Rows[i]["TRANG_THAI"] != DBNull.Value ? ds.Rows[i]["TRANG_THAI"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["tbi_trangthai_ten"] != DBNull.Value ? ds.Rows[i]["tbi_trangthai_ten"].ToString() : null;


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

        public string Insert_QLTB_DKMOKHOA(DangKyMoKhoaRequest request)
        {
            try
            {
                string id_new = Guid.NewGuid().ToString();

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.INSERT_DKMOKHOA", "p_Error",
                    "p_ID", "p_MA_DVIQLY", "p_TBI_DM_THIETBI_ID", "p_NGUOI_TAO", "p_TRANG_THAI", "p_LY_DO", "p_NOI_DUNG",
                    id_new, request.ma_dviqly, request.tbi_dm_thietbi_id, request.mk_nguoi_tao, "", request.mk_ly_do, request.mk_noi_dung);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Insert_QLTB_DKMOKHOA_MULTI(DangKyMoKhoaMultiRequest request)
        {
            try
            {
                if (request.tbi_dm_thietbi_ids == null || request.tbi_dm_thietbi_ids.Count == 0)
                    return "Danh sách ID thiết bị rỗng.";

                // Sinh danh sách GUID tương ứng với mỗi ID thiết bị
                List<string> newIds = request.tbi_dm_thietbi_ids
                    .Select(_ => Guid.NewGuid().ToString())
                    .ToList();

                string idNewList = string.Join(",", newIds);
                string idList = string.Join(",", request.tbi_dm_thietbi_ids);

                

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.INSERT_DKMOKHOA_MULTI", "p_Error",
                    "p_IDS", "p_MA_DVIQLY", "p_TBI_DM_THIETBI_IDS", "p_NGUOI_TAO", "p_TRANG_THAI", "p_LY_DO", "p_NOI_DUNG",
                    idNewList, request.ma_dviqly, idList, request.mk_nguoi_tao, "", request.mk_ly_do, request.mk_noi_dung);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DKMOKHOA(string id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.DELETE_DKMOKHOA", "p_Error", "p_ID", id
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DKMOKHOA_MULTI(List<string> tbi_dm_thietbi_ids)
        {
            try
            {
                if (tbi_dm_thietbi_ids == null || tbi_dm_thietbi_ids.Count == 0)
                    return "Danh sách ID rỗng.";

                string idList = string.Join(",", tbi_dm_thietbi_ids); //chuyển sang chuỗi

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.DELETE_DKMOKHOA_MULTI", "p_Error",
                                                   "p_IDS", idList);

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
