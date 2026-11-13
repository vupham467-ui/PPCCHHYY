using CHCT_API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CHCT_API.Controllers
{
    public class EncryptRequest
    {
        public string Password { get; set; }
    }

    public class DecryptRequest
    {
        public string PassWordEncrypt { get; set; }
    }


    [Route("api/[controller]")]
    [ApiController]

    public class AesEncryptionController : ControllerBase
    {
        [HttpPost("encrypt")]
        public IActionResult Encrypt([FromBody] EncryptRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    Success = false,
                    EncryptedPassword = "",
                    Message = "Password là bắt buộc"
                });
            }

            var password = AesEncryptionHelper.Encrypt(request.Password);

            return Ok(new
            {
                Success = true,
                EncryptedPassword = password,
                Message = ""
            });
        }



        //[HttpPost("decrypt")]
        //public IActionResult Verify([FromBody] DecryptRequest request)
        //{
        //    if (request == null ||
        //        string.IsNullOrWhiteSpace(request.PassWordEncrypt))
        //    {
        //        return BadRequest(new
        //        {
        //            Success = false,
        //            Message = "Password là bắt buộc"
        //        });
        //    }

        //    string password = AesEncryptionHelper.Decrypt(request.PassWordEncrypt);

        //    return Ok(new
        //    {
        //        Success = true,
        //        Password = password,
        //        Message = ""
        //    });
        //}
    }
}
