using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.QUANLYCAP4
{
    public class QLTB_DangKyMoKhoaTB_Model
    {
        
    }

    public class DangKyMoKhoaRequest
    {
        public string id { get; set; }
        public string ma_dviqly { get; set; }
        public string tbi_dm_thietbi_id { get; set; }
        public string mk_noi_dung { get; set; }
        public string mk_ly_do { get; set; }
        public string mk_ngay_tao { get; set; }
        public string mk_nguoi_tao { get; set; }
    }
    public class DangKyMoKhoaMultiRequest
    {
        public string id { get; set; }
        public string ma_dviqly { get; set; }
        public List<string> tbi_dm_thietbi_ids { get; set; }
        public string mk_noi_dung { get; set; }
        public string mk_ly_do { get; set; }
        public string mk_ngay_tao { get; set; }
        public string mk_nguoi_tao { get; set; }
    }
}
