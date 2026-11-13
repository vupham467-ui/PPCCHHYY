namespace QLTB_API.Models.QLTB.QLTB_BAOCAO
{
    public class QLTB_BAOCAO_Model
    {
    }

    public class QLTB_BaoCaoChiTiet_Model
    {
        public string? id { get; set; }
        public string? ma_dviqly { get; set; }
        public string? don_vi { get; set; }
        public string? ten_nhom { get; set; }
        public string? ten_chungloai { get; set; }
        public string? no_thietbi { get; set; }
        public string? ma_thietbi { get; set; }
        public string? ten_thietbi { get; set; }
        public string? trang_thai { get; set; }
        public string? nam_sx { get; set; }
        public string? trangthai_duyet { get; set; }
        public string? phongban_sd { get; set; }
        public string? ten_kho { get; set; }
        public string? ten_nuoc_sx { get; set; }
        public string? ten_hang_sx { get; set; }
        public string? nguoi_sd { get; set; }
        public string? thong_tin_khac { get; set; }
    }

    public class QLTB_BaoCaoLichSuGiaoNhan_Model
    {
        public string? thietbi_id { get; set; }
        public int? bban_id { get; set; }
        public int? loai_bban { get; set; }
        public string? ten_loai_bban { get; set; }
        public string? loai_nghiepvu { get; set; }
        public string? ten_loai_nghiepvu { get; set; }
        public string? donvi_cu { get; set; }
        public string? donvi_moi { get; set; }
        public string? ten_donvi_cu { get; set; }
        public string? ten_donvi_moi { get; set; }
        public string? ten_phongban_cu { get; set; }
        public string? ten_phongban_moi { get; set; }
        public string? nguoi_giao { get; set; }
        public string? nguoi_nhan { get; set; }
        public string? ten_nguoi_giao { get; set; }
        public string? ten_nguoi_nhan { get; set; }
        public string? ngay_tao { get; set; }
        public string? ngay_nhan { get; set; }
        public string? nguoi_sd_cu { get; set; }
        public string? nguoi_sd_moi { get; set; }
        public string? ten_nguoi_sd_cu { get; set; }
        public string? ten_nguoi_sd_moi { get; set; }
        public string? ten_kho_cu { get; set; }
        public string? ten_kho_moi { get; set; }
        public string? trangthai_cu { get; set; }
        public string? trangthai_moi { get; set; }
        public string? trangthai_bb { get; set; }
        public int? trangthai_thanhly { get; set; }
        public string? thoigian_xacnhan { get; set; }
    }

    public class QLTB_BaoCaoDongBoDuLieuCu_Model
    {
        public int stt {  get; set; }
        public string ma_dviqly { get; set; }
        public string don_vi { get; set; }
        public string ma_nhom {  get; set; }
        public string ten_nhom { get; set; }
        public string ma_chungloai { get; set; }
        public string ten_chungloai { get; set; }
        public string trang_thai { get; set; }
        public int tong_so_thiet_bi { get; set; }
        public int da_dong_bo { get; set; }
        public int chua_dong_bo { get; set; }
        public int dong_bo_loi { get; set; }

    }

    public class QLTB_BaoCaoTongHopThietBi_Model
    {
        public int stt { get; set; }
        public string ma_dviqly { get; set; }
        public string don_vi { get; set; }
        public string ma_nhom { get; set; }
        public string ten_nhom { get; set; }
        public string ma_chungloai { get; set; }
        public string ten_chungloai { get; set; }
        public string trang_thai { get; set; }
        public int tong_so_thiet_bi { get; set; }

    }

    public class QLTB_BaoCaoTongHopTinhTrangGiaoNhan_Model
    {
        public int stt { get; set; }
        public string ma_dviqly { get; set; }
        public string don_vi { get; set; }
        public string ma_nhom { get; set; }
        public string ten_nhom { get; set; }
        public int tong_thietbi { get; set; }
        public int da_cap_trong_ky { get; set; }
        public int cap_sau { get; set; }
        public int chua_cap { get; set; }
    }


        public class QLTB_BaoCaoTinhTrangGiaoNhanThietBi_Model
    {
        public string? id { get; set; }
        public string? ma_dviqly { get; set; }
        public string? don_vi { get; set; }
        public string? ten_nhom { get; set; }
        public string? ten_chungloai { get; set; }
        public string? no_thietbi { get; set; }
        public string? ma_thietbi { get; set; }
        public string? ten_thietbi { get; set; }
        public string? ngay_ban_giao_dvi { get; set; }
        public string? ngay_cap_phat { get; set; }
        public string? tinh_trang_cap_phat { get; set; }
        public int? tinhtrang_id { get; set; }
        public int? so_ngay_ton { get; set; }
    }
    public class QLTB_BaoCaoTongHopBienBan_Model
    {
        public int stt { get; set; }
        public string ma_dviqly { get; set; }
        public string don_vi { get; set; }
        public string id_phong { get; set; }
        public string ten_phong { get; set; }
        public string loai_nghiepvu { get; set; }
        public string ten_loai_nghiepvu { get; set; }
        public int tong_bienban { get; set; }
        public int da_hoan_thanh { get; set; }
        public int chua_ky_du { get; set; }
        public int chua_ky { get; set; }
        public decimal ty_le_hoan_thanh { get; set; }
    }

}
