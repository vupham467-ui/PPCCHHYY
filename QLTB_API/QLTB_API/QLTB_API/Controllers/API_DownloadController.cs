using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace QLTB_API.Controllers
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    public class API_DownloadController : ControllerBase
    {
        [HttpGet("download-android")]
        [AllowAnonymous]
        public IActionResult DownloadAndroid()
        {
            string CHCT_RootAPK = "wwwroot/mobile_install"; //Thư mục 

            var filePath = Path.Combine(
                CHCT_RootAPK,
                "app-release.apk"
            );

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var stream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read
            );

            return File(
                stream,
                "application/vnd.android.package-archive",
                "chct-mobile.apk"
            );
        }
    }
}
