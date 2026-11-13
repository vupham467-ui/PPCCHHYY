using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.QLTB_DONGBODULIEU
{
    public class QLTB_DONGBODULIEU_Model
    {
    }
    public class QLTB_DULIEU_THIETBI_MAPPING_Model
    {
        public string? id { get; set; }
        public int? tbi_dm_chungloai_id { get; set; }
        public int? tbi_kho_id { get; set; }
        public int? tbi_kho_id_old { get; set; }
        public int? tbi_trangthai_id { get; set; }
        public int? tbi_nuocsx_id { get; set; }
        public int? tbi_dm_hangsx_id { get; set; }
        public string? namsx { get; set; }
        public string? dm_donvitinh_id { get; set; }
        public string? dm_donvi_id { get; set; }
        public string? dm_phongban_id_old { get; set; }
        public string? dm_phongban_id { get; set; }
        public string? tbi_dm_chungloai_ten { get; set; }
        public string? tbi_kho_ten { get; set; }
        public string? tbi_kho_ten_old { get; set; }
        public string? tbi_trangthai_ten { get; set; }
        public string? dm_donvi_ten { get; set; }
        public string? dm_phongban_ten_old { get; set; }
        public string? dm_phongban_ten { get; set; }
        public string? nguoi_sd_old { get; set; }
        public string? nguoi_sd { get; set; }
        public string? ngay_vanhanh { get; set; }
        public string? ma_thietbi { get; set; }
        public string? no_thietbi { get; set; }
        public string? ten_thietbi { get; set; }
        public string? duyet_tbi { get; set; }
        public string? ma_dviqly { get; set; }
        public string? ct_cauhinh_json { get; set; }
        public string? thongtin_chitiet_json { get; set; }
        public string? thong_tin_khac { get; set; }
        public int? sync_status { get; set; }
        public string? sync_error { get; set; }
        public string? updated_by { get; set; }
        public string? updated_date { get; set; }
        public string? sync_by { get; set; }
        public string? sync_date { get; set; }
        public int? is_locked { get; set; }
        public string? lock_by { get; set; }
        public string? lock_date { get; set; }
    }

    public class QLTB_UpdateData_TBCu_Model
    {
        public string? id { get; set; }
        public string? dm_phongban_id_new { get; set; }
        public string? tbi_kho_id_new { get; set; }
        public string? tbi_trangthai_new { get; set; }
        public string? nguoi_sd_new { get; set; }
        public string? thongtin_chitiet_json { get; set; }
        public string? updated_by { get; set; }
    }

    public class QLTB_UpdateData_TBDoxaCu_Model
    {
        public string? ma_dviqly { get; set; }
        public string? dm_phongban_id_new { get; set; }
        public string? tbi_kho_id_new { get; set; }
        public string? tbi_trangthai_new { get; set; }
        public string? nguoi_sd_new { get; set; }
        public string? updated_by { get; set; }
    }

    public class QLTB_SyncData_TBCu_Model
    {
        public string? stg_id { get; set; }
        public string? sync_by { get; set; }
    }
    public class QLTB_SyncData_TBCu_Multi_Model
    {
        public List<string> list_id { get; set; }
        public string? sync_by { get; set; }
    }

}
