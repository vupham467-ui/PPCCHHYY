using System;
using System.IO;
using System.Threading.Tasks;
using APIPCHY.APIHelper;
using QLTB_API.Models.QLTB.QUANLYCHUNG;
using QLTB_API.PDFRequestModels.Models;

namespace QLTB_API.PdfSign.Services
{
    public interface IPdfSignService
    {
        Task<(bool success, string base64, string message)> QLTB_SignAsync(SignPdfRequestQLTB request);
        Task<(bool success, string base64, string message)> QLTB_KiemKeSignAsync(SignPdfRequestQLTBKiemKe request);
    }

    public class PdfSignService : IPdfSignService
    {
        private const string QLTBRootPdf = "wwwroot/fileQLTB/pdf";
        private const string RootSignImage = "wwwroot";
        private readonly QLTB_GiaoNhanThietBi_Manager _giaoNhanManager = new QLTB_GiaoNhanThietBi_Manager();
        private readonly QLTB_KiemKeThietBi_Manager _kiemKeManager = new QLTB_KiemKeThietBi_Manager();
        private readonly APIHelper _apiHelper = new APIHelper();

        public async Task<(bool success, string base64, string message)> QLTB_SignAsync(SignPdfRequestQLTB request)
        {
            string documentType = request.loai_bban switch
            {
                0 => "bangiao",
                1 => "thuhoi",
                2 => "tralai",
                3 when request.loai_nghiepvu == "TLC4" => "kiemtrathanhly",
                3 => "kiemtrathanhlyC3",
                _ => string.Empty
            };

            if (string.IsNullOrEmpty(documentType)) return (false, string.Empty, "Loai bien ban khong hop le");
            string pdfPath = Path.Combine(QLTBRootPdf, $"{request.ma_dviqly}_{request.id_bienban}_{documentType}_table.pdf");
            var result = await SignFileAsync(pdfPath, request.signName, request.signImg);
            if (!result.success) return result;

            string databaseResult = _giaoNhanManager.ky_so_GIAO_NHAN_THIET_BI(request.id_bienban, request.cap_ky);
            return string.IsNullOrEmpty(databaseResult) ? result : (false, string.Empty, databaseResult);
        }

        public async Task<(bool success, string base64, string message)> QLTB_KiemKeSignAsync(SignPdfRequestQLTBKiemKe request)
        {
            if (string.IsNullOrWhiteSpace(request.signUser) || (request.cap_ky != 1 && request.cap_ky != 2)) return (false, string.Empty, "Thong tin ky bien ban kiem ke khong hop le");
            string pdfPath = Path.Combine(QLTBRootPdf, $"{request.ma_dviqly}_{request.id_bienban}_kiemke_table.pdf");
            var result = await SignFileAsync(pdfPath, request.signName, request.signImg);
            if (!result.success) return result;

            string databaseResult = request.cap_ky == 1
                ? _kiemKeManager.KY_C1_BBAN_KIEMKE_CNTT(request.id_bienban, request.signUser)
                : _kiemKeManager.KY_C2_BBAN_KIEMKE_CNTT(request.id_bienban, request.signUser);
            return string.IsNullOrEmpty(databaseResult) ? result : (false, string.Empty, databaseResult);
        }

        private async Task<(bool success, string base64, string message)> SignFileAsync(string pdfPath, string signerName, string signerImage)
        {
            if (!File.Exists(pdfPath)) return (false, string.Empty, "PDF chua duoc tao");
            string imagePath = Path.Combine(RootSignImage, (signerImage ?? string.Empty).TrimStart('/'));
            string imageBase64 = File.Exists(imagePath) ? Convert.ToBase64String(await File.ReadAllBytesAsync(imagePath)) : await _apiHelper.AddTextToImage(Path.Combine("wwwroot/images/chuky/blank.png"));
            string pdfBase64 = Convert.ToBase64String(await File.ReadAllBytesAsync(pdfPath));
            var result = await _apiHelper.AddSignatureAsync(pdfBase64, signerName, imageBase64, 1, false);
            if (result?.success != true) return (false, string.Empty, result?.message ?? "Ky that bai");

            await File.WriteAllBytesAsync(pdfPath, Convert.FromBase64String(result.data));
            return (true, result.data, result.message);
        }
    }
}
