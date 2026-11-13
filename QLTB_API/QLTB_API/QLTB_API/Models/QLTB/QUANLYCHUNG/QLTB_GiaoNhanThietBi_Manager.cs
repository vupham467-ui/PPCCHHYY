using APIPCHY.Helpers;
using System.Collections.Generic;
using System;
using System.Data;
using QLTB_API.Models.QLTB.DANH_MUC;
using System.Linq;
using Newtonsoft.Json;


namespace QLTB_API.Models.QLTB.QUANLYCHUNG
{
    public class QLTB_GiaoNhanThietBi_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        public List<QLTB_GiaoNhanThietBi_Model> GET_BBGIAONHAN_TB_CNTT(
            int pageIndex, int pageSize, string id, string loai_bban, string loai_nghiepvu, string ma_dvi_giao, string ma_dvi_nhan, string phongban_giao_id, string phongban_nhan_id,
            string nguoi_giao, string nguoi_nhan, int? trang_thai, string tu_ngay, string den_ngay, string user, out int totalItems
)
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BBGIAONHAN_TB_CNTT_V2",
                    "p_page_index", "p_page_size", "p_ID", "p_LOAI_BBAN", "p_LOAI_NGHIEPVU", "p_MA_DVI_GIAO", "p_MA_DVI_NHAN", "p_PHONGBAN_GIAO_ID", "p_PHONGBAN_NHAN_ID",
                    "p_NGUOI_GIAO", "p_NGUOI_NHAN", "p_TRANG_THAI", "p_TU_NGAY", "p_DEN_NGAY", "p_USER",
                     pageIndex, pageSize, id, loai_bban, loai_nghiepvu, ma_dvi_giao, ma_dvi_nhan, phongban_giao_id, phongban_nhan_id,
                     nguoi_giao, nguoi_nhan, trang_thai, tu_ngay, den_ngay, user
                );

                List<QLTB_GiaoNhanThietBi_Model> list = new List<QLTB_GiaoNhanThietBi_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_GiaoNhanThietBi_Model model = new QLTB_GiaoNhanThietBi_Model();
                        model.id = ds.Rows[i]["id"] != DBNull.Value ? ds.Rows[i]["id"].ToString() : null;
                        model.ma_dvi_giao = ds.Rows[i]["ma_dvi_giao"] != DBNull.Value ? ds.Rows[i]["ma_dvi_giao"].ToString() : null;
                        model.ten_dvi_giao = ds.Rows[i]["ten_dvi_giao"] != DBNull.Value ? ds.Rows[i]["ten_dvi_giao"].ToString() : null;
                        model.ma_dvi_nhan = ds.Rows[i]["ma_dvi_nhan"] != DBNull.Value ? ds.Rows[i]["ma_dvi_nhan"].ToString() : null;
                        model.ten_dvi_nhan = ds.Rows[i]["ten_dvi_nhan"] != DBNull.Value ? ds.Rows[i]["ten_dvi_nhan"].ToString() : null;
                        model.ten_dvi_nhan_hienthi = ds.Rows[i]["ten_dvi_nhan_hienthi"] != DBNull.Value ? ds.Rows[i]["ten_dvi_nhan_hienthi"].ToString() : null;
                        model.phongban_giao_id = ds.Rows[i]["phongban_giao_id"] != DBNull.Value ? ds.Rows[i]["phongban_giao_id"].ToString() : null;
                        model.ten_phongban_giao = ds.Rows[i]["ten_phongban_giao"] != DBNull.Value ? ds.Rows[i]["ten_phongban_giao"].ToString() : null;
                        model.phongban_nhan_id = ds.Rows[i]["phongban_nhan_id"] != DBNull.Value ? ds.Rows[i]["phongban_nhan_id"].ToString() : null;
                        model.ten_phongban_nhan = ds.Rows[i]["ten_phongban_nhan"] != DBNull.Value ? ds.Rows[i]["ten_phongban_nhan"].ToString() : null;
                        model.nguoi_giao = ds.Rows[i]["nguoi_giao"] != DBNull.Value ? ds.Rows[i]["nguoi_giao"].ToString() : null;
                        model.nguoi_nhan = ds.Rows[i]["nguoi_nhan"] != DBNull.Value ? ds.Rows[i]["nguoi_nhan"].ToString() : null;
                        model.ten_nguoi_giao = ds.Rows[i]["ten_nguoi_giao"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_giao"].ToString() : null;
                        model.ten_nguoi_nhan = ds.Rows[i]["ten_nguoi_nhan"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_nhan"].ToString() : null;
                        model.loai_bban = ds.Rows[i]["loai_bban"] != DBNull.Value ? int.Parse(ds.Rows[i]["loai_bban"].ToString()) : null;
                        model.loai_nghiepvu = ds.Rows[i]["loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["loai_nghiepvu"].ToString() : null;
                        model.kho_nhan_id = ds.Rows[i]["kho_nhan_id"] != DBNull.Value ? ds.Rows[i]["kho_nhan_id"].ToString() : null;
                        model.ngay_giao = ds.Rows[i]["ngay_giao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_giao"]) : (DateTime?)null;
                        model.ngay_nhan = ds.Rows[i]["ngay_nhan"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_nhan"]) : (DateTime?)null;
                        model.ngay_tao = ds.Rows[i]["ngay_tao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_tao"]) : (DateTime?)null;
                        model.ngay_lapphieu = ds.Rows[i]["ngay_lapphieu"] != DBNull.Value ? ds.Rows[i]["ngay_lapphieu"].ToString() : null;
                        model.so_luong = ds.Rows[i]["so_luong"] != DBNull.Value ? int.Parse(ds.Rows[i]["so_luong"].ToString()) : null;
                        model.noi_dung = ds.Rows[i]["noi_dung"] != DBNull.Value ? ds.Rows[i]["noi_dung"].ToString() : null;
                        model.trang_thai = ds.Rows[i]["trang_thai"] != DBNull.Value ? int.Parse(ds.Rows[i]["trang_thai"].ToString()) : null;
                        model.url_vanban = ds.Rows[i]["url_vanban"] != DBNull.Value ? ds.Rows[i]["url_vanban"].ToString() : null;
                        model.ngay_sua = ds.Rows[i]["ngay_sua"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_sua"]) : (DateTime?)null;
                        model.nguoi_huy = ds.Rows[i]["nguoi_huy"] != DBNull.Value ? ds.Rows[i]["nguoi_huy"].ToString() : null;
                        model.ngay_huy = ds.Rows[i]["ngay_huy"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_huy"]) : (DateTime?)null;


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

        public QLTB_GiaoNhanThietBi_Model GET_BBGIAONHAN_TB_CNTT_BY_ID(string id)
        {
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BBGIAONHAN_TB_CNTT_BY_ID", "p_ID", id);
                if (ds.Rows.Count == 0)
                {
                    return null; // Không có dữ liệu
                }
                QLTB_GiaoNhanThietBi_Model model = new QLTB_GiaoNhanThietBi_Model();
                model.id = ds.Rows[0]["id"] != DBNull.Value ? ds.Rows[0]["id"].ToString() : null;
                model.ma_dvi_giao = ds.Rows[0]["ma_dvi_giao"] != DBNull.Value ? ds.Rows[0]["ma_dvi_giao"].ToString() : null;
                model.ten_dvi_giao = ds.Rows[0]["ten_dvi_giao"] != DBNull.Value ? ds.Rows[0]["ten_dvi_giao"].ToString() : null;
                model.ten_dvi_giao_uc = ds.Rows[0]["ten_dvi_giao_uc"] != DBNull.Value ? ds.Rows[0]["ten_dvi_giao_uc"].ToString() : null;
                model.ma_dvi_nhan = ds.Rows[0]["ma_dvi_nhan"] != DBNull.Value ? ds.Rows[0]["ma_dvi_nhan"].ToString() : null;
                model.ten_dvi_nhan = ds.Rows[0]["ten_dvi_nhan"] != DBNull.Value ? ds.Rows[0]["ten_dvi_nhan"].ToString() : null;
                model.ten_dvi_nhan_hienthi = ds.Rows[0]["ten_dvi_nhan_hienthi"] != DBNull.Value ? ds.Rows[0]["ten_dvi_nhan_hienthi"].ToString() : null;
                model.phongban_giao_id = ds.Rows[0]["phongban_giao_id"] != DBNull.Value ? ds.Rows[0]["phongban_giao_id"].ToString() : null;
                model.ten_phongban_giao = ds.Rows[0]["ten_phongban_giao"] != DBNull.Value ? ds.Rows[0]["ten_phongban_giao"].ToString() : null;
                model.ten_phongban_giao_uc = ds.Rows[0]["ten_phongban_giao_uc"] != DBNull.Value ? ds.Rows[0]["ten_phongban_giao_uc"].ToString() : null;
                model.phongban_nhan_id = ds.Rows[0]["phongban_nhan_id"] != DBNull.Value ? ds.Rows[0]["phongban_nhan_id"].ToString() : null;
                model.ten_phongban_nhan = ds.Rows[0]["ten_phongban_nhan"] != DBNull.Value ? ds.Rows[0]["ten_phongban_nhan"].ToString() : null;
                model.nguoi_giao = ds.Rows[0]["nguoi_giao"] != DBNull.Value ? ds.Rows[0]["nguoi_giao"].ToString() : null;
                model.nguoi_nhan = ds.Rows[0]["nguoi_nhan"] != DBNull.Value ? ds.Rows[0]["nguoi_nhan"].ToString() : null;
                model.chuc_vu_giao = ds.Rows[0]["chuc_vu_giao"] != DBNull.Value ? ds.Rows[0]["chuc_vu_giao"].ToString() : null;
                model.chuc_vu_nhan = ds.Rows[0]["chuc_vu_nhan"] != DBNull.Value ? ds.Rows[0]["chuc_vu_nhan"].ToString() : null;
                model.ten_nguoi_giao = ds.Rows[0]["ten_nguoi_giao"] != DBNull.Value ? ds.Rows[0]["ten_nguoi_giao"].ToString() : null;
                model.ten_nguoi_nhan = ds.Rows[0]["ten_nguoi_nhan"] != DBNull.Value ? ds.Rows[0]["ten_nguoi_nhan"].ToString() : null;
                model.loai_bban = ds.Rows[0]["loai_bban"] != DBNull.Value ? int.Parse(ds.Rows[0]["loai_bban"].ToString()) : null;
                model.loai_nghiepvu = ds.Rows[0]["loai_nghiepvu"] != DBNull.Value ? ds.Rows[0]["loai_nghiepvu"].ToString() : null;
                model.kho_nhan_id = ds.Rows[0]["kho_nhan_id"] != DBNull.Value ? ds.Rows[0]["kho_nhan_id"].ToString() : null;
                model.ngay_giao = ds.Rows[0]["ngay_giao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["ngay_giao"]) : (DateTime?)null;
                model.ngay_nhan = ds.Rows[0]["ngay_nhan"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["ngay_nhan"]) : (DateTime?)null;
                model.ngay_tao = ds.Rows[0]["ngay_tao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["ngay_tao"]) : (DateTime?)null;
                model.ngay_lapphieu = ds.Rows[0]["ngay_lapphieu"] != DBNull.Value ? ds.Rows[0]["ngay_lapphieu"].ToString() : null;
                model.ngay_lap = ds.Rows[0]["ngay_lap"] != DBNull.Value ? ds.Rows[0]["ngay_lap"].ToString() : null;
                model.so_luong = ds.Rows[0]["so_luong"] != DBNull.Value ? int.Parse(ds.Rows[0]["so_luong"].ToString()) : null;
                model.noi_dung = ds.Rows[0]["noi_dung"] != DBNull.Value ? ds.Rows[0]["noi_dung"].ToString() : null;
                model.trang_thai = ds.Rows[0]["trang_thai"] != DBNull.Value ? int.Parse(ds.Rows[0]["trang_thai"].ToString()) : null;
                model.url_vanban = ds.Rows[0]["url_vanban"] != DBNull.Value ? ds.Rows[0]["url_vanban"].ToString() : null;
                model.ngay_sua = ds.Rows[0]["ngay_sua"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["ngay_sua"]) : (DateTime?)null;
                model.nguoi_huy = ds.Rows[0]["nguoi_huy"] != DBNull.Value ? ds.Rows[0]["nguoi_huy"].ToString() : null;
                model.ngay_huy = ds.Rows[0]["ngay_huy"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["ngay_huy"]) : (DateTime?)null;


                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<QLTB_DM_THIETBI_Model> GET_TBI_BY_BBAN_ID(string bban_id)
        {

            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_TBI_BY_BBAN_ID", "p_BBAN_ID", bban_id);

                List<QLTB_DM_THIETBI_Model> list = new List<QLTB_DM_THIETBI_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
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
                        model.co_thongtin_ct = ds.Rows[i]["co_thongtin_ct"] != DBNull.Value ? ds.Rows[i]["co_thongtin_ct"].ToString() : null;
                        model.ct_cauhinh_json = ds.Rows[i]["ct_cauhinh_json"] != DBNull.Value ? ds.Rows[i]["ct_cauhinh_json"].ToString() : null;
                        model.thongtin_chitiet_json = ds.Rows[i]["thongtin_chitiet_json"] != DBNull.Value ? ds.Rows[i]["thongtin_chitiet_json"].ToString() : null;


                        model.tinh_trang_tb = ds.Rows[i]["tinh_trang_tb"] != DBNull.Value ? ds.Rows[i]["tinh_trang_tb"].ToString() : null;
                        model.nguyen_nhan = ds.Rows[i]["nguyen_nhan"] != DBNull.Value ? ds.Rows[i]["nguyen_nhan"].ToString() : null;

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

        public string INSERT_BBAN_GIAONHAN_CNTT(GiaoNhanThietBiRequest request)
        {
            try
            {
                if (request.ds_thietbi == null || request.ds_thietbi.Count == 0)
                    return "Danh sách thiết bị rỗng.";

                // Chuyển ds thiết bị thành JSON
                string jsonDevices = JsonConvert.SerializeObject(request.ds_thietbi);

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.INSERT_BBAN_GIAONHAN_CNTT",
                    "p_Error",
                    "P_LOAI_BBAN", "P_MA_DVI_GIAO", "P_LOAI_NGHIEPVU",
                    "P_MA_DVI_NHAN", "P_NGUOI_GIAO", "P_NGUOI_NHAN",
                    "P_PHONGBAN_GIAO_ID", "P_PHONGBAN_NHAN_ID",
                    "P_NGAY_LAPPHIEU", "P_KHO_NHAN_ID",
                    "P_NOI_DUNG", "p_SO_LUONG", "P_DS_THIETBI_JSON",
                    request.loai_bban, request.loai_nghiepvu, request.ma_dvi_giao,
                    request.ma_dvi_nhan, request.nguoi_giao, request.nguoi_nhan,
                    request.phongban_giao_id, request.phongban_nhan_id,
                    request.ngay_lapphieu, request.kho_nhan_id,
                    request.noi_dung, request.so_luong, jsonDevices
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return ex.Message;
            }
        }

        public string UPDATE_BBAN_GIAONHAN_CNTT(GiaoNhanThietBiRequest request)
        {
            try
            {
                if (request.ds_thietbi == null || request.ds_thietbi.Count == 0)
                    return "Danh sách thiết bị rỗng.";

                // Chuyển ds thiết bị thành JSON
                string jsonDevices = JsonConvert.SerializeObject(request.ds_thietbi);

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.UPDATE_BBAN_GIAONHAN_CNTT", 
                    "p_Error",
                    "P_BBAN_ID", "P_LOAI_BBAN", "P_LOAI_NGHIEPVU", "P_MA_DVI_GIAO", "P_MA_DVI_NHAN", 
                    "P_NGUOI_GIAO", "P_NGUOI_NHAN", "P_PHONGBAN_GIAO_ID", 
                    "P_PHONGBAN_NHAN_ID", "P_KHO_NHAN_ID", "P_NOI_DUNG", "p_SO_LUONG", "P_DS_THIETBI_JSON",
                    request.id, request.loai_bban, request.loai_nghiepvu, request.ma_dvi_giao, request.ma_dvi_nhan, 
                    request.nguoi_giao, request.nguoi_nhan, request.phongban_giao_id, 
                    request.phongban_nhan_id, request.kho_nhan_id, request.noi_dung, request.so_luong, jsonDevices
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }
        public string DELETE_BBAN_GIAONHAN_CNTT(string id)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.DELETE_BBAN_GIAONHAN_CNTT", "p_Error", "p_ID", id
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public class BienBanGiaoNhanData
        {
            public Dictionary<string, object> content { get; set; }
            public List<List<string>> tableData1 { get; set; }
            public List<List<string>> tableData2 { get; set; } //Phụ lục
        }

        private List<List<string>> ConvertDataTableToList(DataTable table, List<string> requiredColumns)
        {
            List<List<string>> list = new List<List<string>>();

            // Thêm tiêu đề (Header)
            List<string> headerRow = new List<string> { "STT" };
            headerRow.AddRange(requiredColumns);
            list.Add(headerRow);

            int index = 1;

            foreach (DataRow row in table.Rows)
            {
                List<string> newRow = new List<string> { index.ToString() }; // STT
                foreach (var column in requiredColumns)
                {
                    newRow.Add(row[column]?.ToString() ?? ""); // Lấy dữ liệu theo từng cột
                }
                list.Add(newRow);
                index++;
            }
            return list;
        }

        private DataTable GroupDeviceDataTable(DataTable source)
        {
            var grouped = source.AsEnumerable()
                .GroupBy(row => (row["ten_thietbi"]?.ToString() ?? "").Trim())
                .Select(g => new
                {
                    ten_thietbi = string.IsNullOrWhiteSpace(g.Key) ? "Nhóm không tên" : g.Key,
                    dm_donvitinh_ten = g.First()["dm_donvitinh_ten"]?.ToString() ?? "",
                    so_luong = g.Count()
                });

            DataTable result = new DataTable();
            result.Columns.Add("ten_thietbi");
            result.Columns.Add("dm_donvitinh_ten");
            result.Columns.Add("so_luong");

            foreach (var item in grouped)
            {
                result.Rows.Add(item.ten_thietbi, item.dm_donvitinh_ten, item.so_luong);
            }

            return result;
        }


        //Lấy dữ liệu chèn vào biên bản
        public BienBanGiaoNhanData get_DATA_BIENBAN_GIAONHAN_DOCX(string id, int loai_bban)
        {
            try
            {
                //Dữ liệu phiếu:
                QLTB_GiaoNhanThietBi_Model dt = GET_BBGIAONHAN_TB_CNTT_BY_ID(id);
                DataTable ds_thietbi = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_TBI_BY_BBAN_ID", "p_BBAN_ID", id);

                if (dt == null)
                {
                    return null; // Không có dữ liệu
                }

                // Lấy thông tin biên bản làm content
                Dictionary<string, object> content = dt.GetType()
                                .GetProperties()
                                .ToDictionary(
                                    p => p.Name,
                                    p => p.GetValue(dt) ?? ""
                                );


                // Danh sách các key cần lấy
                List<string> requiredColumns = new List<string>
                {
                    "ten_thietbi", "dm_donvitinh_ten", "so_luong"
                };
                // Gom nhóm trước khi convert
                DataTable groupedTable = GroupDeviceDataTable(ds_thietbi);

                //Lấy datatable cho table1: Gom nhóm
                List<List<string>> tableData1 = ConvertDataTableToList(groupedTable, requiredColumns);

                // -------------------------
                // Table 2: chi tiết thiết bị
                // -------------------------
                List<List<string>> tableData2 = new List<List<string>>();

                // Header
                if (loai_bban != 3)
                {
                    tableData2.Add(new List<string> { "STT", "Tên thiết bị", "Serial", "Mã thiết bị", "Người SD" });
                } else
                {
                    tableData2.Add(new List<string> { "STT", "Tên thiết bị", "Serial", "Mã thiết bị", "Tình trạng TB", "Nguyên nhân" });

                }
                var sortedRows = ds_thietbi.AsEnumerable()
                    .OrderBy(r => r["ten_thietbi"]?.ToString() ?? "")
                    .ThenBy(r => r["no_thietbi"]?.ToString() ?? r["ma_thietbi"]?.ToString() ?? "");

                int index = 1;
                foreach (DataRow row in sortedRows)
                {
                    var rowData = new List<string>
                    {
                        index.ToString(),
                        row["ten_thietbi"]?.ToString() ?? "",
                        row["no_thietbi"]?.ToString() ?? "",
                        row["ma_thietbi"]?.ToString() ?? "",
                        
                    };

                    //Biên bản kiểm tra thanh lý:
                    if (loai_bban == 3)
                    {
                        rowData.Add(row["tinh_trang_tb"]?.ToString() ?? "");
                        rowData.Add(row["nguyen_nhan"]?.ToString() ?? "");
                    }
                    else
                    {
                        rowData.Add(
                            row["ten_nguoi_sd"]?.ToString()
                            ?? row["nguoi_sd"]?.ToString()
                            ?? ""
                        );
                    }

                    tableData2.Add(rowData);
                    index++;
                }

                return new BienBanGiaoNhanData { content = content, tableData1 = tableData1, tableData2 = tableData2 };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return null;
            }
        }

        public string ky_so_GIAO_NHAN_THIET_BI(int id, int cap_ky)
        {
            try
            {
                string procedureCall = $"PKG_QLTB_THIETBI.ky_so_C{cap_ky}_GIAONHAN_THIETBI";
                string result = helper.ExcuteNonQuery_v2($"{procedureCall}", "p_Error", "p_ID", id);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public string HUY_BBAN_GIAONHAN_CNTT(CancelGiaoNhanRequest req)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.HUY_BBAN_GIAONHAN_CNTT", "p_Error",
                                                    "p_ID", "p_NGUOI_HUY", req.id, req.nguoi_huy);

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }


        public List<QLTB_GiaoNhanThietBi_Model> GET_BBAN_KIEMTRA_TBI_CNTT(
    int pageIndex, int pageSize, string id, string loai_bban, string loai_nghiepvu, string ma_dvi_giao, string ma_dvi_nhan, string phongban_giao_id, string phongban_nhan_id, string nguoi_tao,
    string nguoi_nhan, int? trang_thai, int? trang_thai_thanh_ly, string tu_ngay, string den_ngay, string user, out int totalItems
)
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BBAN_KIEMTRA_TBI_CNTT",
                    "p_page_index", "p_page_size", "p_ID", "p_LOAI_BBAN", "p_LOAI_NGHIEPVU", "p_MA_DVI_GIAO", "p_MA_DVI_NHAN", "p_PHONGBAN_GIAO_ID", "p_PHONGBAN_NHAN_ID", "p_NGUOI_TAO",
                    "p_NGUOI_NHAN", "p_TRANG_THAI", "p_TRANG_THAI_THANH_LY", "p_TU_NGAY", "p_DEN_NGAY", "p_USER",
                     pageIndex, pageSize, id, loai_bban, loai_nghiepvu, ma_dvi_giao, ma_dvi_nhan, phongban_giao_id, phongban_nhan_id,
                     nguoi_tao, nguoi_nhan, trang_thai, trang_thai_thanh_ly, tu_ngay, den_ngay, user
                );

                List<QLTB_GiaoNhanThietBi_Model> list = new List<QLTB_GiaoNhanThietBi_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RecordCount"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_GiaoNhanThietBi_Model model = new QLTB_GiaoNhanThietBi_Model();
                        model.id = ds.Rows[i]["id"] != DBNull.Value ? ds.Rows[i]["id"].ToString() : null;
                        model.ma_dvi_giao = ds.Rows[i]["ma_dvi_giao"] != DBNull.Value ? ds.Rows[i]["ma_dvi_giao"].ToString() : null;
                        model.ten_dvi_giao = ds.Rows[i]["ten_dvi_giao"] != DBNull.Value ? ds.Rows[i]["ten_dvi_giao"].ToString() : null;
                        model.ma_dvi_nhan = ds.Rows[i]["ma_dvi_nhan"] != DBNull.Value ? ds.Rows[i]["ma_dvi_nhan"].ToString() : null;
                        model.ten_dvi_nhan = ds.Rows[i]["ten_dvi_nhan"] != DBNull.Value ? ds.Rows[i]["ten_dvi_nhan"].ToString() : null;
                        model.ten_dvi_nhan_hienthi = ds.Rows[i]["ten_dvi_nhan_hienthi"] != DBNull.Value ? ds.Rows[i]["ten_dvi_nhan_hienthi"].ToString() : null;
                        model.phongban_giao_id = ds.Rows[i]["phongban_giao_id"] != DBNull.Value ? ds.Rows[i]["phongban_giao_id"].ToString() : null;
                        model.ten_phongban_giao = ds.Rows[i]["ten_phongban_giao"] != DBNull.Value ? ds.Rows[i]["ten_phongban_giao"].ToString() : null;
                        model.phongban_nhan_id = ds.Rows[i]["phongban_nhan_id"] != DBNull.Value ? ds.Rows[i]["phongban_nhan_id"].ToString() : null;
                        model.ten_phongban_nhan = ds.Rows[i]["ten_phongban_nhan"] != DBNull.Value ? ds.Rows[i]["ten_phongban_nhan"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["nguoi_tao"] != DBNull.Value ? ds.Rows[i]["nguoi_tao"].ToString() : null;
                        model.nguoi_giao = ds.Rows[i]["nguoi_giao"] != DBNull.Value ? ds.Rows[i]["nguoi_giao"].ToString() : null;
                        model.nguoi_nhan = ds.Rows[i]["nguoi_nhan"] != DBNull.Value ? ds.Rows[i]["nguoi_nhan"].ToString() : null;
                        model.ten_nguoi_tao = ds.Rows[i]["ten_nguoi_tao"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_tao"].ToString() : null;
                        model.ten_nguoi_giao = ds.Rows[i]["ten_nguoi_giao"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_giao"].ToString() : null;
                        model.ten_nguoi_nhan = ds.Rows[i]["ten_nguoi_nhan"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_nhan"].ToString() : null;
                        model.loai_bban = ds.Rows[i]["loai_bban"] != DBNull.Value ? int.Parse(ds.Rows[i]["loai_bban"].ToString()) : null;
                        model.loai_nghiepvu = ds.Rows[i]["loai_nghiepvu"] != DBNull.Value ? ds.Rows[i]["loai_nghiepvu"].ToString() : null;
                        model.kho_nhan_id = ds.Rows[i]["kho_nhan_id"] != DBNull.Value ? ds.Rows[i]["kho_nhan_id"].ToString() : null;
                        model.ngay_giao = ds.Rows[i]["ngay_giao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_giao"]) : (DateTime?)null;
                        model.ngay_nhan = ds.Rows[i]["ngay_nhan"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_nhan"]) : (DateTime?)null;
                        model.ngay_tao = ds.Rows[i]["ngay_tao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_tao"]) : (DateTime?)null;
                        model.ngay_lapphieu = ds.Rows[i]["ngay_lapphieu"] != DBNull.Value ? ds.Rows[i]["ngay_lapphieu"].ToString() : null;
                        model.so_luong = ds.Rows[i]["so_luong"] != DBNull.Value ? int.Parse(ds.Rows[i]["so_luong"].ToString()) : null;
                        model.noi_dung = ds.Rows[i]["noi_dung"] != DBNull.Value ? ds.Rows[i]["noi_dung"].ToString() : null;
                        model.trang_thai = ds.Rows[i]["trang_thai"] != DBNull.Value ? int.Parse(ds.Rows[i]["trang_thai"].ToString()) : null;
                        model.url_vanban = ds.Rows[i]["url_vanban"] != DBNull.Value ? ds.Rows[i]["url_vanban"].ToString() : null;
                        model.ngay_sua = ds.Rows[i]["ngay_sua"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_sua"]) : (DateTime?)null;
                        model.nguoi_huy = ds.Rows[i]["nguoi_huy"] != DBNull.Value ? ds.Rows[i]["nguoi_huy"].ToString() : null;
                        model.ngay_huy = ds.Rows[i]["ngay_huy"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_huy"]) : (DateTime?)null;
                        model.trang_thai_thanh_ly = ds.Rows[i]["trang_thai_thanh_ly"] != DBNull.Value ? int.Parse(ds.Rows[i]["trang_thai_thanh_ly"].ToString()) : null;
                        model.ten_trang_thai_thanh_ly = ds.Rows[i]["ten_trang_thai_thanh_ly"] != DBNull.Value ? ds.Rows[i]["ten_trang_thai_thanh_ly"].ToString() : null;
                        model.nguoi_kiemsoat = ds.Rows[i]["nguoi_kiemsoat"] != DBNull.Value ? ds.Rows[i]["nguoi_kiemsoat"].ToString() : null;
                        model.thoigian_xacnhan = ds.Rows[i]["thoigian_xacnhan"] != DBNull.Value ? ds.Rows[i]["thoigian_xacnhan"].ToString() : null;

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
        public string INSERT_BBAN_KIEMTRA_TBI_CNTT(GiaoNhanThietBiRequest request)
        {
            try
            {
                if (request.ds_thietbi == null || request.ds_thietbi.Count == 0)
                    return "Danh sách thiết bị rỗng.";

                // Chuyển ds thiết bị thành JSON
                string jsonDevices = JsonConvert.SerializeObject(request.ds_thietbi);
                //Console.WriteLine(jsonDevices);

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.INSERT_BBAN_KIEMTRA_TBI_CNTT",
                    "p_Error",
                    "P_LOAI_BBAN", "P_MA_DVI_GIAO", "P_LOAI_NGHIEPVU",
                    "P_MA_DVI_NHAN", "P_NGUOI_TAO", "P_NGUOI_GIAO", "P_NGUOI_NHAN",
                    "P_PHONGBAN_GIAO_ID", "P_PHONGBAN_NHAN_ID",
                    "P_NGAY_LAPPHIEU",
                    "P_NOI_DUNG", "p_SO_LUONG", "P_DS_THIETBI_JSON",
                    request.loai_bban, request.loai_nghiepvu, request.ma_dvi_giao,
                    request.ma_dvi_nhan, request.nguoi_tao, request.nguoi_giao, request.nguoi_nhan,
                    request.phongban_giao_id, request.phongban_nhan_id,
                    request.ngay_lapphieu,
                    request.noi_dung, request.so_luong, jsonDevices
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return ex.Message;
            }
        }

        public string UPDATE_BBAN_KIEMTRA_TBI_CNTT(GiaoNhanThietBiRequest request)
        {
            try
            {
                if (request.ds_thietbi == null || request.ds_thietbi.Count == 0)
                    return "Danh sách thiết bị rỗng.";

                // Chuyển ds thiết bị thành JSON
                string jsonDevices = JsonConvert.SerializeObject(request.ds_thietbi);

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.UPDATE_BBAN_KIEMTRA_TBI_CNTT",
                    "p_Error",
                    "P_BBAN_ID", "P_LOAI_BBAN", "P_LOAI_NGHIEPVU", "P_MA_DVI_GIAO", "P_MA_DVI_NHAN",
                    "P_NGUOI_GIAO", "P_NGUOI_NHAN", "P_PHONGBAN_GIAO_ID",
                    "P_PHONGBAN_NHAN_ID", "P_NOI_DUNG", "p_SO_LUONG", "P_DS_THIETBI_JSON",
                    request.id, request.loai_bban, request.loai_nghiepvu, request.ma_dvi_giao, request.ma_dvi_nhan,
                    request.nguoi_giao, request.nguoi_nhan, request.phongban_giao_id,
                    request.phongban_nhan_id, request.noi_dung, request.so_luong, jsonDevices
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return ex.Message.ToString();
            }
        }

        public QLTB_ThongTinDuyetThanhLy_Model GET_THONGTIN_DUYETTHANHLY(string id)
        {
            try
            {

                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_THONGTIN_DUYETTHANHLY", "p_ID", id);
                if (ds.Rows.Count == 0)
                {
                    return null; // Không có dữ liệu
                }
                QLTB_ThongTinDuyetThanhLy_Model model = new QLTB_ThongTinDuyetThanhLy_Model();
                model.id = ds.Rows[0]["id"] != DBNull.Value ? ds.Rows[0]["id"].ToString() : null;
                model.bienban_id = ds.Rows[0]["bienban_id"] != DBNull.Value ? ds.Rows[0]["bienban_id"].ToString() : null;
                model.nguoi_kiemsoat = ds.Rows[0]["nguoi_kiemsoat"] != DBNull.Value ? ds.Rows[0]["nguoi_kiemsoat"].ToString() : null;
                model.ten_nguoi_kiemsoat = ds.Rows[0]["ten_nguoi_kiemsoat"] != DBNull.Value ? ds.Rows[0]["ten_nguoi_kiemsoat"].ToString() : null;
                model.so_vanban = ds.Rows[0]["so_vanban"] != DBNull.Value ? ds.Rows[0]["so_vanban"].ToString() : null;
                model.file_vanban = ds.Rows[0]["file_vanban"] != DBNull.Value ? ds.Rows[0]["file_vanban"].ToString() : null;
                model.thoigian_xacnhan = ds.Rows[0]["thoigian_xacnhan"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["thoigian_xacnhan"]) : (DateTime?)null;
                model.nguoi_tao = ds.Rows[0]["nguoi_tao"] != DBNull.Value ? ds.Rows[0]["nguoi_tao"].ToString() : null;
                model.ngay_tao = ds.Rows[0]["ngay_tao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[0]["ngay_tao"]) : (DateTime?)null;
                model.trang_thai_thanh_ly = ds.Rows[0]["trang_thai_thanh_ly"] != DBNull.Value ? ds.Rows[0]["trang_thai_thanh_ly"].ToString() : null;


                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string INSERT_THONGTIN_DUYETTHANHLY(QLTB_ThongTinDuyetThanhLy_Model request)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.INSERT_THONGTIN_DUYETTHANHLY",
                    "p_Error",
                    "P_BIENBAN_ID", "P_FILE_VANBAN", "P_SO_VAN_BAN",
                    "P_NGUOI_TAO", "P_NGUOI_KIEMSOAT",
                    request.bienban_id, request.file_vanban, request.so_vanban,
                    request.nguoi_tao, request.nguoi_kiemsoat
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return ex.Message;
            }
        }

        public string UPDATE_THONGTIN_DUYETTHANHLY(QLTB_ThongTinDuyetThanhLy_Model request)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.UPDATE_THONGTIN_DUYETTHANHLY",
                    "p_Error",
                    "p_ID", "P_FILE_VANBAN", "P_SO_VAN_BAN",
                    "P_NGUOI_TAO", "P_NGUOI_KIEMSOAT",
                    request.id, request.file_vanban, request.so_vanban,
                    request.nguoi_tao, request.nguoi_kiemsoat
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return ex.Message;
            }
        }

        public string DUYET_THANH_LY_CNTT(QLTB_DuyetThanhLy_Model request)
        {
            try
            {

                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.DUYET_THANH_LY_CNTT",
                    "p_Error",
                    "P_BIENBAN_ID", "P_NGUOI_KIEMSOAT",
                    request.bienban_id, request.nguoi_kiemsoat
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return ex.Message;
            }
        }
    }
}
