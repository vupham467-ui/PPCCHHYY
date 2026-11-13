using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QLTB_API.Pdf.Services;
using QLTB_API.PDFRequestModels.Models;
using QLTB_API.PdfSign.Services;

namespace QLTB_API.Pdf.Controllers
{
    [Route("APIPCHY/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase
    {
        private readonly IPdfService _pdfService;
        private readonly IPdfSignService _pdfSignService;

        public PDFController(IPdfService pdfService, IPdfSignService pdfSignService)
        {
            _pdfService = pdfService;
            _pdfSignService = pdfSignService;
        }

        [HttpPost("QLTB_preview")]
        public async Task<IActionResult> QLTBPreviewPdf([FromBody] PreviewPdfRequestQLTB request)
        {
            var (success, base64, message) = await _pdfService.QLTB_GenerateOrLoadAsync(request);
            return success ? Ok(new { success, base64, message }) : BadRequest(new { success, message });
        }

        [HttpPost("QLTB_sign")]
        public async Task<IActionResult> QLTBSignPdf([FromBody] SignPdfRequestQLTB request)
        {
            if (string.IsNullOrWhiteSpace(request?.signName)) return BadRequest(new { success = false, message = "Thieu thong tin chu ky" });
            var (success, base64, message) = await _pdfSignService.QLTB_SignAsync(request);
            return success ? Ok(new { success, base64, message }) : BadRequest(new { success, message });
        }

        [HttpPost("QLTB_kiemke_sign")]
        public async Task<IActionResult> QLTBKiemKeSignPdf([FromBody] SignPdfRequestQLTBKiemKe request)
        {
            if (string.IsNullOrWhiteSpace(request?.signName)) return BadRequest(new { success = false, message = "Thieu thong tin chu ky" });
            var (success, base64, message) = await _pdfSignService.QLTB_KiemKeSignAsync(request);
            return success ? Ok(new { success, base64, message }) : BadRequest(new { success, message });
        }

        [HttpGet("download-pdf")]
        public IActionResult DownloadPdf([FromQuery] string filepath)
        {
            string rootPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"));
            string fullPath = Path.GetFullPath(Path.Combine(rootPath, (filepath ?? string.Empty).TrimStart('/', '\\')));
            if (!fullPath.StartsWith(rootPath, StringComparison.OrdinalIgnoreCase)) return BadRequest("Duong dan khong hop le");
            if (!System.IO.File.Exists(fullPath)) return NotFound();
            return File(System.IO.File.ReadAllBytes(fullPath), "application/pdf", Path.GetFileName(fullPath));
        }
    }
}
