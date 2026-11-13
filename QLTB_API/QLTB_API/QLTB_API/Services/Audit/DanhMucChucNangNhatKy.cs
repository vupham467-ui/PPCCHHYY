using System;
using System.Collections.Generic;

namespace QLTB_API.Services.Audit
{
    public sealed class ThongTinChucNangNhatKy
    {
        public ThongTinChucNangNhatKy(string ma, string ten, bool ghiNhanThaoTacDoc = false)
        {
            Ma = ma;
            Ten = ten;
            GhiNhanThaoTacDoc = ghiNhanThaoTacDoc;
        }

        public string Ma { get; }
        public string Ten { get; }
        public bool GhiNhanThaoTacDoc { get; }
    }

    public static class DanhMucChucNangNhatKy
    {
        public static readonly IReadOnlyDictionary<string, ThongTinChucNangNhatKy> TatCa
            = new Dictionary<string, ThongTinChucNangNhatKy>(StringComparer.OrdinalIgnoreCase)
        {
            ["API_Download"] = ChucNang("TAI_TEP", "Tải tệp"),
            ["Upload"] = ChucNang("TAI_TEP", "Tải tệp"),
            ["PDF"] = ChucNang("XU_LY_TAI_LIEU_PDF", "Xử lý tài liệu PDF"),
            ["AesEncryption"] = ChucNang("MA_HOA_DU_LIEU", "Mã hóa dữ liệu"),
            ["DM_CHUCVU"] = ChucNang("DANH_MUC_CHUC_VU", "Danh mục chức vụ"),
            ["DM_DONVI"] = ChucNang("DANH_MUC_DON_VI", "Danh mục đơn vị"),
            ["DM_PHONGBAN"] = ChucNang("DANH_MUC_PHONG_BAN", "Danh mục phòng ban"),
            ["HT_MENU"] = ChucNang("QUAN_LY_MENU", "Quản lý menu"),
            ["HT_NGUOIDUNG"] = ChucNang("QUAN_LY_NGUOI_DUNG", "Quản lý người dùng"),
            ["HT_NHOMQUYEN"] = ChucNang("QUAN_LY_NHOM_QUYEN", "Quản lý nhóm quyền"),
            ["HT_PHANQUYEN"] = ChucNang("PHAN_QUYEN_NGUOI_DUNG", "Phân quyền người dùng"),
            ["HT_QUYEN_NGUOIDUNG"] = ChucNang("PHAN_QUYEN_NGUOI_DUNG", "Phân quyền người dùng"),
            ["HT_USER_MANAGER"] = ChucNang("QUAN_LY_ANH_NGUOI_DUNG", "Quản lý ảnh người dùng"),
            ["QLTB_BAOCAO"] = ChucNang("BAO_CAO_THIET_BI_CNTT", "Báo cáo thiết bị CNTT", true),
            ["QLTB_DANH_MUC"] = ChucNang("DANH_MUC_THIET_BI_CNTT", "Danh mục thiết bị CNTT"),
            ["QLTB_Dongbodulieu"] = ChucNang("DONG_BO_THIET_BI_CNTT", "Đồng bộ thiết bị CNTT"),
            ["QLTB_DuyetMoKhoaTB"] = ChucNang("DUYET_MO_KHOA_THIET_BI", "Duyệt mở khóa thiết bị"),
            ["QLTB_GenQR"] = ChucNang("MA_QR_THIET_BI", "Mã QR thiết bị"),
            ["QLTB_KiemTraTB"] = ChucNang("KIEM_TRA_THIET_BI", "Kiểm tra thiết bị"),
            ["QLTB_DangKyMoKhoaTB"] = ChucNang("DANG_KY_MO_KHOA_THIET_BI", "Đăng ký mở khóa thiết bị"),
            ["QLTB_GiaoNhanThietBi"] = ChucNang("GIAO_NHAN_THIET_BI_CNTT", "Giao nhận thiết bị CNTT")
        };

        public static bool TryGet(string controllerName, out ThongTinChucNangNhatKy function)
            => TatCa.TryGetValue(controllerName ?? string.Empty, out function);

        private static ThongTinChucNangNhatKy ChucNang(string ma, string ten, bool ghiNhanThaoTacDoc = false)
            => new ThongTinChucNangNhatKy(ma, ten, ghiNhanThaoTacDoc);
    }
}
