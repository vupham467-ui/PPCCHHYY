using System;

namespace QLTB_API.Services.Audit
{
    public static class MaChucNangNhatKy
    {
        public const string XAC_THUC = "XAC_THUC";
        public const string XAC_THUC_PMIS = "XAC_THUC_PMIS";
        public const string QUAN_LY_NGUOI_DUNG = "QUAN_LY_NGUOI_DUNG";
        public const string PHAN_QUYEN_NGUOI_DUNG = "PHAN_QUYEN_NGUOI_DUNG";
    }

    public static class MaThaoTacNhatKy
    {
        public const string DANG_NHAP = "DANG_NHAP";
        public const string DANG_XUAT = "DANG_XUAT";
        public const string XEM = "XEM";
        public const string TIM_KIEM = "TIM_KIEM";
        public const string TAI_XUONG = "TAI_XUONG";
        public const string XUAT_BAO_CAO = "XUAT_BAO_CAO";
        public const string THEM_MOI = "THEM_MOI";
        public const string CAP_NHAT = "CAP_NHAT";
        public const string XOA = "XOA";
        public const string KHOI_PHUC = "KHOI_PHUC";
        public const string NHAP_DU_LIEU = "NHAP_DU_LIEU";
        public const string DONG_BO = "DONG_BO";
        public const string PHE_DUYET = "PHE_DUYET";
        public const string TU_CHOI = "TU_CHOI";
        public const string XAC_NHAN = "XAC_NHAN";
        public const string HUY = "HUY";
        public const string KHOA = "KHOA";
        public const string MO_KHOA = "MO_KHOA";
        public const string DOI_MAT_KHAU = "DOI_MAT_KHAU";
        public const string DAT_LAI_MAT_KHAU = "DAT_LAI_MAT_KHAU";
    }

    public static class TrangThaiNhatKy
    {
        public const string THANH_CONG = "THANH_CONG";
        public const string THAT_BAI = "THAT_BAI";
        public const string BI_TU_CHOI = "BI_TU_CHOI";
        public const string DA_HUY = "DA_HUY";
        public const string THANH_CONG_MOT_PHAN = "THANH_CONG_MOT_PHAN";
    }

    public static class NhatKyHeThongItems
    {
        public const string MaUngDung = "NHAT_KY_MA_UNG_DUNG";
        public const string MaNguoiDung = "NHAT_KY_MA_NGUOI_DUNG";
        public const string TenNguoiDung = "NHAT_KY_TEN_NGUOI_DUNG";
        public const string MaDonVi = "NHAT_KY_MA_DON_VI";
        public const string MaPhienGiaoDich = "NHAT_KY_MA_PHIEN_GIAO_DICH";
        public const string NoiDung = "NHAT_KY_NOI_DUNG";
        public const string ThongBaoLoi = "NHAT_KY_THONG_BAO_LOI";
        public const string TrangThai = "NHAT_KY_TRANG_THAI";
        public const string SoLuongDoiTuong = "NHAT_KY_SO_LUONG_DOI_TUONG";
        public const string ChiTietBoSung = "NHAT_KY_CHI_TIET_BO_SUNG";
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public sealed class GhiNhatKyAttribute : Attribute
    {
        public GhiNhatKyAttribute(string maChucNang, string maThaoTac)
        {
            MaChucNang = maChucNang;
            MaThaoTac = maThaoTac;
        }

        public string MaChucNang { get; }
        public string MaThaoTac { get; }
        public string NoiDung { get; set; }
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public sealed class BoQuaNhatKyAttribute : Attribute
    {
    }
}
