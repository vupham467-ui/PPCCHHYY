using System;
using System.Collections.Generic;

namespace QLTB_API.Models.QLTB.QUANLYCAP3
{
    public class QLTB_DuyetMoKhoaTB_Model
    {
        public string id { get; set; }
        public string ma_dviqly { get; set; }
        public string tbi_dm_thietbi_id { get; set; }
        public DateTime ngay_tao { get; set; }
        public string nguoi_tao { get; set; }
        public DateTime ngay_mo { get; set; }
        public string nguoi_mo { get; set; }
        public DateTime ngay_khoa { get; set; }
        public string nguoi_khoa { get; set; }
        public string trang_thai { get; set; }
        public string ly_do { get; set; }
        public string noi_dung { get; set; }
    }

    public class DuyetThietBiRequest
    {
        public string id { get; set; }
        public string nguoi_duyet { get; set; }
    }
    public class DuyetThietBiMultiRequest
    {
        public List<string> ids { get; set; }
        public string nguoi_duyet { get; set; }
    }
}
