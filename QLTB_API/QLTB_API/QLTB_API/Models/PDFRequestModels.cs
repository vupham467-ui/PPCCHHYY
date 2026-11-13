using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System.Collections.Generic;

namespace QLTB_API.PDFRequestModels.Models
{
    // PdfRequestModels.cs
    public class PreviewPdfRequest
    {
        public int id_bienban { get; set; }
        public int trang_thai { get; set; }
        public int loai_bban { get; set; }
        public string nhom_bban { get; set; }
        public bool isTND { get; set; }
        public bool isQTC4 { get; set; }
    }

    public class SignPdfRequest
    {
        public int id_bienban { get; set; }
        public int trang_thai { get; set; }
        public int loai_bban { get; set; }
        public string nhom_bban { get; set; }
        public string signName { get; set; }
        public string signImg { get; set; }
        public bool isQTC4 { get; set; }

        public string user_id { get; set; }
        public string serial_number {  get; set; }
        public int hinhthucky { get; set; }
        public bool checkTen { get; set; }
        public List<string> danhSachTen { get; set; }
    }


    public class PreviewPdfRequestQLTB
    {
        public string id { get; set; }
        public int trang_thai { get; set; }
        public int loai_bban { get; set; }
        public string loai_nghiepvu { get; set; }
        public string ma_dviqly { get; set; }
    }

    public class SignPdfRequestQLTB
    {
        public int id_bienban { get; set; }
        public int trang_thai { get; set; }
        public int loai_bban { get; set; }
        public string loai_nghiepvu { get; set; }
        public int cap_ky { get; set; }
        public string ma_dviqly { get; set; }
        public string signName { get; set; }
        public string signImg { get; set; }

        public string user_id { get; set; }
        public string serial_number { get; set; }
        public int hinhthucky { get; set; }
    }

    public class SignPdfRequestQLTBKiemKe
    {
        public int id_bienban { get; set; }
        public int cap_ky { get; set; }
        public string ma_dviqly { get; set; }
        public string signName { get; set; }
        public string signUser { get; set; }
        public string signImg { get; set; }

        public string user_id { get; set; }
        public string serial_number { get; set; }
        public int hinhthucky { get; set; }
    }
}
