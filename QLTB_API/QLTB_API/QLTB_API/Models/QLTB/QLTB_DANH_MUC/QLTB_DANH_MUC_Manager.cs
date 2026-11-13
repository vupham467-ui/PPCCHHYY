using APIPCHY.Helpers;
using System.Collections.Generic;
using System;
using System.Data;
using QLTB_API.Models.QLTB.DANH_MUC;
using System.Text.Json;
using QLTB_API.Models.QLTB.QUANLYCAP3;
using QLTB_API.Models.QUAN_TRI.DM_DONVI;
using QLTB_API.Models.QUAN_TRI.DM_PHONGBAN;
using OfficeOpenXml;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
using OfficeOpenXml.Style;
using System.Drawing;


namespace QLTB_API.Models.QLTB.QLTB_DANH_MUC
{
    public static class ListExtensions
    {
        public static void AddIfNotNull(this List<string> list, string? message)
        {
            if (!string.IsNullOrWhiteSpace(message))
                list.Add(message);
        }
    }
    public class QLTB_DANH_MUC_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        DM_DONVI_Manager don_vi = new DM_DONVI_Manager();
        DM_PHONGBAN_Manager phong_ban = new DM_PHONGBAN_Manager();

        #region Danh mục nước SX
        public List<QLTB_DM_NUOCSX_Model> Get_QLTB_DM_NUOCSX(int pageIndex, int pageSize, string id, string ma_nuoc_sx, string ten_nuoc_sx, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_NUOCSX_PAGING", "p_page_index", "p_page_size", "p_ID", "p_MA_NUOC_SX", "p_TEN_NUOC_SX", pageIndex, pageSize, id, ma_nuoc_sx, ten_nuoc_sx );
                List<QLTB_DM_NUOCSX_Model> list = new List<QLTB_DM_NUOCSX_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_NUOCSX_Model model = new QLTB_DM_NUOCSX_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["ID"].ToString()) : null;
                        model.ma_nuoc_sx = ds.Rows[i]["MA_NUOC_SX"] != DBNull.Value ? ds.Rows[i]["MA_NUOC_SX"].ToString() : null;
                        model.ten_nuoc_sx = ds.Rows[i]["TEN_NUOC_SX"] != DBNull.Value ? ds.Rows[i]["TEN_NUOC_SX"].ToString() : null;

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

        public string Insert_QLTB_DM_NUOCSX(QLTB_DM_NUOCSX_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.insert_TBI_DM_NUOCSX", "p_Error",
                                                    "p_MA_NUOC_SX", "p_TEN_NUOC_SX",
                                                    model.ma_nuoc_sx, model.ten_nuoc_sx);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_QLTB_DM_NUOCSX(QLTB_DM_NUOCSX_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_TBI_DM_NUOCSX", "p_Error",
                                                    "p_ID", "p_MA_NUOC_SX", "p_TEN_NUOC_SX", 
                                                     model.id, model.ma_nuoc_sx, model.ten_nuoc_sx);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_NUOCSX(int id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.delete_TBI_DM_NUOCSX", "p_Error",
                                                    "p_ID", id);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        #endregion

        #region Danh mục nhóm thiết bị
        public List<QLTB_DM_NHOM_Model> Get_QLTB_DM_NHOM(int pageIndex, int pageSize, string searchData, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_NHOM", "p_page_index", "p_page_size", "p_searchData", pageIndex, pageSize, searchData);
                List<QLTB_DM_NHOM_Model> list = new List<QLTB_DM_NHOM_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_NHOM_Model model = new QLTB_DM_NHOM_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["ID"].ToString()) : null;
                        model.ma_nhom = ds.Rows[i]["MA_NHOM"] != DBNull.Value ? ds.Rows[i]["MA_NHOM"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["TEN_NHOM"] != DBNull.Value ? ds.Rows[i]["TEN_NHOM"].ToString() : null;
                        model.ghi_chu = ds.Rows[i]["GHI_CHU"] != DBNull.Value ? ds.Rows[i]["GHI_CHU"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["NGAY_TAO"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["NGAY_TAO"]) : (DateTime?)null;
                        model.nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        model.ngay_sua = ds.Rows[i]["NGAY_SUA"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["NGAY_SUA"]) : (DateTime?)null;
                        model.nguoi_sua = ds.Rows[i]["NGUOI_SUA"] != DBNull.Value ? ds.Rows[i]["NGUOI_SUA"].ToString() : null;

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

        public string Insert_QLTB_DM_NHOM(QLTB_DM_NHOM_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.insert_TBI_DM_NHOM", "p_Error",
                                                    "p_MA_NHOM", "p_TEN_NHOM", "p_GHI_CHU", "p_NGUOI_TAO",
                                                    model.ma_nhom, model.ten_nhom, model.ghi_chu, model.nguoi_tao);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_QLTB_DM_NHOM(QLTB_DM_NHOM_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_TBI_DM_NHOM", "p_Error",
                                                   "p_ID", "p_MA_NHOM", "p_TEN_NHOM", "p_GHI_CHU", "p_NGUOI_SUA",
                                                     model.id, model.ma_nhom, model.ten_nhom, model.ghi_chu, model.nguoi_sua);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_NHOM(int id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.delete_TBI_DM_NHOM", "p_Error",
                                                    "p_ID", id);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        #endregion

        #region Danh mục loại nghiệp vụ
        public List<QLTB_DM_LOAI_NGHIEPVU_Model> Get_TBI_DM_LOAI_NGHIEPVU(string ma_loai_nghiepvu, string ten_loai_nghiepvu, int? loai_bban, int? cap_nghiepvu, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_LOAI_NGHIEPVU", "p_ma_loai_nghiepvu", "p_ten_loai_nghiepvu", "p_loai_bban", "p_cap_nghiepvu", ma_loai_nghiepvu, ten_loai_nghiepvu, loai_bban, cap_nghiepvu);
                List<QLTB_DM_LOAI_NGHIEPVU_Model> list = new List<QLTB_DM_LOAI_NGHIEPVU_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_LOAI_NGHIEPVU_Model model = new QLTB_DM_LOAI_NGHIEPVU_Model();
                        model.ma_loai_nghiepvu = ds.Rows[i]["ma_loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["ma_loai_nghiepvu"].ToString() : null;
                        model.ten_loai_nghiepvu = ds.Rows[i]["ten_loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["ten_loai_nghiepvu"].ToString() : null;
                        model.loai_bban = ds.Rows[i]["loai_bban"] != DBNull.Value ? int.Parse(ds.Rows[i]["loai_bban"].ToString()) : null;
                        model.ten_loai_bban = ds.Rows[i]["ten_loai_bban"] != DBNull.Value ? ds.Rows[i]["ten_loai_bban"].ToString() : null;
                        model.cap_nghiepvu = ds.Rows[i]["cap_nghiepvu"] != DBNull.Value ? int.Parse(ds.Rows[i]["cap_nghiepvu"].ToString()) : null;


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

        #endregion

        #region Danh mục chủng loại thiết bị
        public List<QLTB_DM_CHUNGLOAI_Model> Get_QLTB_DM_CHUNGLOAI(int pageIndex, int pageSize, string id, string ma_nhom, string ma_chungloai, string ten_chungloai, string can_chon_nsd, string co_thongtin_ct, out int totalItems)
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_CHUNGLOAI", "p_page_index", "p_page_size", "p_ID", "p_MA_NHOM", "p_MA_CHUNGLOAI", "p_TEN_CHUNG_LOAI", "p_CAN_CHON_NSD", "p_CO_THONGTIN_CT", pageIndex, pageSize, id, ma_nhom, ma_chungloai, ten_chungloai, can_chon_nsd, co_thongtin_ct);
                List<QLTB_DM_CHUNGLOAI_Model> list = new List<QLTB_DM_CHUNGLOAI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_CHUNGLOAI_Model model = new QLTB_DM_CHUNGLOAI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["ID"].ToString()) : null;
                        model.ma_nhom = ds.Rows[i]["MA_NHOM"] != DBNull.Value ? ds.Rows[i]["MA_NHOM"].ToString() : null;
                        model.ten_nhom = ds.Rows[i]["TEN_NHOM"] != DBNull.Value ? ds.Rows[i]["TEN_NHOM"].ToString() : null;
                        model.ma_chungloai = ds.Rows[i]["MA_CHUNGLOAI"] != DBNull.Value ? ds.Rows[i]["MA_CHUNGLOAI"].ToString() : null;
                        model.ten_chungloai = ds.Rows[i]["TEN_CHUNGLOAI"] != DBNull.Value ? ds.Rows[i]["TEN_CHUNGLOAI"].ToString() : null;
                        model.sap_xep = ds.Rows[i]["SAP_XEP"] != DBNull.Value ? int.Parse(ds.Rows[i]["SAP_XEP"].ToString()) : null;
                        model.ghi_chu = ds.Rows[i]["GHI_CHU"] != DBNull.Value ? ds.Rows[i]["GHI_CHU"].ToString() : null;
                        model.ct_cauhinh_json = ds.Rows[i]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[i]["ct_cauhinh_json"].ToString() : "";
                        model.co_thongtin_ct = ds.Rows[i]["co_thongtin_ct"] != DBNull.Value ? ds.Rows[i]["co_thongtin_ct"].ToString() : null;
                        model.can_chon_nsd = ds.Rows[i]["can_chon_nsd"] != DBNull.Value ? ds.Rows[i]["can_chon_nsd"].ToString() : null;

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

        public string Insert_QLTB_DM_CHUNGLOAI(QLTB_DM_CHUNGLOAI_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.insert_TBI_DM_CHUNGLOAI", "p_Error",
                                                    "p_MA_NHOM", "p_TEN_CHUNGLOAI", "p_GHI_CHU", "p_CT_CAUHINH_JSON", "p_CO_THONGTIN_CT","p_CAN_CHON_NSD",
                                                    model.ma_nhom, model.ten_chungloai, model.ghi_chu, model.ct_cauhinh_json, model.co_thongtin_ct, model.can_chon_nsd);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_QLTB_DM_CHUNGLOAI(QLTB_DM_CHUNGLOAI_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_TBI_DM_CHUNGLOAI", "p_Error",
                                                   "p_ID", "p_MA_CHUNGLOAI", "p_TEN_CHUNGLOAI", "p_GHI_CHU", "p_CT_CAUHINH_JSON", "p_CO_THONGTIN_CT", "p_CAN_CHON_NSD",
                                                     model.id, model.ma_chungloai, model.ten_chungloai, model.ghi_chu, model.ct_cauhinh_json, model.co_thongtin_ct, model.can_chon_nsd);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_CHUNGLOAI(int id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.delete_TBI_DM_CHUNGLOAI", "p_Error",
                                                    "p_ID", id);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        #endregion

        #region Danh mục hãng sản xuất
        public List<QLTB_DM_HANGSX_Model> Get_QLTB_DM_HANGSX(int pageIndex, int pageSize, string searchData, out int totalItems)
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_HANGSX", "p_page_index", "p_page_size", "p_searchData", pageIndex, pageSize, searchData);

                List<QLTB_DM_HANGSX_Model> list = new List<QLTB_DM_HANGSX_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_HANGSX_Model model = new QLTB_DM_HANGSX_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["ID"].ToString()) : null;
                        model.ma_hang_sx = ds.Rows[i]["MA_HANG_SX"] != DBNull.Value ? ds.Rows[i]["MA_HANG_SX"].ToString() : null;
                        model.ten_hang_sx = ds.Rows[i]["TEN_HANG_SX"] != DBNull.Value ? ds.Rows[i]["TEN_HANG_SX"].ToString() : null;

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

        public string Insert_QLTB_DM_HANGSX(QLTB_DM_HANGSX_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.insert_TBI_DM_HANGSX", "p_Error",
                                                    "p_ten_HANG_SX", model.ten_hang_sx);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_QLTB_DM_HANGSX(QLTB_DM_HANGSX_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_TBI_DM_HANGSX", "p_Error",
                                                   "p_ID", "p_TEN_HANG_SX",
                                                     model.id, model.ten_hang_sx);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_HANGSX(int id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.delete_TBI_DM_HANGSX", "p_Error",
                                                    "p_ID", id);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        #endregion

        #region Danh mục trạng thái thiết bị
        public List<QLTB_DM_TRANGTHAI_Model> Get_QLTB_DM_TRANGTHAI(int pageIndex, int pageSize, string id, string ma, string ten, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_TRANGTHAI", "p_page_index", "p_page_size", "p_ID", "p_MA", "p_TEN", pageIndex, pageSize, id, ma, ten);
                List<QLTB_DM_TRANGTHAI_Model> list = new List<QLTB_DM_TRANGTHAI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_TRANGTHAI_Model model = new QLTB_DM_TRANGTHAI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["ID"].ToString()) : null;
                        model.ma = ds.Rows[i]["MA"] != DBNull.Value ? ds.Rows[i]["MA"].ToString() : null;
                        model.ten = ds.Rows[i]["TEN"] != DBNull.Value ? ds.Rows[i]["TEN"].ToString() : null;
                        model.ten_trangthai = ds.Rows[i]["TEN_TRANGTHAI"] != DBNull.Value ? ds.Rows[i]["TEN_TRANGTHAI"].ToString() : null;
                        model.sap_xep = ds.Rows[i]["SAP_XEP"] != DBNull.Value ? int.Parse(ds.Rows[i]["SAP_XEP"].ToString()) : null;
                        model.ghi_chu = ds.Rows[i]["GHI_CHU"] != DBNull.Value ? ds.Rows[i]["GHI_CHU"].ToString() : null;

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

        #endregion

        #region Danh mục đơn vị tính
        public List<QLTB_DM_DONVITINH_Model> Get_QLTB_DM_DONVITINH(int pageIndex, int pageSize, string id, string ma, string ten, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_DONVITINH", "p_page_index", "p_page_size", "p_ID", "p_MA", "p_TEN", pageIndex, pageSize, id, ma, ten);
                List<QLTB_DM_DONVITINH_Model> list = new List<QLTB_DM_DONVITINH_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_DONVITINH_Model model = new QLTB_DM_DONVITINH_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ma = ds.Rows[i]["MA"] != DBNull.Value ? ds.Rows[i]["MA"].ToString() : null;
                        model.ten = ds.Rows[i]["TEN"] != DBNull.Value ? ds.Rows[i]["TEN"].ToString() : null;
                        model.ten_donvitinh = ds.Rows[i]["TEN_DONVITINH"] != DBNull.Value ? ds.Rows[i]["TEN_DONVITINH"].ToString() : null;
                        model.sap_xep = ds.Rows[i]["SAP_XEP"] != DBNull.Value ? int.Parse(ds.Rows[i]["SAP_XEP"].ToString()) : null;
                        model.trang_thai = ds.Rows[i]["TRANG_THAI"] != DBNull.Value ? ds.Rows[i]["TRANG_THAI"].ToString() : null;
                        model.dm_kieudulieu_id = ds.Rows[i]["DM_KIEUDULIEU_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["DM_KIEUDULIEU_ID"].ToString()) : null;
                        model.so_thap_phan = ds.Rows[i]["SO_THAP_PHAN"] != DBNull.Value ? int.Parse(ds.Rows[i]["SO_THAP_PHAN"].ToString()) : null;

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

        #endregion

        #region Danh mục kho
        public List<QLTB_DM_KHO_Model> Get_QLTB_DM_KHO(int pageIndex, int pageSize, string id, string ma_dviqly, string ma_kho, string ten_kho, out int totalItems)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_KHO", "p_page_index", "p_page_size", "p_ID", "p_MA_DVIQLY", "p_MA_KHO", "p_TEN_KHO", pageIndex, pageSize, id, ma_dviqly, ma_kho, ten_kho);
                List<QLTB_DM_KHO_Model> list = new List<QLTB_DM_KHO_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_KHO_Model model = new QLTB_DM_KHO_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["ID"].ToString()) : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.ten_don_vi = ds.Rows[i]["TEN_DON_VI"] != DBNull.Value ? ds.Rows[i]["TEN_DON_VI"].ToString() : null;
                        model.cap_donvi = ds.Rows[i]["CAP_DONVI"] != DBNull.Value ? int.Parse(ds.Rows[i]["CAP_DONVI"].ToString()) : null;
                        model.ma_kho = ds.Rows[i]["MA_KHO"] != DBNull.Value ? ds.Rows[i]["MA_KHO"].ToString() : null;
                        model.ten_kho = ds.Rows[i]["TEN_KHO"] != DBNull.Value ? ds.Rows[i]["TEN_KHO"].ToString() : null;

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

        public string Insert_QLTB_DM_KHO(QLTB_DM_KHO_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.insert_TBI_DM_KHO", "p_Error",
                                                    "p_MA_DVIQLY", "p_MA_KHO", "p_TEN_KHO", "p_NGUOI_TAO",
                                                    model.ma_dviqly, model.ma_kho, model.ten_kho, model.nguoi_tao);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_QLTB_DM_KHO(QLTB_DM_KHO_Model model)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.update_TBI_DM_KHO", "p_Error",
                                                   "p_ID", "p_MA_DVIQLY", "p_MA_KHO", "p_TEN_KHO", 
                                                     model.id, model.ma_dviqly, model.ma_kho, model.ten_kho);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_KHO(int id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.delete_TBI_DM_KHO", "p_Error",
                                                    "p_ID", id);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        #endregion

        #region Danh mục thiết bị
        public List<QLTB_DM_THIETBI_Model> Get_QLTB_DM_THIETBI(
            int pageIndex, int pageSize, string id, string tbi_dm_chungloai_id, string ma_nhom_tbi, string tbi_dm_hangsx_id, 
            string tbi_nuocsx_id, string tbi_kho_id, string tbi_trangthai_id, string dm_donvitinh_id, string dm_donvi_id, string dm_phongban_id,
            string search_thietbi, string qr_code, string ngay_vanhanh, string ngay_tao, string ngay_duyet,
            string nguoi_tao, string nguoi_duyet, string khoa_tbi, string duyet_tbi, string ma_dviqly, string namsx, string thong_tin_khac, int? trang_thai_khoa, out int totalItems
        )
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_DM_THIETBI_CNTT_V2", 
                    "p_page_index", "p_page_size", "p_ID", "p_TBI_DM_CHUNGLOAI_ID", "p_MA_NHOM_TBI", "p_TBI_DM_HANGSX_ID",
                    "p_TBI_NUOCSX_ID", "p_TBI_KHO_ID", "p_TBI_TRANGTHAI_ID", "p_DM_DONVITINH_ID", "p_DM_DONVI_ID", "p_DM_PHONGBAN_ID",
                    "p_SEARCH_THIETBI", "p_QR_CODE", "p_NGAY_VANHANH", "p_NGAY_TAO", "p_NGAY_DUYET",
                     "p_NGUOI_TAO", "p_NGUOI_DUYET", "p_KHOA_TBI", "p_DUYET_TBI", "p_MA_DVIQLY","p_NAMSX", "p_THONG_TIN_KHAC", "p_TRANG_THAI_KHOA",
                     pageIndex, pageSize, id, tbi_dm_chungloai_id, ma_nhom_tbi, tbi_dm_hangsx_id,
                    tbi_nuocsx_id, tbi_kho_id, tbi_trangthai_id, dm_donvitinh_id, dm_donvi_id, dm_phongban_id,
                    search_thietbi, qr_code, ngay_vanhanh, ngay_tao, ngay_duyet,
                    nguoi_tao, nguoi_duyet, khoa_tbi, duyet_tbi, ma_dviqly, namsx, thong_tin_khac, trang_thai_khoa);

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.tbi_dm_chungloai_id = ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"].ToString()) : null;
                        model.tbi_dm_hangsx_id = ds.Rows[i]["TBI_DM_HANGSX_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_HANGSX_ID"].ToString()) : null;
                        model.tbi_nuocsx_id = ds.Rows[i]["TBI_NUOCSX_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_NUOCSX_ID"].ToString()) : null;
                        model.tbi_kho_id = ds.Rows[i]["TBI_KHO_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_KHO_ID"].ToString()) : null;
                        model.tbi_trangthai_id = ds.Rows[i]["TBI_TRANGTHAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_TRANGTHAI_ID"].ToString()) : null;
                        model.dm_donvitinh_id = ds.Rows[i]["DM_DONVITINH_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVITINH_ID"].ToString() : null;
                        model.dm_donvi_id = ds.Rows[i]["DM_DONVI_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_ID"].ToString() : null;
                        model.dm_phongban_id = ds.Rows[i]["DM_PHONGBAN_ID"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_ID"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["TBI_DM_HANGSX_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_HANGSX_TEN"].ToString() : null;
                        model.tbi_nuocsx_ten = ds.Rows[i]["TBI_NUOCSX_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_NUOCSX_TEN"].ToString() : null;
                        model.tbi_kho_ten = ds.Rows[i]["TBI_KHO_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_KHO_TEN"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["TBI_TRANGTHAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_TRANGTHAI_TEN"].ToString() : null;
                        model.dm_donvitinh_ten = ds.Rows[i]["DM_DONVITINH_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVITINH_TEN"].ToString() : null;
                        model.dm_donvi_ten = ds.Rows[i]["DM_DONVI_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_TEN"].ToString() : null;
                        model.dm_phongban_ten = ds.Rows[i]["DM_PHONGBAN_TEN"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_TEN"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.qr_code = ds.Rows[i]["QR_CODE"] != DBNull.Value ? ds.Rows[i]["QR_CODE"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["NGAY_VANHANH"] != DBNull.Value ? ds.Rows[i]["NGAY_VANHANH"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["NGAY_TAO_HT"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO_HT"].ToString() : null;
                        model.ngay_duyet = ds.Rows[i]["NGAY_DUYET"] != DBNull.Value ? ds.Rows[i]["NGAY_DUYET"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        model.nguoi_duyet = ds.Rows[i]["NGUOI_DUYET"] != DBNull.Value ? ds.Rows[i]["NGUOI_DUYET"].ToString() : null;
                        model.khoa_tbi = ds.Rows[i]["KHOA_TBI"] != DBNull.Value ? ds.Rows[i]["KHOA_TBI"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.thong_tin_khac = ds.Rows[i]["THONG_TIN_KHAC"] != DBNull.Value ? ds.Rows[i]["THONG_TIN_KHAC"].ToString() : null;
                        model.nguoi_sd = ds.Rows[i]["NGUOI_SD"] != DBNull.Value ? ds.Rows[i]["NGUOI_SD"].ToString() : null;
                        model.ma_nhom_tbi = ds.Rows[i]["MA_NHOM_TBI"] != DBNull.Value ? ds.Rows[i]["MA_NHOM_TBI"].ToString() : null;
                        model.co_thongtin_ct = ds.Rows[i]["co_thongtin_ct"] != DBNull.Value ? ds.Rows[i]["co_thongtin_ct"].ToString() : null;
                        model.ct_cauhinh_json = ds.Rows[i]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[i]["ct_cauhinh_json"].ToString() : null;
                        model.thongtin_chitiet_json = ds.Rows[i]["thongtin_chitiet_json"] != DBNull.Value ? ds.Rows[i]["thongtin_chitiet_json"].ToString() : null;
                        model.last_bban_id = ds.Rows[i]["last_bban_id"] != DBNull.Value ? ds.Rows[i]["last_bban_id"].ToString() : null;
                        model.co_ls_giaonhan = ds.Rows[i]["co_ls_giaonhan"] != DBNull.Value ? ds.Rows[i]["co_ls_giaonhan"].ToString() : null;
                        model.trang_thai_khoa = ds.Rows[i]["trang_thai_khoa"] != DBNull.Value ? int.Parse(ds.Rows[i]["trang_thai_khoa"].ToString()) : null;

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

        public List<QLTB_DM_THIETBI_Model> Get_TBI_BANGIAO_CNTT(
            int pageIndex, int pageSize, string id, int bban_id, string tbi_dm_chungloai_id, string tbi_kho_id,
            string ma_thietbi, string no_thietbi, string ten_thietbi, string ma_dviqly, string phongban_id, string loai_nghiepvu, string nguoi_sd, out int totalItems
)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_BANGIAO_CNTT",
                    "p_page_index", "p_page_size", "p_ID", "p_BBAN_ID", "p_TBI_DM_CHUNGLOAI_ID", "p_TBI_KHO_ID",
                    "p_MA_THIETBI", "p_NO_THIETBI", "p_TEN_THIET", "p_MA_DVIQLY", "p_PHONGBAN_ID", "p_LOAI_NGHIEPVU", "p_NGUOI_SD",
                     pageIndex, pageSize, id, bban_id, tbi_dm_chungloai_id, tbi_kho_id,
                     ma_thietbi, no_thietbi, ten_thietbi,ma_dviqly, phongban_id, loai_nghiepvu, nguoi_sd);

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.tbi_dm_chungloai_id = ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"].ToString()) : null;
                        model.tbi_dm_hangsx_id = ds.Rows[i]["TBI_DM_HANGSX_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_HANGSX_ID"].ToString()) : null;
                        model.tbi_nuocsx_id = ds.Rows[i]["TBI_NUOCSX_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_NUOCSX_ID"].ToString()) : null;
                        model.tbi_kho_id = ds.Rows[i]["TBI_KHO_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_KHO_ID"].ToString()) : null;
                        model.tbi_trangthai_id = ds.Rows[i]["TBI_TRANGTHAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_TRANGTHAI_ID"].ToString()) : null;
                        model.dm_donvitinh_id = ds.Rows[i]["DM_DONVITINH_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVITINH_ID"].ToString() : null;
                        model.dm_donvi_id = ds.Rows[i]["DM_DONVI_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_ID"].ToString() : null;
                        model.dm_phongban_id = ds.Rows[i]["DM_PHONGBAN_ID"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_ID"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["TBI_DM_HANGSX_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_HANGSX_TEN"].ToString() : null;
                        model.tbi_nuocsx_ten = ds.Rows[i]["TBI_NUOCSX_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_NUOCSX_TEN"].ToString() : null;
                        model.tbi_kho_ten = ds.Rows[i]["TBI_KHO_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_KHO_TEN"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["TBI_TRANGTHAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_TRANGTHAI_TEN"].ToString() : null;
                        model.dm_donvitinh_ten = ds.Rows[i]["DM_DONVITINH_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVITINH_TEN"].ToString() : null;
                        model.dm_donvi_ten = ds.Rows[i]["DM_DONVI_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_TEN"].ToString() : null;
                        model.dm_phongban_ten = ds.Rows[i]["DM_PHONGBAN_TEN"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_TEN"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.qr_code = ds.Rows[i]["QR_CODE"] != DBNull.Value ? ds.Rows[i]["QR_CODE"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["NGAY_VANHANH"] != DBNull.Value ? ds.Rows[i]["NGAY_VANHANH"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["NGAY_TAO_HT"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO_HT"].ToString() : null;
                        model.ngay_duyet = ds.Rows[i]["NGAY_DUYET"] != DBNull.Value ? ds.Rows[i]["NGAY_DUYET"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        model.nguoi_duyet = ds.Rows[i]["NGUOI_DUYET"] != DBNull.Value ? ds.Rows[i]["NGUOI_DUYET"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.thong_tin_khac = ds.Rows[i]["THONG_TIN_KHAC"] != DBNull.Value ? ds.Rows[i]["THONG_TIN_KHAC"].ToString() : null;
                        model.nguoi_sd = ds.Rows[i]["NGUOI_SD"] != DBNull.Value ? ds.Rows[i]["NGUOI_SD"].ToString() : null;
                        model.ten_nguoi_sd = ds.Rows[i]["ten_nguoi_sd"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_sd"].ToString() : null;
                        model.ma_nhom_tbi = ds.Rows[i]["MA_NHOM_TBI"] != DBNull.Value ? ds.Rows[i]["MA_NHOM_TBI"].ToString() : null;
                        model.can_chon_nsd = ds.Rows[i]["can_chon_nsd"] != DBNull.Value ? ds.Rows[i]["can_chon_nsd"].ToString() : null;
                        model.co_thongtin_ct = ds.Rows[i]["co_thongtin_ct"] != DBNull.Value ? ds.Rows[i]["co_thongtin_ct"].ToString() : null;
                        model.ct_cauhinh_json = ds.Rows[i]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[i]["ct_cauhinh_json"].ToString() : null;
                        model.thongtin_chitiet_json = ds.Rows[i]["thongtin_chitiet_json"] != DBNull.Value ? ds.Rows[i]["thongtin_chitiet_json"].ToString() : null;
                        model.last_bban_id = ds.Rows[i]["last_bban_id"] != DBNull.Value ? ds.Rows[i]["last_bban_id"].ToString() : null;

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

        //Lấy danh sách thiết bị đo xa hoặc CNTT ở kho P4 để thu hồi về Cty hoặc xác nhận cũ hỏng để thanh lý:
        public List<QLTB_DM_THIETBI_Model> get_TBI_CNTT_TRONGKHO_C4(
           int pageIndex, int pageSize, string id, int bban_id, string ma_nhom_thietbi, string tbi_dm_chungloai_id, string tbi_kho_id,
           string ma_thietbi, string no_thietbi, string ten_thietbi, string ma_dviqly, string phongban_id, string loai_nghiepvu, string nguoi_sd, out int totalItems
)
        {
            totalItems = 0;
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.get_TBI_CNTT_TRONGKHO_C4",
                    "p_page_index", "p_page_size", "p_ID", "p_BBAN_ID", "p_MA_NHOM_TBI", "p_TBI_DM_CHUNGLOAI_ID", "p_TBI_KHO_ID",
                    "p_MA_THIETBI", "p_NO_THIETBI", "p_TEN_THIET", "p_MA_DVIQLY", "p_PHONGBAN_ID", "p_LOAI_NGHIEPVU", "p_NGUOI_SD",
                     pageIndex, pageSize, id, bban_id, ma_nhom_thietbi, tbi_dm_chungloai_id, tbi_kho_id,
                     ma_thietbi, no_thietbi, ten_thietbi, ma_dviqly, phongban_id, loai_nghiepvu, nguoi_sd);

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_DM_THIETBI_Model model = new QLTB_DM_THIETBI_Model();
                        model.id = ds.Rows[i]["ID"] != DBNull.Value ? ds.Rows[i]["ID"].ToString() : null;
                        model.ma_dviqly = ds.Rows[i]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[i]["MA_DVIQLY"].ToString() : null;
                        model.tbi_dm_chungloai_id = ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_CHUNGLOAI_ID"].ToString()) : null;
                        model.tbi_dm_hangsx_id = ds.Rows[i]["TBI_DM_HANGSX_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_DM_HANGSX_ID"].ToString()) : null;
                        model.tbi_nuocsx_id = ds.Rows[i]["TBI_NUOCSX_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_NUOCSX_ID"].ToString()) : null;
                        model.tbi_kho_id = ds.Rows[i]["TBI_KHO_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_KHO_ID"].ToString()) : null;
                        model.tbi_trangthai_id = ds.Rows[i]["TBI_TRANGTHAI_ID"] != DBNull.Value ? int.Parse(ds.Rows[i]["TBI_TRANGTHAI_ID"].ToString()) : null;
                        model.dm_donvitinh_id = ds.Rows[i]["DM_DONVITINH_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVITINH_ID"].ToString() : null;
                        model.dm_donvi_id = ds.Rows[i]["DM_DONVI_ID"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_ID"].ToString() : null;
                        model.dm_phongban_id = ds.Rows[i]["DM_PHONGBAN_ID"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_ID"].ToString() : null;
                        model.tbi_dm_chungloai_ten = ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_CHUNGLOAI_TEN"].ToString() : null;
                        model.tbi_dm_hangsx_ten = ds.Rows[i]["TBI_DM_HANGSX_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_DM_HANGSX_TEN"].ToString() : null;
                        model.tbi_nuocsx_ten = ds.Rows[i]["TBI_NUOCSX_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_NUOCSX_TEN"].ToString() : null;
                        model.tbi_kho_ten = ds.Rows[i]["TBI_KHO_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_KHO_TEN"].ToString() : null;
                        model.tbi_trangthai_ten = ds.Rows[i]["TBI_TRANGTHAI_TEN"] != DBNull.Value ? ds.Rows[i]["TBI_TRANGTHAI_TEN"].ToString() : null;
                        model.dm_donvitinh_ten = ds.Rows[i]["DM_DONVITINH_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVITINH_TEN"].ToString() : null;
                        model.dm_donvi_ten = ds.Rows[i]["DM_DONVI_TEN"] != DBNull.Value ? ds.Rows[i]["DM_DONVI_TEN"].ToString() : null;
                        model.dm_phongban_ten = ds.Rows[i]["DM_PHONGBAN_TEN"] != DBNull.Value ? ds.Rows[i]["DM_PHONGBAN_TEN"].ToString() : null;
                        model.ma_thietbi = ds.Rows[i]["MA_THIETBI"] != DBNull.Value ? ds.Rows[i]["MA_THIETBI"].ToString() : null;
                        model.qr_code = ds.Rows[i]["QR_CODE"] != DBNull.Value ? ds.Rows[i]["QR_CODE"].ToString() : null;
                        model.no_thietbi = ds.Rows[i]["NO_THIETBI"] != DBNull.Value ? ds.Rows[i]["NO_THIETBI"].ToString() : null;
                        model.ten_thietbi = ds.Rows[i]["TEN_THIETBI"] != DBNull.Value ? ds.Rows[i]["TEN_THIETBI"].ToString() : null;
                        model.ngay_vanhanh = ds.Rows[i]["NGAY_VANHANH"] != DBNull.Value ? ds.Rows[i]["NGAY_VANHANH"].ToString() : null;
                        model.ngay_tao = ds.Rows[i]["NGAY_TAO_HT"] != DBNull.Value ? ds.Rows[i]["NGAY_TAO_HT"].ToString() : null;
                        model.ngay_duyet = ds.Rows[i]["NGAY_DUYET"] != DBNull.Value ? ds.Rows[i]["NGAY_DUYET"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["NGUOI_TAO"] != DBNull.Value ? ds.Rows[i]["NGUOI_TAO"].ToString() : null;
                        model.nguoi_duyet = ds.Rows[i]["NGUOI_DUYET"] != DBNull.Value ? ds.Rows[i]["NGUOI_DUYET"].ToString() : null;
                        model.duyet_tbi = ds.Rows[i]["DUYET_TBI"] != DBNull.Value ? ds.Rows[i]["DUYET_TBI"].ToString() : null;
                        model.namsx = ds.Rows[i]["NAMSX"] != DBNull.Value ? ds.Rows[i]["NAMSX"].ToString() : null;
                        model.thong_tin_khac = ds.Rows[i]["THONG_TIN_KHAC"] != DBNull.Value ? ds.Rows[i]["THONG_TIN_KHAC"].ToString() : null;
                        model.nguoi_sd = ds.Rows[i]["NGUOI_SD"] != DBNull.Value ? ds.Rows[i]["NGUOI_SD"].ToString() : null;
                        model.ten_nguoi_sd = ds.Rows[i]["ten_nguoi_sd"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_sd"].ToString() : null;
                        model.ma_nhom_tbi = ds.Rows[i]["MA_NHOM_TBI"] != DBNull.Value ? ds.Rows[i]["MA_NHOM_TBI"].ToString() : null;
                        model.can_chon_nsd = ds.Rows[i]["can_chon_nsd"] != DBNull.Value ? ds.Rows[i]["can_chon_nsd"].ToString() : null;
                        model.co_thongtin_ct = ds.Rows[i]["co_thongtin_ct"] != DBNull.Value ? ds.Rows[i]["co_thongtin_ct"].ToString() : null;
                        model.ct_cauhinh_json = ds.Rows[i]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[i]["ct_cauhinh_json"].ToString() : null;
                        model.thongtin_chitiet_json = ds.Rows[i]["thongtin_chitiet_json"] != DBNull.Value ? ds.Rows[i]["thongtin_chitiet_json"].ToString() : null;
                        model.last_bban_id = ds.Rows[i]["last_bban_id"] != DBNull.Value ? ds.Rows[i]["last_bban_id"].ToString() : null;

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

        public string Insert_QLTB_DM_THIETBI(QLTB_DM_THIETBI_Model model)
        {
            try
            {
                string id_new = Guid.NewGuid().ToString();
                if (string.IsNullOrEmpty(model.namsx) || string.IsNullOrEmpty(model.no_thietbi)) {
                    return "Chưa có thông tin NO thiết bị hoặc năm SX";
                }
                //string qr_code = $"{id_new}*{model.namsx}*{model.no_thietbi}";
                string qr_code = id_new;

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.insert_TBI_DM_THIETBI_CNTT", "p_Error",
                    "p_ID", "p_TBI_DM_CHUNGLOAI_ID", "p_TBI_DM_HANGSX_ID","p_TBI_NUOCSX_ID", 
                    "p_TBI_KHO_ID", "p_TBI_TRANGTHAI_ID", "p_DM_DONVITINH_ID", "p_DM_DONVI_ID", "p_DM_PHONGBAN_ID",
                    "p_MA_THIETBI", "p_QR_CODE", "p_NO_THIETBI", "p_TEN_THIETBI", "p_NGAY_VANHANH", "p_NGAY_TAO", "p_NGAY_DUYET",
                    "p_NGUOI_TAO", "p_NGUOI_DUYET", "p_DUYET_TBI", "p_MA_DVIQLY", "p_NAMSX", "p_THONG_TIN_KHAC", "p_NGUOI_SD", "p_THONGTIN_CHITIET_JSON",
                    id_new, model.tbi_dm_chungloai_id, model.tbi_dm_hangsx_id, model.tbi_nuocsx_id, 
                    model.tbi_kho_id, model.tbi_trangthai_id, model.dm_donvitinh_id, model.dm_donvi_id, model.dm_phongban_id,
                    model.ma_thietbi, qr_code, model.no_thietbi, model. ten_thietbi, model.ngay_vanhanh, model.ngay_tao, model.ngay_duyet,
                    model.nguoi_tao, model.nguoi_duyet, model.duyet_tbi, model.ma_dviqly, model.namsx, model.thong_tin_khac, model.nguoi_sd, model.thongtin_chitiet_json
                );
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Update_QLTB_DM_THIETBI(QLTB_DM_THIETBI_Model model)
        {
            try
            {
                //string qr_code = $"{model.id}*{model.namsx}*{model.no_thietbi}";

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.update_TBI_DM_THIETBI_CNTT", "p_Error",
                    "p_ID", "p_TBI_DM_CHUNGLOAI_ID", "p_TBI_DM_HANGSX_ID", "p_TBI_NUOCSX_ID",
                    "p_TBI_KHO_ID", "p_TBI_TRANGTHAI_ID", "p_DM_DONVITINH_ID", "p_DM_DONVI_ID", "p_DM_PHONGBAN_ID",
                    "p_MA_THIETBI", "p_NO_THIETBI", "p_TEN_THIETBI", "p_NGAY_VANHANH", "p_NGUOI_SUA",
                    "p_MA_DVIQLY", "p_NAMSX", "p_THONG_TIN_KHAC", "p_NGUOI_SD", "p_THONGTIN_CHITIET_JSON",
                    model.id, model.tbi_dm_chungloai_id, model.tbi_dm_hangsx_id, model.tbi_nuocsx_id,
                    model.tbi_kho_id, model.tbi_trangthai_id, model.dm_donvitinh_id, model.dm_donvi_id, model.dm_phongban_id,
                    model.ma_thietbi, model.no_thietbi, model.ten_thietbi, model.ngay_vanhanh, model.nguoi_sua,
                    model.ma_dviqly, model.namsx, model.thong_tin_khac, model.nguoi_sd, model.thongtin_chitiet_json
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_THIETBI(string id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.delete_TBI_DM_THIETBI_CNTTT", "p_Error", "p_ID", id
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string Delete_QLTB_DM_THIETBI_MULTI(List<string> ids)
        {
            try
            {
                if (ids == null || ids.Count == 0)
                    return "Danh sách ID rỗng.";

                string idList = string.Join(",", ids); //chuyển sang chuỗi

                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.delete_TBI_CNTT_MULTI", "p_Error",
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

        #region Import thiết bị từ excel
        /// <summary>
        /// Tạo file Excel mẫu nhập thiết bị
        /// </summary>
        /// <returns>Byte array của file Excel để trả về download</returns>
        public byte[] GetThietBiTemplate(string current_madviqly)
        {
            using (var package = new ExcelPackage())
            {
                var generator = new ExcelHelper();
                var _donViArr = don_vi.get_DM_DONVI_ROOT(current_madviqly);
                //var _phongBanArr = phong_ban.get_DM_PHONGBAN_ROOT(current_madviqly);
                var _khoArr = Get_QLTB_DM_KHO(1, -1, null, current_madviqly, null , null, out int totalKho);
                var _chungLoaiArr = Get_QLTB_DM_CHUNGLOAI(1, -1, null, null, null, null, null, null, out int totalChungLoai);
                var _hangSXArr = Get_QLTB_DM_HANGSX(1, -1, null, out int totalHangSX);
                var _nuocSXArr = Get_QLTB_DM_NUOCSX(1, -1, null, null, null, out int totalNuocSX);
                var _dvtArr = Get_QLTB_DM_DONVITINH(1, -1, null, null, null, out int totalDVT);
                return generator.GenerateThietBiTemplate(
                    _donViArr,
                    //_phongBanArr,
                    _khoArr,
                    _chungLoaiArr,
                    _hangSXArr,
                    _nuocSXArr,
                    _dvtArr
                );
            }
        }

        private string ValidateDanhMuc<T>(
            IEnumerable<T> danhMucList,
            string fieldName,
            string inputValue,
            Func<T, string> getId)
        {
            if (string.IsNullOrWhiteSpace(inputValue))
                return null; // Bỏ qua nếu không nhập

            if (danhMucList == null || !danhMucList.Any())
                return $"{fieldName}: Danh mục chưa được tải hoặc rỗng.";

            bool exists = danhMucList.Any(x =>
                string.Equals(getId(x)?.Trim(), inputValue.Trim(), StringComparison.OrdinalIgnoreCase));

            return exists ? null : $"{fieldName} '{inputValue}' không tồn tại trong danh mục.";
        }

        /// <summary>
        /// Import danh sách thiết bị từ file Excel
        /// </summary>
        /// <param name="file">File Excel upload</param>
        /// <param name="ma_dvi">Mã đơn vị hiện tại</param>
        /// <param name="username">Người tạo</param>
        /// <returns>Thông tin tổng hợp: số dòng hợp lệ, danh sách lỗi</returns>
        public async Task<(int TotalValid, List<string> Errors)> ImportExcelThietBi(IFormFile file, string ma_dvi, string username, string duyet_ngay)
        {
            var errors = new List<string>();
            int validRows = 0;

            if (file == null || file.Length == 0)
            {
                errors.Add("Không có file được upload.");
                return (0, errors);
            }

            // Kiểm tra phần mở rộng
            var allowedExtensions = new[] { ".xlsx", ".xls" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                errors.Add("File upload không đúng định dạng. Vui lòng sử dụng file Excel (.xlsx hoặc .xls).");
                return (0, errors);
            }

            // Kiểm tra MIME type (tùy chọn)
            var allowedContentTypes = new[]
            {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel"
            };
            if (!allowedContentTypes.Contains(file.ContentType))
            {
                errors.Add("File upload không đúng định dạng. Vui lòng sử dụng file Excel.");
                return (0, errors);
            }

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var stream = file.OpenReadStream())
            using (var package = new ExcelPackage(stream))
            {
                var ws = package.Workbook.Worksheets["NhapThietBi"];
                if (ws == null)
                {
                    errors.Add("File Excel không đúng định dạng (Không thấy sheet 'NhapThietBi'). Vui lòng sử dụng file mẫu và điền đầy đủ dữ liệu.");
                    return (0, errors);
                }

                // Lấy header từ dòng 2
                var headers = new Dictionary<string, int>();
                int col = 1;
                while (!string.IsNullOrEmpty(ws.Cells[2, col].Text))
                {
                    headers[ws.Cells[2, col].Text.Trim()] = col;
                    col++;
                }

                // Kiểm tra file có đúng định dạng: dòng 2 phải chứa đủ các cột theo dbFields
                var dbFields = new[]
                {
                    "ma_dviqly", "dm_donvi_id", "tbi_kho_id", "ten_thietbi", "ma_thietbi", "no_thietbi",
                    "dm_donvitinh_id", "namsx", "tbi_dm_chungloai_id", "tbi_dm_hangsx_id", "tbi_nuocsx_id",
                    "ngay_vanhanh", "thong_tin_khac"
                };

                // Kiểm tra thiếu cột
                var missingColumns = dbFields.Where(f => !headers.ContainsKey(f)).ToList();
                if (missingColumns.Any())
                {
                    errors.Add("File Excel không đúng định dạng (thiếu/thừa cột dữ liệu). Vui lòng sử dụng file mẫu và điền đầy đủ dữ liệu.");
                    //errors.Add("Thiếu các cột: " + string.Join(", ", missingColumns));
                    return (0, errors); // Dừng import nếu file sai định dạng
                }

                // Các trường bắt buộc nhập
                var requiredFields = new (string Field, string Display)[]
                {
                    ("ma_dviqly", "ĐVQL(mã)"),
                    ("dm_donvi_id", "ĐVQL(ID)"),
                    //("dm_phongban_id", "Phòng ban"),
                    ("tbi_kho_id", "Kho đơn vị"),
                    ("ten_thietbi", "Tên thiết bị"),
                    ("ma_thietbi", "Mã thiết bị"),
                    ("no_thietbi", "Serial"),
                    ("dm_donvitinh_id", "Đơn vị tính"),
                    ("namsx", "Năm sản xuất"),
                    ("tbi_dm_chungloai_id", "Chủng loại thiết bị"),
                    ("tbi_dm_hangsx_id", "Hãng sản xuất"),
                    ("tbi_nuocsx_id", "Nước sản xuất"),
                    ("ngay_vanhanh", "Ngày vận hành")
                };


                var _donViArr = don_vi.get_DM_DONVI_ROOT(ma_dvi);
                //var _phongBanArr = phong_ban.get_DM_PHONGBAN_ROOT(ma_dvi);
                var _khoArr = Get_QLTB_DM_KHO(1, -1, null, ma_dvi, null, null, out _);
                var _chungLoaiArr = Get_QLTB_DM_CHUNGLOAI(1, -1, null, null, null, null, null, null, out _);
                var _hangSXArr = Get_QLTB_DM_HANGSX(1, -1, null, out _);
                var _nuocSXArr = Get_QLTB_DM_NUOCSX(1, -1, null, null, null, out _);
                var _dvtArr = Get_QLTB_DM_DONVITINH(1, -1, null, null, null, out _);


                int rowIndex = 3; // Dữ liệu bắt đầu từ dòng 3
                while (true)
                {
                    var ma_dviqly_value = ws.Cells[rowIndex, 1].Text?.Trim();
                    var ten_thietbi_value = ws.Cells[rowIndex, 4].Text?.Trim();
                    var ma_thietbi_value = ws.Cells[rowIndex, 5].Text?.Trim();

                    // Nếu cả 3 cột dữ liệu đều trống => kết thúc đọc
                    if (string.IsNullOrEmpty(ma_dviqly_value) && string.IsNullOrEmpty(ten_thietbi_value) && string.IsNullOrEmpty(ma_thietbi_value))
                        break;

                    try
                    {
                        bool isAdmin = duyet_ngay == "Y";
                        //bool isAdmin = false; //để cho phép nhập chi tiết
                        int trang_thai_tb = isAdmin ? 1 : 7;
                        string duyet_tbi = isAdmin ? "1" : "0";
                        string nguoi_duyet = isAdmin ? username : "";

                        DateTime? ngayVanHanh = ws.Cells[rowIndex, headers["ngay_vanhanh"]].Value != null
                            ? ws.Cells[rowIndex, headers["ngay_vanhanh"]].GetValue<DateTime?>()
                            : null;

                        string ngayVanHanhStr = ngayVanHanh?.ToString("dd/MM/yyyy");

                        // Kiểm tra các trường bắt buộc nhập
                        var missing = new List<string>();
                        foreach (var (field, display) in requiredFields)
                        {
                            if (!headers.ContainsKey(field))
                            {
                                errors.Add($"Thiếu cột '{field}' trong file Excel.");
                                continue;
                            }

                            var cell = ws.Cells[rowIndex, headers[field]];
                            var val = cell.Value?.ToString()?.Trim();

                            // Nếu là số nhưng để trống hoặc null
                            if (string.IsNullOrEmpty(val))
                                missing.Add(display);

                        }

                        if (missing.Count > 0)
                        {
                            errors.Add($"Dòng {rowIndex}: Thiếu thông tin bắt buộc ({string.Join(", ", missing)})");
                            rowIndex++;
                            continue;
                        }

                        // Lấy giá trị
                        string ma_dviqly = ws.Cells[rowIndex, headers["ma_dviqly"]].Text?.Trim();
                        string dm_donvi_id = ws.Cells[rowIndex, headers["dm_donvi_id"]].Text?.Trim();
                        //string dm_phongban_id = ws.Cells[rowIndex, headers["dm_phongban_id"]].Text?.Trim();
                        int? tbi_kho_id = ws.Cells[rowIndex, headers["tbi_kho_id"]].Value != null
                                ? (int?)ws.Cells[rowIndex, headers["tbi_kho_id"]].GetValue<int>()
                                : null;
                        string dm_donvitinh_id = ws.Cells[rowIndex, headers["dm_donvitinh_id"]].Text?.Trim();
                        int? tbi_dm_chungloai_id = ws.Cells[rowIndex, headers["tbi_dm_chungloai_id"]].Value != null
                                ? (int?)ws.Cells[rowIndex, headers["tbi_dm_chungloai_id"]].GetValue<int>()
                                : null;
                        int? tbi_dm_hangsx_id = ws.Cells[rowIndex, headers["tbi_dm_hangsx_id"]].Value != null
                                ? (int?)ws.Cells[rowIndex, headers["tbi_dm_hangsx_id"]].GetValue<int>()
                                : null;
                        int? tbi_nuocsx_id = ws.Cells[rowIndex, headers["tbi_nuocsx_id"]].Value != null
                                ? (int?)ws.Cells[rowIndex, headers["tbi_nuocsx_id"]].GetValue<int>()
                                : null;

                        // Kiểm tra tồn tại danh mục
                        var danhMucErrors = new List<string>();

                        // Kiểm tra từng danh mục xem dữ liệu co thuộc danh mục không, ép kiểu về string:
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_donViArr, "ĐVQL(Mã)", ma_dviqly?.ToString(),x => x.ma_dviqly.ToString()));
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_donViArr, "ĐVQL(ID)", dm_donvi_id?.ToString(),x => x.id.ToString()));
                        //danhMucErrors.AddIfNotNull(ValidateDanhMuc(_phongBanArr, "Phòng ban", dm_phongban_id?.ToString(),x => x.id.ToString()));
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_khoArr, "Kho đơn vị", tbi_kho_id?.ToString(),x => x.id.ToString()));
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_dvtArr, "Đơn vị tính", dm_donvitinh_id?.ToString(),x => x.id.ToString()));
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_chungLoaiArr, "Chủng loại", tbi_dm_chungloai_id?.ToString(),x => x.id.ToString()));
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_hangSXArr, "Hãng SX", tbi_dm_hangsx_id?.ToString(),x => x.id.ToString()));
                        danhMucErrors.AddIfNotNull(ValidateDanhMuc(_nuocSXArr, "Nước SX", tbi_nuocsx_id?.ToString(),x => x.id.ToString()));

                        if (danhMucErrors.Any())
                        {
                            errors.Add($"Dòng {rowIndex}: {string.Join("; ", danhMucErrors)}");
                            rowIndex++;
                            continue;
                        }

                        // Tạo model dữ liệu
                        var model = new QLTB_DM_THIETBI_Model
                        {
                            ma_dviqly = ma_dviqly,
                            dm_donvi_id = dm_donvi_id,
                            //dm_phongban_id = dm_phongban_id,
                            dm_phongban_id = null,
                            tbi_kho_id = tbi_kho_id,
                            ten_thietbi = ws.Cells[rowIndex, headers["ten_thietbi"]].Text?.Trim(),
                            ma_thietbi = ws.Cells[rowIndex, headers["ma_thietbi"]].Text?.Trim(),
                            no_thietbi = ws.Cells[rowIndex, headers["no_thietbi"]].Text?.Trim(),
                            dm_donvitinh_id = dm_donvitinh_id,
                            namsx = ws.Cells[rowIndex, headers["namsx"]].Text?.Trim(),
                            tbi_dm_chungloai_id = tbi_dm_chungloai_id,
                            tbi_dm_hangsx_id = tbi_dm_hangsx_id,
                            tbi_nuocsx_id = tbi_nuocsx_id,
                            ngay_vanhanh = ngayVanHanhStr,
                            //nguoi_sd = ws.Cells[rowIndex, headers["nguoi_sd"]].Text?.Trim(),
                            nguoi_sd = null,
                            thong_tin_khac = ws.Cells[rowIndex, headers["thong_tin_khac"]].Text?.Trim(),
                            nguoi_tao = username,
                            tbi_trangthai_id = trang_thai_tb,
                            duyet_tbi = duyet_tbi,
                            nguoi_duyet = nguoi_duyet,
                            thongtin_chitiet_json = "" // Nhập Excel thì để trống
                        };

                        // Thực hiện insert
                        string result = await Task.Run(() => Insert_QLTB_DM_THIETBI(model));

                        if (!string.IsNullOrEmpty(result))
                            errors.Add($"Dòng {rowIndex}: {result}");
                        else
                            validRows++;
                    }
                    catch (Exception ex)
                    {
                        errors.Add($"Dòng {rowIndex}: Lỗi {ex}");
                    }

                    rowIndex++;
                }
            }

            return (validRows, errors);
        }


        public async Task<(int TotalValid, byte[] ErrorFile)> ImportExcelThietBi_WithErrorFile(
            IFormFile file,
            string ma_dvi,
            string username,
            string duyet_ngay
        )
        {
            int validRows = 0;
            bool hasError = false;

            if (file == null || file.Length == 0)
                throw new Exception("Không có file được upload.");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (ext != ".xlsx" && ext != ".xls")
                throw new Exception("File upload không đúng định dạng Excel.");

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var stream = file.OpenReadStream();
            using var package = new ExcelPackage(stream);

            var ws = package.Workbook.Worksheets["NhapThietBi"];
            if (ws == null)
                throw new Exception("Không tìm thấy sheet 'NhapThietBi'.");

            /* ================= HEADER ================= */
            var headers = new Dictionary<string, int>();
            int col = 1;
            while (!string.IsNullOrEmpty(ws.Cells[2, col].Text))
            {
                headers[ws.Cells[2, col].Text.Trim()] = col;
                col++;
            }

            int errorCol = headers.Count + 1;
            ws.Cells[2, errorCol].Value = "GHI_CHU_LOI";
            ws.Column(errorCol).Width = 50;

            /* ================= VALIDATE TEMPLATE ================= */
            var dbFields = new[]
            {
                "ma_dviqly","dm_donvi_id","tbi_kho_id","ten_thietbi","ma_thietbi","no_thietbi",
                "dm_donvitinh_id","namsx","tbi_dm_chungloai_id","tbi_dm_hangsx_id","tbi_nuocsx_id",
                "ngay_vanhanh","thong_tin_khac"
            };

            var missingColumns = dbFields.Where(f => !headers.ContainsKey(f)).ToList();
            if (missingColumns.Any())
                throw new Exception("File Excel không đúng template. Thiếu cột: " + string.Join(", ", missingColumns));

            /* ================= LOAD DANH MỤC ================= */
            var _donViArr = don_vi.get_DM_DONVI_ROOT(ma_dvi);
            var _khoArr = Get_QLTB_DM_KHO(1, -1, null, ma_dvi, null, null, out _);
            var _chungLoaiArr = Get_QLTB_DM_CHUNGLOAI(1, -1, null, null, null, null, null, null, out _);
            var _hangSXArr = Get_QLTB_DM_HANGSX(1, -1, null, out _);
            var _nuocSXArr = Get_QLTB_DM_NUOCSX(1, -1, null, null, null, out _);
            var _dvtArr = Get_QLTB_DM_DONVITINH(1, -1, null, null, null, out _);

            /* ================= LOOP DATA ================= */
            int rowIndex = 3;
            var rowsToRemove = new List<int>();

            while (true)
            {
                // Kết thúc khi dòng trống
                if (string.IsNullOrEmpty(ws.Cells[rowIndex, 1].Text)
                    && string.IsNullOrEmpty(ws.Cells[rowIndex, 4].Text)
                    && string.IsNullOrEmpty(ws.Cells[rowIndex, 5].Text))
                    break;

                var rowErrors = new List<string>();

                try
                {
                    bool isAdmin = duyet_ngay == "Y";
                    DateTime? ngayVanHanh = ws.Cells[rowIndex, headers["ngay_vanhanh"]].Value != null
                        ? ws.Cells[rowIndex, headers["ngay_vanhanh"]].GetValue<DateTime?>()
                        : null;

                    /* ===== BẮT BUỘC ===== */
                    var required = new (string Field, string Name)[]
                    {
                        ("ma_dviqly","Mã ĐVQL"),
                        ("dm_donvi_id","ĐVQL ID"),
                        ("tbi_kho_id","Kho"),
                        ("ten_thietbi","Tên TB"),
                        ("ma_thietbi","Mã TB"),
                        ("no_thietbi","Serial"),
                        ("dm_donvitinh_id","ĐVT"),
                        ("namsx","Năm SX"),
                        ("tbi_dm_chungloai_id","Chủng loại"),
                        ("tbi_dm_hangsx_id","Hãng SX"),
                        ("tbi_nuocsx_id","Nước SX"),
                        ("ngay_vanhanh","Ngày vận hành")
                    };

                    foreach (var r in required)
                    {
                        var cell = ws.Cells[rowIndex, headers[r.Field]];

                        // Reset màu trước khi check
                        //cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        //cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.White);

                        if (string.IsNullOrEmpty(cell.Text))
                        {
                            rowErrors.Add($"Thiếu {r.Name}");
                            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Red);
                        }
                    }

                    /* ===== DANH MỤC ===== */
                    var danhMucChecks = new (string Field, string Name, IEnumerable<object> Data, Func<dynamic, string> Key)[]
                    {
                        ("ma_dviqly","Mã ĐVQL(ma_dviqly)", _donViArr, x => x.ma_dviqly.ToString()),
                        ("dm_donvi_id","ĐVQL ID(dm_donvi_id)", _donViArr, x => x.id.ToString()),
                        ("tbi_kho_id","Kho đơn vị(tbi_kho_id)", _khoArr, x => x.id.ToString()),
                        ("dm_donvitinh_id","Đơn vị tính(dm_donvitinh_id)", _dvtArr, x => x.id.ToString()),
                        ("tbi_dm_chungloai_id","Chủng loại(tbi_dm_chungloai_id)", _chungLoaiArr, x => x.id.ToString()),
                        ("tbi_dm_hangsx_id","Hãng sản xuất(tbi_dm_hangsx_id)", _hangSXArr, x => x.id.ToString()),
                        ("tbi_nuocsx_id","Nước sản xuất(tbi_dm_nuocsx_id)", _nuocSXArr, x => x.id.ToString())
                    };

                    foreach (var check in danhMucChecks)
                    {
                        var cell = ws.Cells[rowIndex, headers[check.Field]];

                        // Reset màu trước khi check
                        //cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        //cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.White);

                        var val = cell.Text;
                        var err = ValidateDanhMuc(check.Data, check.Name, val, check.Key);
                        if (!string.IsNullOrEmpty(err))
                        {
                            rowErrors.Add(err);
                            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Red);
                        }
                    }

                    /* ===== INSERT MODEL ===== */
                    if (!rowErrors.Any())
                    {
                        var model = new QLTB_DM_THIETBI_Model
                        {
                            ma_dviqly = ws.Cells[rowIndex, headers["ma_dviqly"]].Text,
                            dm_donvi_id = ws.Cells[rowIndex, headers["dm_donvi_id"]].Text,
                            tbi_kho_id = ws.Cells[rowIndex, headers["tbi_kho_id"]].GetValue<int?>(),
                            ten_thietbi = ws.Cells[rowIndex, headers["ten_thietbi"]].Text,
                            ma_thietbi = ws.Cells[rowIndex, headers["ma_thietbi"]].Text,
                            no_thietbi = ws.Cells[rowIndex, headers["no_thietbi"]].Text,
                            dm_donvitinh_id = ws.Cells[rowIndex, headers["dm_donvitinh_id"]].Text,
                            namsx = ws.Cells[rowIndex, headers["namsx"]].Text,
                            tbi_dm_chungloai_id = ws.Cells[rowIndex, headers["tbi_dm_chungloai_id"]].GetValue<int?>(),
                            tbi_dm_hangsx_id = ws.Cells[rowIndex, headers["tbi_dm_hangsx_id"]].GetValue<int?>(),
                            tbi_nuocsx_id = ws.Cells[rowIndex, headers["tbi_nuocsx_id"]].GetValue<int?>(),
                            ngay_vanhanh = ngayVanHanh?.ToString("dd/MM/yyyy"),
                            nguoi_tao = username,
                            tbi_trangthai_id = isAdmin ? 1 : 7,
                            duyet_tbi = isAdmin ? "1" : "0",
                            nguoi_duyet = isAdmin ? username : ""
                        };

                        var insertResult = await Task.Run(() => Insert_QLTB_DM_THIETBI(model));
                        if (!string.IsNullOrEmpty(insertResult))
                        {
                            rowErrors.Add(insertResult);
                            ws.Cells[rowIndex, errorCol].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            ws.Cells[rowIndex, errorCol].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Red);
                        }
                        else
                        {
                            // Insert thành công -> đánh dấu xoá dòng
                            rowsToRemove.Add(rowIndex);
                            validRows++;
                        }
                    }
                }
                catch (Exception ex)
                {
                    rowErrors.Add(ex.Message);
                    ws.Cells[rowIndex, errorCol].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    ws.Cells[rowIndex, errorCol].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Red);
                }

                if (rowErrors.Any())
                {
                    hasError = true;
                    ws.Cells[rowIndex, errorCol].Value = string.Join("; ", rowErrors);
                }

                rowIndex++;
            }

            /* ===== XOÁ CÁC DÒNG THÀNH CÔNG ===== */
            if (rowsToRemove.Any())
            {
                foreach (var r in rowsToRemove.OrderByDescending(i => i))
                {
                    ws.DeleteRow(r);
                }
            }

            /* ===== RETURN ===== */
            return (validRows, hasError ? package.GetAsByteArray() : null);
        }

        #endregion
    }
}
