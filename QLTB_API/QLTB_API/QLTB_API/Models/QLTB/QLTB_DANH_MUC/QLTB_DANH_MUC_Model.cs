using System;
using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.DANH_MUC
{
    public class QLTB_DM_NUOCSX_Model
    {
        public int? id { get; set; }
        public string? ma_nuoc_sx { get; set; }
        public string? ten_nuoc_sx { get; set; }
    }

    public class QLTB_DM_NHOM_Model
    {
        public int? id { get; set; }
        public string? ma_nhom { get; set; }
        public string? ten_nhom { get; set; }
        public string? ghi_chu { get; set; }
        public DateTime? ngay_tao { get; set; }
        public string? nguoi_tao { get; set; }
        public DateTime? ngay_sua { get; set; }
        public string? nguoi_sua { get; set; }
    }

    public class QLTB_DM_LOAI_NGHIEPVU_Model
    {
        public string? ma_loai_nghiepvu { get; set; }
        public string? ten_loai_nghiepvu { get; set; }
        public int? loai_bban { get; set; }
        public string? ten_loai_bban { get; set; }
        public int? trang_thai { get; set; }
        public int? cap_nghiepvu { get; set; }
    }

    public class QLTB_DM_CHUNGLOAI_Model
    {
        public int? id { get; set; }
        public string? ma_nhom { get; set; }
        public string? ten_nhom { get; set; }
        public string? ma_chungloai { get; set; }
        public string? ten_chungloai { get; set; }
        public int? sap_xep { get; set; }
        public string? ghi_chu { get; set; }
        public string? ct_cauhinh_json { get; set; }
        public string? co_thongtin_ct { get; set; }
        public string? can_chon_nsd { get; set; }
    }

    public class QLTB_DM_HANGSX_Model
    {
        public int? id { get; set; }
        public string? ma_hang_sx { get; set; }
        public string? ten_hang_sx { get; set; }
    }

    public class QLTB_DM_TRANGTHAI_Model
    {
        public int? id { get; set; }
        public string? ma { get; set; }
        public string? ten { get; set; }
        public string? ten_trangthai { get; set; }
        public int? sap_xep { get; set; }
        public string? ghi_chu { get; set; }
    }

    public class QLTB_DM_DONVITINH_Model
    {
        public string? id { get; set; }
        public string? ma { get; set; }
        public string? ten { get; set; }
        public string? ten_donvitinh { get; set; }
        public int? sap_xep { get; set; }
        public string? trang_thai { get; set; }
        public int? dm_kieudulieu_id { get; set; }
        public int? so_thap_phan { get; set; }
    }

    public class QLTB_DM_KHO_Model
    {
        public int? id { get; set; }
        public string? ma_dviqly { get; set; }
        public string? ten_don_vi { get; set; }
        public string? ma_kho { get; set; }
        public string? ten_kho { get; set; }
        public int? cap_donvi { get; set; }
        public DateTime? ngay_tao { get; set; }
        public string? nguoi_tao { get; set; }
        public DateTime? ngay_sua { get; set; }
        public string? nguoi_sua { get; set; }
    }

    public class QLTB_DM_THIETBI_Model
    {
        public string? id { get; set; }
        public int? tbi_dm_chungloai_id { get; set; }
        public int? tbi_dm_hangsx_id { get; set; }
        public int? tbi_nuocsx_id { get; set; }
        public int? tbi_kho_id { get; set; }
        public int? tbi_trangthai_id { get; set; }
        public string? dm_donvitinh_id { get; set; }
        public string? dm_donvi_id { get; set; }
        public string? dm_phongban_id { get; set; }
        public string? tbi_dm_chungloai_ten { get; set; }
        public string? tbi_dm_hangsx_ten { get; set; }
        public string? tbi_nuocsx_ten { get; set; }
        public string? tbi_kho_ten { get; set; }
        public string? tbi_trangthai_ten { get; set; }
        public string? dm_donvitinh_ten { get; set; }
        public string? dm_donvi_ten { get; set; }
        public string? dm_phongban_ten { get; set; }
        public string? nguoi_sd { get; set; }
        public string? ten_nguoi_sd { get; set; }
        public string? ma_thietbi { get; set; }
        public string? qr_code { get; set; }
        public string? no_thietbi { get; set; }
        public string? ten_thietbi { get; set; }
        public string? ngay_vanhanh { get; set; }
        public string? ngay_tao { get; set; }
        public string? ngay_sua { get; set; }
        public string? ngay_duyet { get; set; }
        public string? nguoi_tao { get; set; }
        public string? nguoi_sua { get; set; }
        public string? nguoi_duyet { get; set; }
        public string? khoa_tbi { get; set; }
        public string? duyet_tbi { get; set; }
        public string? ma_dviqly { get; set; }
        public string? namsx { get; set; }
        public string? thong_tin_khac { get; set; }
        public string? mk_ngay_tao { get; set; }
        public string? mk_nguoi_tao { get; set; }
        public string? mk_ngay_mo { get; set; }
        public string? mk_nguoi_mo { get; set; }
        public string? mk_ngay_khoa { get; set; }
        public string? mk_nguoi_khoa { get; set; }
        public string? mk_trang_thai { get; set; }
        public string? mk_trang_thai_ten { get; set; }
        public string? mk_ly_do { get; set; }
        public string? mk_noi_dung { get; set; }
        public string? so_bienban { get; set; }
        public string? ma_nhom_tbi { get; set; }
        public string? can_chon_nsd { get; set; }
        public string? co_thongtin_ct { get; set; }
        public string? ct_cauhinh_json { get; set; }
        public string? thongtin_chitiet_json { get; set; }
        public string? last_bban_id { get; set; }
        public string? co_ls_giaonhan { get; set; }
        public string? search_thietbi { get; set; } //Tìm kiếm tên, no hoặc mã
        public string? tinh_trang_tb { get; set; }
        public string? nguyen_nhan { get; set; }
        public int? trang_thai_khoa { get; set; }
    }

}
