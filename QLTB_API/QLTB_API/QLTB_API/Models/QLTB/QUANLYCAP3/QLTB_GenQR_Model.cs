namespace QLTB_API.Models.QLTB.QUANLYCAP3
{
    public class QLTB_GenQR_Response
    {
        public bool success { get; set; }
        public string type { get; set; }
        public string qr_code { get; set; }
    }

    public class QLTB_GenQR_Request
    {
        public string ma_tbi_qr { get; set; }
        public string serialnum { get; set; }
        public string type { get; set; }
    }
}
