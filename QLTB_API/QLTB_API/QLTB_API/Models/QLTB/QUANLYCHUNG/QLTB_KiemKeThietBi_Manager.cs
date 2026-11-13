using APIPCHY.Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Globalization;
using Newtonsoft.Json;

namespace QLTB_API.Models.QLTB.QUANLYCHUNG
{
    public class QLTB_KiemKeThietBi_Manager
    {
        DataHelper helper = new DataHelper(DbConnectionType.QLTB);

        public List<QLTB_KiemKeThietBi_Model> GET_BBAN_KIEMKE_CNTT(
            int pageIndex, int pageSize, string id, int? loai_kiemke, string ma_dvi_kiemke, string phongban_kiemke_id, string ma_nhom_thietbi,
            int? trang_thai, string tu_ngay, string den_ngay, string user, out int totalItems)
        {
            totalItems = 0;
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BBAN_KIEMKE_CNTT",
                    "p_page_index", "p_page_size", "p_ID", "p_LOAI_KIEMKE", "p_MA_DVI_KIEMKE", "p_PHONGBAN_KIEMKE_ID", "p_MA_NHOM_THIETBI", "p_TRANG_THAI", "p_TU_NGAY", "p_DEN_NGAY", "p_USER",
                    pageIndex, pageSize, id, loai_kiemke, ma_dvi_kiemke, phongban_kiemke_id, ma_nhom_thietbi, trang_thai, tu_ngay, den_ngay, user
                );

                List<QLTB_KiemKeThietBi_Model> list = new List<QLTB_KiemKeThietBi_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    totalItems = int.Parse(ds.Rows[0]["RECORDCOUNT"].ToString());
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        QLTB_KiemKeThietBi_Model model = new QLTB_KiemKeThietBi_Model();
                        model.id = ds.Rows[i]["id"] != DBNull.Value ? ds.Rows[i]["id"].ToString() : null;
                        model.loai_kiemke = ds.Rows[i]["loai_kiemke"] != DBNull.Value ? Convert.ToInt32(ds.Rows[i]["loai_kiemke"]) : (int?)null;
                        model.ma_dvi_kiemke = ds.Rows[i]["ma_dvi_kiemke"] != DBNull.Value ? ds.Rows[i]["ma_dvi_kiemke"].ToString() : null;
                        model.ten_dvi_kiemke = ds.Rows[i]["ten_dvi_kiemke"] != DBNull.Value ? ds.Rows[i]["ten_dvi_kiemke"].ToString() : null;
                        model.phongban_kiemke_id = ds.Rows[i]["phongban_kiemke_id"] != DBNull.Value ? ds.Rows[i]["phongban_kiemke_id"].ToString() : null;
                        model.ten_phongban_kiemke = ds.Rows[i]["ten_phongban_kiemke"] != DBNull.Value ? ds.Rows[i]["ten_phongban_kiemke"].ToString() : null;
                        model.ma_nhom_thietbi = ds.Rows[i]["ma_nhom_thietbi"] != DBNull.Value ? ds.Rows[i]["ma_nhom_thietbi"].ToString() : null;
                        model.ten_nhom_thietbi = ds.Rows[i]["ten_nhom_thietbi"] != DBNull.Value ? ds.Rows[i]["ten_nhom_thietbi"].ToString() : null;
                        model.ngay_kiemke = ds.Rows[i]["ngay_kiemke"] != DBNull.Value ? ds.Rows[i]["ngay_kiemke"].ToString() : null;
                        model.ngay_kiemke_date = ds.Rows[i]["ngay_kiemke_date"] != DBNull.Value ? ds.Rows[i]["ngay_kiemke_date"].ToString() : null;
                        model.nguoi_tao = ds.Rows[i]["nguoi_tao"] != DBNull.Value ? ds.Rows[i]["nguoi_tao"].ToString() : null;
                        model.ten_nguoi_tao = ds.Rows[i]["ten_nguoi_tao"] != DBNull.Value ? ds.Rows[i]["ten_nguoi_tao"].ToString() : null;
                        model.chucvu_nguoi_tao = ds.Rows[i]["chucvu_nguoi_tao"] != DBNull.Value ? ds.Rows[i]["chucvu_nguoi_tao"].ToString() : null;
                        model.nguoi_daidien_c3 = ds.Rows[i]["nguoi_daidien_c3"] != DBNull.Value ? ds.Rows[i]["nguoi_daidien_c3"].ToString() : null;
                        model.ten_daidien_c3 = ds.Rows[i]["ten_daidien_c3"] != DBNull.Value ? ds.Rows[i]["ten_daidien_c3"].ToString() : null;
                        model.chucvu_daidien_c3 = ds.Rows[i]["chucvu_daidien_c3"] != DBNull.Value ? ds.Rows[i]["chucvu_daidien_c3"].ToString() : null;
                        model.nguoi_daidien_dvi = ds.Rows[i]["nguoi_daidien_dvi"] != DBNull.Value ? ds.Rows[i]["nguoi_daidien_dvi"].ToString() : null;
                        model.ten_daidien_dvi = ds.Rows[i]["ten_daidien_dvi"] != DBNull.Value ? ds.Rows[i]["ten_daidien_dvi"].ToString() : null;
                        model.chucvu_daidien_dvi = ds.Rows[i]["chucvu_daidien_dvi"] != DBNull.Value ? ds.Rows[i]["chucvu_daidien_dvi"].ToString() : null;
                        model.noi_dung = ds.Rows[i]["noi_dung"] != DBNull.Value ? ds.Rows[i]["noi_dung"].ToString() : null;
                        model.trang_thai = ds.Rows[i]["trang_thai"] != DBNull.Value ? Convert.ToInt32(ds.Rows[i]["trang_thai"]) : (int?)null;
                        model.ngay_giao = ds.Rows[i]["ngay_giao"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_giao"]) : (DateTime?)null;
                        model.ngay_nhan = ds.Rows[i]["ngay_nhan"] != DBNull.Value ? Convert.ToDateTime(ds.Rows[i]["ngay_nhan"]) : (DateTime?)null;
                        model.ngay_tao = ds.Rows[i]["ngay_tao"] != DBNull.Value ? ds.Rows[i]["ngay_tao"].ToString() : null;
                        model.url_vanban = ds.Rows[i]["url_vanban"] != DBNull.Value ? ds.Rows[i]["url_vanban"].ToString() : null;
                        model.so_luong = ds.Rows[i]["so_luong"] != DBNull.Value ? Convert.ToInt32(ds.Rows[i]["so_luong"]) : (int?)null;

                        list.Add(model);
                    }
                }
                return list;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public QLTB_KiemKeThietBi_Model GET_BBAN_KIEMKE_CNTT_BY_ID(string id)
        {
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_BBAN_KIEMKE_CNTT_BY_ID", "p_ID", id);
                if (ds == null || ds.Rows.Count == 0) return null;

                DataRow row = ds.Rows[0];
                QLTB_KiemKeThietBi_Model model = new QLTB_KiemKeThietBi_Model
                {
                    id = row["id"] != DBNull.Value ? row["id"].ToString() : null,
                    loai_kiemke = row["loai_kiemke"] != DBNull.Value ? Convert.ToInt32(row["loai_kiemke"]) : (int?)null,
                    ma_dvi_kiemke = row["ma_dvi_kiemke"] != DBNull.Value ? row["ma_dvi_kiemke"].ToString() : null,
                    ten_dvi_kiemke = row["ten_dvi_kiemke"] != DBNull.Value ? row["ten_dvi_kiemke"].ToString() : null,
                    phongban_kiemke_id = row["phongban_kiemke_id"] != DBNull.Value ? row["phongban_kiemke_id"].ToString() : null,
                    ten_phongban_kiemke = row["ten_phongban_kiemke"] != DBNull.Value ? row["ten_phongban_kiemke"].ToString() : null,
                    ma_nhom_thietbi = row["ma_nhom_thietbi"] != DBNull.Value ? row["ma_nhom_thietbi"].ToString() : null,
                    ten_nhom_thietbi = row["ten_nhom_thietbi"] != DBNull.Value ? row["ten_nhom_thietbi"].ToString() : null,
                    ngay_kiemke = row["ngay_kiemke"] != DBNull.Value ? row["ngay_kiemke"].ToString() : null,
                    ngay_kiemke_date = row["ngay_kiemke_date"] != DBNull.Value ? row["ngay_kiemke_date"].ToString() : null,
                    ngay_kiemke_text = row["ngay_kiemke_text"] != DBNull.Value ? row["ngay_kiemke_text"].ToString() : null,
                    nguoi_tao = row["nguoi_tao"] != DBNull.Value ? row["nguoi_tao"].ToString() : null,
                    ten_nguoi_tao = row["ten_nguoi_tao"] != DBNull.Value ? row["ten_nguoi_tao"].ToString() : null,
                    chucvu_nguoi_tao = row["chucvu_nguoi_tao"] != DBNull.Value ? row["chucvu_nguoi_tao"].ToString() : null,
                    nguoi_daidien_c3 = row["nguoi_daidien_c3"] != DBNull.Value ? row["nguoi_daidien_c3"].ToString() : null,
                    ten_daidien_c3 = row["ten_daidien_c3"] != DBNull.Value ? row["ten_daidien_c3"].ToString() : null,
                    chucvu_daidien_c3 = row["chucvu_daidien_c3"] != DBNull.Value ? row["chucvu_daidien_c3"].ToString() : null,
                    nguoi_daidien_dvi = row["nguoi_daidien_dvi"] != DBNull.Value ? row["nguoi_daidien_dvi"].ToString() : null,
                    ten_daidien_dvi = row["ten_daidien_dvi"] != DBNull.Value ? row["ten_daidien_dvi"].ToString() : null,
                    chucvu_daidien_dvi = row["chucvu_daidien_dvi"] != DBNull.Value ? row["chucvu_daidien_dvi"].ToString() : null,
                    noi_dung = row["noi_dung"] != DBNull.Value ? row["noi_dung"].ToString() : null,
                    trang_thai = row["trang_thai"] != DBNull.Value ? Convert.ToInt32(row["trang_thai"]) : (int?)null,
                    ngay_giao = row["ngay_giao"] != DBNull.Value ? Convert.ToDateTime(row["ngay_giao"]) : (DateTime?)null,
                    ngay_nhan = row["ngay_nhan"] != DBNull.Value ? Convert.ToDateTime(row["ngay_nhan"]) : (DateTime?)null,
                    ngay_tao = row["ngay_tao"] != DBNull.Value ? row["ngay_tao"].ToString() : null,
                    url_vanban = row["url_vanban"] != DBNull.Value ? row["url_vanban"].ToString() : null,
                    so_luong = row["so_luong"] != DBNull.Value ? Convert.ToInt32(row["so_luong"]) : (int?)null
                };
                return model;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<QLTB_KiemKeThietBiDetail_Model> GET_TBI_BY_BBAN_KIEMKE_ID(string bban_id)
        {
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_TBI_BY_BBAN_KIEMKE_ID", "p_BBAN_ID", bban_id);
                List<QLTB_KiemKeThietBiDetail_Model> list = new List<QLTB_KiemKeThietBiDetail_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        DataRow r = ds.Rows[i];
                        QLTB_KiemKeThietBiDetail_Model detail = new QLTB_KiemKeThietBiDetail_Model
                        {
                            id = r["id"] != DBNull.Value ? r["id"].ToString() : null,
                            bban_id = r["bban_id"] != DBNull.Value ? r["bban_id"].ToString() : null,
                            thietbi_id = r["thietbi_id"] != DBNull.Value ? r["thietbi_id"].ToString() : null,
                            ma_thietbi = r["ma_thietbi"] != DBNull.Value ? r["ma_thietbi"].ToString() : null,
                            no_thietbi = r["no_thietbi"] != DBNull.Value ? r["no_thietbi"].ToString() : null,
                            ten_thietbi = r["ten_thietbi"] != DBNull.Value ? r["ten_thietbi"].ToString() : null,
                            tbi_dm_chungloai_id = r["tbi_dm_chungloai_id"] != DBNull.Value ? r["tbi_dm_chungloai_id"].ToString() : null,
                            ten_chungloai = r["ten_chungloai"] != DBNull.Value ? r["ten_chungloai"].ToString() : null,
                            ten_hangsx = r["ten_hangsx"] != DBNull.Value ? r["ten_hangsx"].ToString() : null,
                            ten_donvitinh = r["ten_donvitinh"] != DBNull.Value ? r["ten_donvitinh"].ToString() : null,
                            nam_su_dung = r["nam_su_dung"] != DBNull.Value ? r["nam_su_dung"].ToString() : null,
                            phongban_he_thong = r["phongban_he_thong"] != DBNull.Value ? r["phongban_he_thong"].ToString() : null,
                            nguoi_sd_he_thong = r["nguoi_sd_he_thong"] != DBNull.Value ? r["nguoi_sd_he_thong"].ToString() : null,
                            computer_name_he_thong = r["computer_name_he_thong"] != DBNull.Value ? r["computer_name_he_thong"].ToString() : null,
                            co_thuc_te = r["co_thuc_te"] != DBNull.Value ? r["co_thuc_te"].ToString() : "Y",
                            tinh_trang_thucte = r["tinh_trang_thucte"] != DBNull.Value ? r["tinh_trang_thucte"].ToString() : "Tốt",
                            nguoi_sd_thucte = r["nguoi_sd_thucte"] != DBNull.Value ? r["nguoi_sd_thucte"].ToString() : null,
                            computer_name_thucte = r["computer_name_thucte"] != DBNull.Value ? r["computer_name_thucte"].ToString() : null,
                            ghi_chu_kiemke = r["ghi_chu_kiemke"] != DBNull.Value ? r["ghi_chu_kiemke"].ToString() : null,
                            stt_sapxep = r["stt_sapxep"] != DBNull.Value ? Convert.ToInt32(r["stt_sapxep"]) : (int?)null
                        };
                        list.Add(detail);
                    }
                }
                return list;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<QLTB_KiemKeThietBiDetail_Model> GET_DS_TBI_DE_KIEMKE(int loai_kiemke, string ma_dviqly, string phongban_id, string ma_nhom_thietbi)
        {
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_THIETBI.GET_DS_TBI_DE_KIEMKE",
                    "p_LOAI_KIEMKE", "p_MA_DVIQLY", "p_PHONGBAN_ID", "p_MA_NHOM_THIETBI",
                    loai_kiemke, ma_dviqly, phongban_id, ma_nhom_thietbi
                );
                List<QLTB_KiemKeThietBiDetail_Model> list = new List<QLTB_KiemKeThietBiDetail_Model>();
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        DataRow r = ds.Rows[i];
                        QLTB_KiemKeThietBiDetail_Model detail = new QLTB_KiemKeThietBiDetail_Model
                        {
                            thietbi_id = r["thietbi_id"] != DBNull.Value ? r["thietbi_id"].ToString() : null,
                            ma_thietbi = r["ma_thietbi"] != DBNull.Value ? r["ma_thietbi"].ToString() : null,
                            no_thietbi = r["no_thietbi"] != DBNull.Value ? r["no_thietbi"].ToString() : null,
                            ten_thietbi = r["ten_thietbi"] != DBNull.Value ? r["ten_thietbi"].ToString() : null,
                            tbi_dm_chungloai_id = r["tbi_dm_chungloai_id"] != DBNull.Value ? r["tbi_dm_chungloai_id"].ToString() : null,
                            ten_chungloai = r["ten_chungloai"] != DBNull.Value ? r["ten_chungloai"].ToString() : null,
                            ten_hangsx = r["ten_hangsx"] != DBNull.Value ? r["ten_hangsx"].ToString() : null,
                            ten_donvitinh = r["ten_donvitinh"] != DBNull.Value ? r["ten_donvitinh"].ToString() : null,
                            nam_su_dung = r["nam_su_dung"] != DBNull.Value ? r["nam_su_dung"].ToString() : null,
                            phongban_he_thong = r["phongban_he_thong"] != DBNull.Value ? r["phongban_he_thong"].ToString() : null,
                            nguoi_sd_he_thong = r["nguoi_sd_he_thong"] != DBNull.Value ? r["nguoi_sd_he_thong"].ToString() : null,
                            computer_name_he_thong = r["computer_name_he_thong"] != DBNull.Value ? r["computer_name_he_thong"].ToString() : null,
                            co_thuc_te = "Y",
                            tinh_trang_thucte = "Tốt",
                            nguoi_sd_thucte = r["nguoi_sd_he_thong"] != DBNull.Value ? r["nguoi_sd_he_thong"].ToString() : null,
                            computer_name_thucte = r["computer_name_he_thong"] != DBNull.Value ? r["computer_name_he_thong"].ToString() : null,
                            stt_sapxep = i + 1
                        };
                        list.Add(detail);
                    }
                }
                return list;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string INSERT_BBAN_KIEMKE_CNTT(KiemKeThietBiInsertRequest req)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.INSERT_BBAN_KIEMKE_CNTT", "p_ERROR",
                    "p_LOAI_KIEMKE", "p_MA_DVI_KIEMKE", "p_TEN_DVI_KIEMKE", "p_PHONGBAN_KIEMKE_ID", "p_TEN_PHONGBAN_KIEMKE", "p_MA_NHOM_THIETBI", "p_TEN_NHOM_THIETBI",
                    "p_NGUOI_TAO", "p_TEN_NGUOI_TAO", "p_CHUCVU_NGUOI_TAO",
                    "p_NGUOI_DAIDIEN_C3", "p_TEN_DAIDIEN_C3", "p_CHUCVU_DAIDIEN_C3",
                    "p_NGUOI_DAIDIEN_DVI", "p_TEN_DAIDIEN_DVI", "p_CHUCVU_DAIDIEN_DVI",
                    "p_NOI_DUNG",
                    req.loai_kiemke, req.ma_dvi_kiemke, req.ten_dvi_kiemke, req.phongban_kiemke_id, req.ten_phongban_kiemke, req.ma_nhom_thietbi, req.ten_nhom_thietbi,
                    req.nguoi_tao, req.ten_nguoi_tao, req.chucvu_nguoi_tao,
                    req.nguoi_daidien_c3, req.ten_daidien_c3, req.chucvu_daidien_c3,
                    req.nguoi_daidien_dvi, req.ten_daidien_dvi, req.chucvu_daidien_dvi,
                    req.noi_dung
                );
                return NormalizeProcedureResult(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string UPDATE_BBAN_KIEMKE_CNTT(KiemKeThietBiUpdateRequest req)
        {
            try
            {
                string dsThietBiJson = req.ds_thietbi != null ? JsonConvert.SerializeObject(req.ds_thietbi) : "";
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.UPDATE_BBAN_KIEMKE_CNTT", "p_ERROR",
                    "p_BBAN_ID", "p_NGUOI_DAIDIEN_C3", "p_TEN_DAIDIEN_C3", "p_CHUCVU_DAIDIEN_C3",
                    "p_NGUOI_DAIDIEN_DVI", "p_TEN_DAIDIEN_DVI", "p_CHUCVU_DAIDIEN_DVI", "p_NOI_DUNG", "p_DS_THIETBI_JSON",
                    req.bban_id, req.nguoi_daidien_c3, req.ten_daidien_c3, req.chucvu_daidien_c3,
                    req.nguoi_daidien_dvi, req.ten_daidien_dvi, req.chucvu_daidien_dvi, req.noi_dung, dsThietBiJson
                );
                return NormalizeProcedureResult(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string DELETE_BBAN_KIEMKE_CNTT(string id)
        {
            try
            {
                int bbanId = int.Parse(id);
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.DELETE_BBAN_KIEMKE_CNTT", "p_ERROR",
                    "p_ID", bbanId
                );
                return NormalizeProcedureResult(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string HUY_BBAN_KIEMKE_CNTT(CancelKiemKeRequest req)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.HUY_BBAN_KIEMKE_CNTT", "p_ERROR",
                    "p_ID", "p_NGUOI_HUY",
                    req.id, req.nguoi_huy
                );
                return NormalizeProcedureResult(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string KY_C1_BBAN_KIEMKE_CNTT(int id, string nguoi_ky)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.KY_C1_BBAN_KIEMKE_CNTT", "p_ERROR",
                    "p_ID", "p_NGUOI_KY",
                    id, nguoi_ky
                );
                return NormalizeProcedureResult(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string KY_C2_BBAN_KIEMKE_CNTT(int id, string nguoi_ky)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2("PKG_QLTB_THIETBI.KY_C2_BBAN_KIEMKE_CNTT", "p_ERROR",
                    "p_ID", "p_NGUOI_KY",
                    id, nguoi_ky
                );
                return NormalizeProcedureResult(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public class BienBanKiemKeData
        {
            public Dictionary<string, object> content { get; set; }
            public List<List<string>> tableData1 { get; set; }
            public List<List<string>> tableData2 { get; set; }
        }

        private static string NormalizeProcedureResult(string result)
        {
            return string.IsNullOrWhiteSpace(result) ? string.Empty : result.Trim();
        }

        public BienBanKiemKeData get_DATA_BIENBAN_KIEMKE_DOCX(string id)
        {
            try
            {
                QLTB_KiemKeThietBi_Model dt = GET_BBAN_KIEMKE_CNTT_BY_ID(id);
                if (dt == null) return null;

                List<QLTB_KiemKeThietBiDetail_Model> ds_thietbi = GET_TBI_BY_BBAN_KIEMKE_ID(id);

                Dictionary<string, object> content = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
                foreach (var p in dt.GetType().GetProperties())
                {
                    content[p.Name] = p.GetValue(dt) ?? "";
                }

                string tenDonViSuDung = dt.loai_kiemke == 3
                    ? (dt.ten_phongban_kiemke ?? dt.ten_dvi_kiemke ?? "")
                    : (dt.ten_dvi_kiemke ?? "");
                content["ten_dvi_sd_uc"] = tenDonViSuDung.ToUpperInvariant();
                content["ten_dvi_sd"] = tenDonViSuDung;
                content["ten_dvi_kiemke"] = tenDonViSuDung;
                content["nhom_thietbi"] = dt.ten_nhom_thietbi ?? dt.ma_nhom_thietbi ?? "";

                DateTime dtParsed;
                if (!DateTime.TryParseExact(dt.ngay_kiemke, "HH:mm dd/MM/yyyy", CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out dtParsed)
                    && !DateTime.TryParseExact(dt.ngay_kiemke_date, "dd/MM/yyyy", CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out dtParsed))
                {
                    throw new InvalidOperationException("Không đọc được NGAY_KIEMKE của biên bản.");
                }
                content["ngay_lap_phieu"] = $"ngày {dtParsed.Day:D2} tháng {dtParsed.Month:D2} năm {dtParsed.Year}";
                content["ngay_kiem_ke"] = $"Có đến thời điểm {dtParsed.Hour:D2} giờ {dtParsed.Minute:D2} phút ngày {dtParsed.Day:D2} tháng {dtParsed.Month:D2} năm {dtParsed.Year}";

                content["ten_lanhdao_kiemke"] = dt.ten_daidien_c3 ?? "";
                content["chuc_vu_lanhdao_kiemke"] = dt.chucvu_daidien_c3 ?? "Trưởng phòng CNTT";
                content["ten_nguoi_kiemke"] = dt.ten_nguoi_tao ?? "";
                content["chuc_vu_nguoi_kiemke"] = dt.chucvu_nguoi_tao ?? "Cán bộ chuyên trách";

                content["ten_lanhdao_sd"] = dt.ten_daidien_dvi ?? "";
                content["chuc_vu_lanhdao_sd"] = dt.chucvu_daidien_dvi ?? "Đại diện ĐV sử dụng";

                content["noi_dung"] = dt.noi_dung ?? "Biên bản kiểm kê thực tế thiết bị";

                content["nguoi_dai_dien_sudung"] = dt.ten_daidien_dvi ?? "";
                content["lanh_dao_kiemke"] = dt.ten_daidien_c3 ?? "";

                // Table 1: Grouped Summary Table (optional)
                List<List<string>> tableData1 = new List<List<string>>();
                tableData1.Add(new List<string> { "STT", "Tên chủng loại / thiết bị", "Đơn vị tính", "Số lượng" });

                var grouped = ds_thietbi
                    .GroupBy(x => new { ChungLoai = x.ten_chungloai ?? x.ten_thietbi ?? "Khác", DVT = x.ten_donvitinh ?? "Cái" })
                    .Select(g => new { g.Key.ChungLoai, g.Key.DVT, SoLuong = g.Count() })
                    .ToList();

                int idx1 = 1;
                foreach (var item in grouped)
                {
                    tableData1.Add(new List<string> {
                        idx1.ToString(),
                        item.ChungLoai,
                        item.DVT,
                        item.SoLuong.ToString()
                    });
                    idx1++;
                }

                // Biên bản ký chỉ hiển thị kết quả kiểm kê thực tế theo mẫu DOCX.
                List<List<string>> tableData2 = new List<List<string>>();
                tableData2.Add(new List<string> {
                    "STT", "Tên thiết bị / Số hiệu", "Có thực tế", "Tình trạng thực tế",
                    "ĐVT", "Năm sử dụng", "Người sử dụng", "Computer Name", "Ghi chú"
                });

                int idx2 = 1;
                foreach (var item in ds_thietbi)
                {
                    string tenVaKyHieu = item.ten_thietbi ?? "";
                    string serial = item.no_thietbi ?? "";
                    if (!string.IsNullOrEmpty(serial))
                    {
                        tenVaKyHieu += $" ({serial})";
                    }

                    string hienTrangSD = item.co_thuc_te == "Y" ? "Có" : "Không";
                    string hienTrangQL = item.tinh_trang_thucte ?? "Tốt";
                    string dvt = item.ten_donvitinh ?? "Cái";
                    string namSD = item.nam_su_dung ?? "";
                    string nguoiSuDung = item.nguoi_sd_thucte ?? "";
                    string pcName = item.computer_name_thucte ?? "";
                    string ghiChu = item.ghi_chu_kiemke ?? "";

                    tableData2.Add(new List<string> {
                        idx2.ToString(),
                        tenVaKyHieu,
                        hienTrangSD,
                        hienTrangQL,
                        dvt,
                        namSD,
                        nguoiSuDung,
                        pcName,
                        ghiChu
                    });
                    idx2++;
                }

                return new BienBanKiemKeData
                {
                    content = content,
                    tableData1 = tableData1,
                    tableData2 = tableData2
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
