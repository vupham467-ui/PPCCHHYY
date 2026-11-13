using System;
using System.Collections.Generic;

namespace QLTB_API.Models.QUAN_TRI.HT_MENU
{
    public class HT_MENU_Model
    {

        public int? id { get; set; }
        public string? ten_menu { get; set; }
        public string? ghi_chu { get; set; }
        public DateTime? ngay_tao { get; set; }
        public string? nguoi_tao { get; set; }
        public DateTime? ngay_sua { get; set; }
        public string? nguoi_sua { get; set; }
        public string? duong_dan { get; set; }
        public int? parent_id { get; set; }
        public string? icon { get; set; }
        public int? sap_xep { get; set; }
        public string? ma_menu { get; set; }
        public List<HT_MENU_Model> children { get; set; }
    }

    public class MenuWaitSign_Model
    {
        public int? id { get; set; }
        public string username { get; set; }
        public string ten_menu { get; set; }
        public string module_code { get; set; }
        public string business_code { get; set; }
        public int? so_cho_ky { get; set; }
    }

    public class QuyetToanSapHetHanWarning_Model
    {
        public int? id { get; set; }
        public string username { get; set; }
        public string ten_menu { get; set; }
        public string module_code { get; set; }
        public string business_code { get; set; }
        public int? so_sap_hethan { get; set; }
        public int? so_qua_han { get; set; }
    }
}
