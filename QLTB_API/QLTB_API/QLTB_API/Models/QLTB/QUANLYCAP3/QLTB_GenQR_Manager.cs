using System;
using System.Collections.Generic;
using QLTB_API.Helpers;

namespace QLTB_API.Models.QLTB.QUANLYCAP3
{
    public class QLTB_GenQR_Manager
    {
        private readonly GenQRCode _qrHelper = new();
        public QLTB_GenQR_Response GenQRCode(QLTB_GenQR_Request req)
        {
            try
            {
                string qrBase64;
                // chọn hàm phù hợp dựa vào type
                switch ((req.type ?? "").ToLower())
                {
                    case "small":
                        qrBase64 = _qrHelper.CreateQR_Small(req.ma_tbi_qr, req.serialnum);
                        break;
                    case "single":
                        qrBase64 = _qrHelper.CreateQR_Single(req.ma_tbi_qr, req.serialnum);
                        break;
                    case "taisan":
                        qrBase64 = _qrHelper.CreateQR_TaiSan(req.ma_tbi_qr, req.serialnum);
                        break;
                    default:
                        qrBase64 = _qrHelper.CreateQR_Single(req.ma_tbi_qr, req.serialnum);
                        break;
                };

                QLTB_GenQR_Response result = new QLTB_GenQR_Response
                {
                    success = true,
                    type = req.type,
                    qr_code = qrBase64
                };

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
