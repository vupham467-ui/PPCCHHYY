using System;
using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.QUANLYCHUNG
{
    public class QLTB_KiemKeThietBi_Model
    {
        public string id { get; set; }
        public int? loai_kiemke { get; set; }
        public string ma_dvi_kiemke { get; set; }
        public string dm_donvi_kiemke_id { get; set; }
        public string ten_dvi_kiemke { get; set; }
        public string phongban_kiemke_id { get; set; }
        public string ten_phongban_kiemke { get; set; }
        public string ma_nhom_thietbi { get; set; }
        public string ten_nhom_thietbi { get; set; }
        public string ngay_kiemke { get; set; }
        public string ngay_kiemke_date { get; set; }
        public string ngay_kiemke_text { get; set; }
        public string nguoi_tao { get; set; }
        public string ten_nguoi_tao { get; set; }
        public string chucvu_nguoi_tao { get; set; }
        public string nguoi_daidien_c3 { get; set; }
        public string ten_daidien_c3 { get; set; }
        public string chucvu_daidien_c3 { get; set; }
        public string nguoi_daidien_dvi { get; set; }
        public string ten_daidien_dvi { get; set; }
        public string chucvu_daidien_dvi { get; set; }
        public string noi_dung { get; set; }
        public int? trang_thai { get; set; }
        public DateTime? ngay_giao { get; set; }
        public DateTime? ngay_nhan { get; set; }
        public string ngay_tao { get; set; }
        public string url_vanban { get; set; }
        public int? so_luong { get; set; }
    }

    public class QLTB_KiemKeThietBiDetail_Model
    {
        public string id { get; set; }
        public string bban_id { get; set; }
        public string thietbi_id { get; set; }
        public string ma_thietbi { get; set; }
        public string no_thietbi { get; set; }
        public string ten_thietbi { get; set; }
        public string tbi_dm_chungloai_id { get; set; }
        public string ten_chungloai { get; set; }
        public string ten_hangsx { get; set; }
        public string ten_donvitinh { get; set; }
        public string nam_su_dung { get; set; }
        public string phongban_he_thong { get; set; }
        public string nguoi_sd_he_thong { get; set; }
        public string computer_name_he_thong { get; set; }
        public string co_thuc_te { get; set; }
        public string tinh_trang_thucte { get; set; }
        public string nguoi_sd_thucte { get; set; }
        public string computer_name_thucte { get; set; }
        public string ghi_chu_kiemke { get; set; }
        public int? stt_sapxep { get; set; }
    }

    public class KiemKeThietBiInsertRequest
    {
        public int loai_kiemke { get; set; }
        public string ma_dvi_kiemke { get; set; }
        public string dm_donvi_kiemke_id { get; set; }
        public string ten_dvi_kiemke { get; set; }
        public string phongban_kiemke_id { get; set; }
        public string ten_phongban_kiemke { get; set; }
        public string ma_nhom_thietbi { get; set; }
        public string ten_nhom_thietbi { get; set; }
        public string nguoi_tao { get; set; }
        public string ten_nguoi_tao { get; set; }
        public string chucvu_nguoi_tao { get; set; }
        public string nguoi_daidien_c3 { get; set; }
        public string ten_daidien_c3 { get; set; }
        public string chucvu_daidien_c3 { get; set; }
        public string nguoi_daidien_dvi { get; set; }
        public string ten_daidien_dvi { get; set; }
        public string chucvu_daidien_dvi { get; set; }
        public string noi_dung { get; set; }
    }

    public class KiemKeThietBiUpdateRequest
    {
        public int bban_id { get; set; }
        public string nguoi_daidien_c3 { get; set; }
        public string ten_daidien_c3 { get; set; }
        public string chucvu_daidien_c3 { get; set; }
        public string nguoi_daidien_dvi { get; set; }
        public string ten_daidien_dvi { get; set; }
        public string chucvu_daidien_dvi { get; set; }
        public string noi_dung { get; set; }
        public List<QLTB_KiemKeThietBiDetail_Model> ds_thietbi { get; set; }
    }

    public class CancelKiemKeRequest
    {
        public int id { get; set; }
        public string nguoi_huy { get; set; }
    }
}
