using System;
using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.QUANLYCHUNG
{
    public class QLTB_GiaoNhanThietBi_Model
    {
        public string id { get; set; }
        public string ma_dvi_giao { get; set; }
        public string ten_dvi_giao { get; set; }
        public string ten_dvi_giao_uc { get; set; }
        public string ma_dvi_nhan { get; set; }
        public string ten_dvi_nhan { get; set; }
        public string ten_dvi_nhan_hienthi { get; set; }
        public string phongban_giao_id { get; set; }
        public string ten_phongban_giao { get; set; }
        public string ten_phongban_giao_uc { get; set; }
        public string phongban_nhan_id { get; set; }
        public string ten_phongban_nhan { get; set; }
        public string nguoi_tao { get; set; }
        public string nguoi_giao { get; set; }
        public string nguoi_nhan { get; set; }
        public string chuc_vu_giao { get; set; }
        public string chuc_vu_nhan { get; set; }
        public string ten_nguoi_tao { get; set; }
        public string ten_nguoi_giao { get; set; }
        public string ten_nguoi_nhan { get; set; }
        public int? loai_bban { get; set; }
        public string loai_nghiepvu { get; set; }
        public string kho_nhan_id { get; set; }
        public DateTime? ngay_giao { get; set; }
        public DateTime? ngay_nhan { get; set; }
        public DateTime? ngay_tao { get; set; }
        public string? ngay_lapphieu { get; set; }
        public string? ngay_lap { get; set; }
        public int? so_luong { get; set; }
        public string noi_dung { get; set; }
        public int? trang_thai { get; set; }
        public string url_vanban { get; set; }
        public DateTime? ngay_sua { get; set; }
        public string nguoi_huy { get; set; }
        public DateTime? ngay_huy { get; set; }
        public int? trang_thai_thanh_ly { get; set; }
        public string ten_trang_thai_thanh_ly { get; set; }
        public string nguoi_kiemsoat { get; set; }
        public string? thoigian_xacnhan { get; set; }
    }

    public class DsThietBiItem
    {
        public string id { get; set; }
        public string nguoi_sd { get; set; }
        public string tinh_trang_tb { get; set; }
        public string nguyen_nhan { get; set; }
    }

    public class GiaoNhanThietBiRequest
    {
        public string id { get; set; }
        public string ma_dvi_giao { get; set; }
        public string ma_dvi_nhan { get; set; }
        public string phongban_giao_id { get; set; }
        public string phongban_nhan_id { get; set; }
        public string nguoi_tao { get; set; }
        public string nguoi_giao { get; set; }
        public string nguoi_nhan { get; set; }
        public int loai_bban { get; set; }
        public string loai_nghiepvu{ get; set; }
        public string ngay_lapphieu { get; set; }
        public int? kho_nhan_id { get; set; }
        public string? noi_dung { get; set; }
        public int so_luong {  get; set; }
        public List<DsThietBiItem> ds_thietbi { get; set; }
    }

    public class CancelGiaoNhanRequest
    {
        public int id { get; set; }
        public string nguoi_huy { get; set; }
    }

    public class QLTB_ThongTinDuyetThanhLy_Model
    {
        public string? id { get; set; }
        public string? bienban_id { get; set; }
        public string? nguoi_kiemsoat {  get; set; }
        public string? ten_nguoi_kiemsoat { get; set; }
        public string? so_vanban {  get; set; }
        public string? file_vanban { get; set; }
        public DateTime? thoigian_xacnhan { get; set; }
        public string? nguoi_tao {  get; set; }
        public DateTime? ngay_tao { get; set; }
        public string? trang_thai_thanh_ly  { get; set; }
    }

    public class QLTB_DuyetThanhLy_Model
    {
        public string? bienban_id { get; set; }
        public string? nguoi_kiemsoat { get; set; }
    }
}
