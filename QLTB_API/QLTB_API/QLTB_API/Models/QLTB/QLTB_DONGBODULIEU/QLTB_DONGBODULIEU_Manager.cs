using System.Collections.Generic;
using System;
using System.Data;
using APIPCHY.Helpers;
using QLTB_API.Models.QLTB.QUANLYCAP3;

namespace QLTB_API.Models.QLTB.QLTB_DONGBODULIEU
{
    public class QLTB_DONGBODULIEU_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        public List<QLTB_DULIEU_THIETBI_MAPPING_Model> get_STG_THIETBI_OLD(
           int pageIndex, int pageSize, int? sync_status, string ma_dviqly, string ma_nhom_tbi, string tbi_trangthai_new, string duyet_tbi,
           string tbi_dm_chungloai_id, string no_thietbi, string ma_thietbi, string ten_thietbi, out int totalItems
        )
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_STG_THIETBI_OLD",
                    "p_page_index", "p_page_size", "p_SYNC_STATUS", "p_MA_DVIQLY", "p_MA_NHOM_TBI", "p_TBI_TRANGTHAI_NEW", "p_DUYET_TBI",
                    "p_TBI_DM_CHUNGLOAI_ID", "p_NO_THIETBI", "p_MA_THIETBI", "p_TEN_THIETBI", 
                     pageIndex, pageSize, sync_status, ma_dviqly, ma_nhom_tbi, tbi_trangthai_new, duyet_tbi,
                     tbi_dm_chungloai_id, no_thietbi, ma_thietbi, ten_thietbi);

                List<QLTB_DULIEU_THIETBI_MAPPING_Model> list = new List<QLTB_DULIEU_THIETBI_MAPPING_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DULIEU_THIETBI_MAPPING_Model model = new QLTB_DULIEU_THIETBI_MAPPING_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.tbi_dm_chungloai_id = ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"].ToString()) : null;
                        model.tbi_kho_id = ds.Rows[i]["TBI_KHO_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_KHO_ID"].ToString()) : null;
                        model.tbi_trangthai_id = ds.Rows[i]["TBI_TRANGTHAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_TRANGTHAI_ID"].ToString()) : null;
                        model.tbi_dm_hangsx_id = ds.Rows[i]["tbi_dm_hangsx_id"] != DBNull.Value ? int.Parse(ds.Rows[i]["tbi_dm_hangsx_id"].ToString()) : null;
                        model.dm_donvitinh_id = ds.Rows[i]["dm_donvitinh_id"] != DBNull.Value ? ds.Rows[i]["dm_donvitinh_id"].ToString() : null;
                        model.dm_donvi_id = ds.Rows[i]["DM_DONVI_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_ID"].ToString() : null;
                        model.dm_phongban_id = ds.Rows[i]["DM_PHONGBAN_ID"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_ID"].ToString() : null;
                        model.dm_phongban_id_old = ds.Rows[i]["dm_phongban_id_old"] != DBNull.Value ? ds.Rows[i]["dm_phongban_id_old"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.tbi_kho_ten = ds.Rows[i]["TBI_KHO_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_KHO_TEN"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["TBI_TRANGTHAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_TRANGTHAI_TEN"].ToString() : null;
                        model.dm_donvi_ten = ds.Rows[i]["DM_DONVI_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_TEN"].ToString() : null;
                        model.dm_phongban_ten = ds.Rows[i]["DM_PHONGBAN_TEN"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_TEN"].ToString() : null;
                        model.dm_phongban_ten_old = ds.Rows[i]["dm_phongban_ten_old"] != DBNull.Value ? ds.Rows[i]["dm_phongban_ten_old"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.nguoi_sd = ds.Rows[i]["NGUOI_SD"] != DBNull.Value ? ds.Rows[i]["NGUOI_SD"].ToString() : null;
                        model.nguoi_sd_old = ds.Rows[i]["nguoi_sd_old"] != DBNull.Value ? ds.Rows[i]["nguoi_sd_old"].ToString() : null;
                        model.thong_tin_khac = ds.Rows[i]["thong_tin_khac"] != DBNull.Value ? ds.Rows[i]["thong_tin_khac"].ToString() : null;
                        model.thongtin_chitiet_json = ds.Rows[i]["thongtin_chitiet_json"] != DBNull.Value ? ds.Rows[i]["thongtin_chitiet_json"].ToString() : null;
                        model.ct_cauhinh_json = ds.Rows[i]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[i]["ct_cauhinh_json"].ToString() : null;
                        model.sync_status = ds.Rows[i]["sync_status"] != DBNull.Value ? int.Parse(ds.Rows[i]["sync_status"].ToString()) : null;
                        model.sync_error = ds.Rows[i]["sync_error"] != DBNull.Value ? ds.Rows[i]["sync_error"].ToString() : null;
                        model.updated_by = ds.Rows[i]["updated_by"] != DBNull.Value ? ds.Rows[i]["updated_by"].ToString() : null;
                        model.updated_date = ds.Rows[i]["updated_date"] != DBNull.Value ? ds.Rows[i]["updated_date"].ToString() : null;
                        model.sync_by = ds.Rows[i]["sync_by"] != DBNull.Value ? ds.Rows[i]["sync_by"].ToString() : null;
                        model.sync_date = ds.Rows[i]["sync_date"] != DBNull.Value ? ds.Rows[i]["sync_date"].ToString() : null;
                        model.is_locked = ds.Rows[i]["is_locked"] != DBNull.Value ? int.Parse(ds.Rows[i]["is_locked"].ToString()) : null;
                        model.lock_by = ds.Rows[i]["lock_by"] != DBNull.Value ? ds.Rows[i]["lock_by"].ToString() : null;
                        model.lock_date = ds.Rows[i]["lock_date"] != DBNull.Value ? ds.Rows[i]["lock_date"].ToString() : null;


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
        public QLTB_DULIEU_THIETBI_MAPPING_Model get_STG_THIETBI_OLD_BY_ID(string id)
        {
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_STG_THIETBI_OLD_BY_ID", "p_ID", id);
                if (ds.Rows.Count == 0)
                {
                    return null; // Không có dữ liệu
                }
                QLTB_DULIEU_THIETBI_MAPPING_Model model = new QLTB_DULIEU_THIETBI_MAPPING_Model();
                model.id = ds.Rows[0]["id"] != DBNull.Value ? ds.Rows[0]["id"].ToString() : null;
                model.ma_dviqly = ds.Rows[0]["ma_dviqly"] != DBNull.Value ? ds.Rows[0]["ma_dviqly"].ToString() : null;
                model.tbi_dm_chungloai_id = ds.Rows[0]["TBI_DM_CHUNGLOAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[0]["TBI_DM_CHUNGLOAI_ID"].ToString()) : null;
                model.tbi_kho_id = ds.Rows[0]["TBI_KHO_ID"] != DBNull.Value ? int.Parse(ds.Rows[0]["TBI_KHO_ID"].ToString()) : null;
                model.tbi_kho_id_old = ds.Rows[0]["tbi_kho_id_old"] != DBNull.Value ? int.Parse(ds.Rows[0]["tbi_kho_id_old"].ToString()) : null;
                model.tbi_trangthai_id = ds.Rows[0]["TBI_TRANGTHAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[0]["TBI_TRANGTHAI_ID"].ToString()) : null;
                model.tbi_dm_hangsx_id = ds.Rows[0]["tbi_dm_hangsx_id"] != DBNull.Value ? int.Parse(ds.Rows[0]["tbi_dm_hangsx_id"].ToString()) : null;
                model.tbi_nuocsx_id = ds.Rows[0]["tbi_nuocsx_id"] != DBNull.Value ? int.Parse(ds.Rows[0]["tbi_nuocsx_id"].ToString()) : null;
                model.dm_donvitinh_id = ds.Rows[0]["dm_donvitinh_id"] != DBNull.Value ? ds.Rows[0]["dm_donvitinh_id"].ToString() : null;
                model.namsx = ds.Rows[0]["namsx"] != DBNull.Value ? ds.Rows[0]["namsx"].ToString() : null;
                model.dm_donvi_id = ds.Rows[0]["DM_DONVI_ID"] != DBNull.Value ? ds.Rows[0]["DM_DONVI_ID"].ToString() : null;
                model.dm_phongban_id = ds.Rows[0]["DM_PHONGBAN_ID"] != DBNull.Value ? ds.Rows[0]["DM_PHONGBAN_ID"].ToString() : null;
                model.dm_phongban_id_old = ds.Rows[0]["dm_phongban_id_old"] != DBNull.Value ? ds.Rows[0]["dm_phongban_id_old"].ToString() : null;
                model.tbi_dm_chungloai_ten = ds.Rows[0]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[0]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                model.tbi_kho_ten = ds.Rows[0]["TBI_KHO_TEN"] != DBNull.Value ? ds.Rows[0]["TBI_KHO_TEN"].ToString() : null;
                model.tbi_kho_ten_old = ds.Rows[0]["tbi_kho_ten_old"] != DBNull.Value ? ds.Rows[0]["tbi_kho_ten_old"].ToString() : null;
                model.tbi_trangthai_ten = ds.Rows[0]["TBI_TRANGTHAI_TEN"] != DBNull.Value ? ds.Rows[0]["TBI_TRANGTHAI_TEN"].ToString() : null;
                model.dm_donvi_ten = ds.Rows[0]["DM_DONVI_TEN"] != DBNull.Value ? ds.Rows[0]["DM_DONVI_TEN"].ToString() : null;
                model.dm_phongban_ten = ds.Rows[0]["DM_PHONGBAN_TEN"] != DBNull.Value ? ds.Rows[0]["DM_PHONGBAN_TEN"].ToString() : null;
                model.dm_phongban_ten_old = ds.Rows[0]["dm_phongban_ten_old"] != DBNull.Value ? ds.Rows[0]["dm_phongban_ten_old"].ToString() : null;
                model.ma_thietbi = ds.Rows[0]["MA_THIETBI"] != DBNull.Value ? ds.Rows[0]["MA_THIETBI"].ToString() : null;
                model.no_thietbi = ds.Rows[0]["NO_THIETBI"] != DBNull.Value ? ds.Rows[0]["NO_THIETBI"].ToString() : null;
                model.ten_thietbi = ds.Rows[0]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[0]["TEN_THIETBI"].ToString() : null;
                model.duyet_tbi = ds.Rows[0]["DUYET_TBI"] != DBNull.Value ? ds.Rows[0]["DUYET_TBI"].ToString() : null;
                model.nguoi_sd = ds.Rows[0]["NGUOI_SD"] != DBNull.Value ? ds.Rows[0]["NGUOI_SD"].ToString() : null;
                model.nguoi_sd_old = ds.Rows[0]["nguoi_sd_old"] != DBNull.Value ? ds.Rows[0]["nguoi_sd_old"].ToString() : null;
                model.ngay_vanhanh = ds.Rows[0]["ngay_vanhanh"] != DBNull.Value ? ds.Rows[0]["ngay_vanhanh"].ToString() : null;
                model.thong_tin_khac = ds.Rows[0]["thong_tin_khac"] != DBNull.Value ? ds.Rows[0]["thong_tin_khac"].ToString() : null;
                model.thongtin_chitiet_json = ds.Rows[0]["thongtin_chitiet_json"] != DBNull.Value ? ds.Rows[0]["thongtin_chitiet_json"].ToString() : null;
                model.ct_cauhinh_json = ds.Rows[0]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[0]["ct_cauhinh_json"].ToString() : null;
                model.sync_status = ds.Rows[0]["sync_status"] != DBNull.Value ? int.Parse(ds.Rows[0]["sync_status"].ToString()) : null;
                model.sync_error = ds.Rows[0]["sync_error"] != DBNull.Value ? ds.Rows[0]["sync_error"].ToString() : null;
                model.updated_by = ds.Rows[0]["updated_by"] != DBNull.Value ? ds.Rows[0]["updated_by"].ToString() : null;
                model.updated_date = ds.Rows[0]["updated_date"] != DBNull.Value ? ds.Rows[0]["updated_date"].ToString() : null;
                model.sync_by = ds.Rows[0]["sync_by"] != DBNull.Value ? ds.Rows[0]["sync_by"].ToString() : null;
                model.sync_date = ds.Rows[0]["sync_date"] != DBNull.Value ? ds.Rows[0]["sync_date"].ToString() : null;
                model.is_locked = ds.Rows[0]["is_locked"] != DBNull.Value ? int.Parse(ds.Rows[0]["is_locked"].ToString()) : null;
                model.lock_by = ds.Rows[0]["lock_by"] != DBNull.Value ? ds.Rows[0]["lock_by"].ToString() : null;
                model.lock_date = ds.Rows[0]["lock_date"] != DBNull.Value ? ds.Rows[0]["lock_date"].ToString() : null;


                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string update_STG_THIETBI_OLD(QLTB_UpdateData_TBCu_Model model)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.update_STG_THIETBI_OLD", "p_Error",
                    "P_ID", "P_DM_PHONGBAN_ID_NEW", "P_TBI_KHO_ID_NEW", "P_TBI_TRANGTHAI_NEW", "P_NGUOI_SD_NEW", "P_THONGTIN_CHITIET_JSON", "P_UPDATED_BY",
                    model.id, model.dm_phongban_id_new, model.tbi_kho_id_new, model.tbi_trangthai_new, model.nguoi_sd_new, model.thongtin_chitiet_json, model.updated_by
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string update_STG_THIETBI_DX_BY_DVI(QLTB_UpdateData_TBDoxaCu_Model model)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.update_STG_THIETBI_DX_BY_DVI", "p_Error",
                    "P_MA_DVIQLY", "P_DM_PHONGBAN_ID_NEW", "P_TBI_KHO_ID_NEW", "P_TBI_TRANGTHAI_NEW", "P_NGUOI_SD_NEW", "P_UPDATED_BY",
                    model.ma_dviqly, model.dm_phongban_id_new, model.tbi_kho_id_new, model.tbi_trangthai_new, model.nguoi_sd_new, model.updated_by
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string rollback_STG_THIETBI_DX_BY_DVI(QLTB_UpdateData_TBDoxaCu_Model model)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.rollback_STG_THIETBI_DX_BY_DVI", "p_Error",
                    "P_MA_DVIQLY", "P_TBI_TRANGTHAI_NEW", "P_UPDATED_BY",
                    model.ma_dviqly, model.tbi_trangthai_new, model.updated_by
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }


        public string sync_one_TBI_from_STG(QLTB_SyncData_TBCu_Model model)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.sync_one_TBI_from_STG", "p_Error",
                    "P_STG_ID", "P_SYNC_BY", model.stg_id, model.sync_by
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }
        public string sync_list_TBI_from_STG(QLTB_SyncData_TBCu_Multi_Model request)
        {
            try
            {
                if (request.list_id == null || request.list_id.Count == 0)
                    return "Danh sách TBI_ID rỗng.";

                string idList = string.Join(",", request.list_id); //chuyển sang chuỗi

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.sync_list_TBI_from_STG", "p_Error",
                                                   "P_LIST_ID", "P_SYNC_BY", idList, request.sync_by);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }


    }
}
