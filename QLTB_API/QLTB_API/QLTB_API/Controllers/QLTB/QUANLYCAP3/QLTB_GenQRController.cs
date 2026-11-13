using Microsoft.AspNetCore.Mvc;
using QLTB_API.Models.QLTB.QUANLYCAP3;
using System;
using System.Threading.Tasks;

namespace QLTB_API.Controllers.QLTB.QUANLYCAP3
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    public class QLTB_GenQRController : ControllerBase
    {
        private readonly QLTB_GenQR_Manager _manager;

        public QLTB_GenQRController()
        {
            _manager = new QLTB_GenQR_Manager();
        }

        [HttpPost("gen_qr")]
        public  ActionResult GenerateQR([FromBody] QLTB_GenQR_Request req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.ma_tbi_qr))
                return BadRequest("Thiếu mã QR đầu vào.");
            try
            {
                QLTB_GenQR_Response result = _manager.GenQRCode(req);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}
