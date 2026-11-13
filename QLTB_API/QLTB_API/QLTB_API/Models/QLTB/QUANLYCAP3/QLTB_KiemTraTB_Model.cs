using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.QUANLYCAP3
{
    public class QLTB_KiemTraTB_Model
    {
        public string id_kiemtra { get; set; }
        public string tbi_id { get; set; }
        public string ten_thietbi { get; set; }
        public string ma_thietbi { get; set; }
        public string no_thietbi { get; set; }
        public string ma_dviqly { get; set; }
        public string ten_kho { get; set; }
        public string tbi_dm_chungloai_ten { get; set; }
        public string ten_hang_sx { get; set; }
        public string donvi_kiemtra { get; set; }
        public string nguoi_kiemtra { get; set; }
        public string ngay_kiemtra { get; set; }
        public string ghi_chu { get; set; }
        public string ket_qua { get; set; }
        public string tbi_trangthai_id { get; set; }
        public string tbi_trangthai_ten { get; set; }
        public string can_xu_ly { get; set; }
        public string co_the_kiemtra { get; set; }
    }
    public class KiemTraThietBiRequest
    {
        public string tbi_id { get; set; }
        public string donvi_kiemtra { get; set; }
        public string nguoi_kiemtra { get; set; }
        public string ngay_kiemtra { get; set; }
        public string ghi_chu { get; set; }
        public string ket_qua { get; set; }
    }
    public class KiemTraThietBiMultiRequest
    {
        public List<string> tbi_ids { get; set; }
        public string donvi_kiemtra { get; set; }
        public string nguoi_kiemtra { get; set; }
        public string ngay_kiemtra { get; set; }
        public string ghi_chu { get; set; }
        public string ket_qua { get; set; }
    }

}
