using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using APIPCHY.Helpers;
using QLTB_API.Models.QLTB.QUANLYCHUNG;
using QLTB_API.PDFRequestModels.Models;
using static QLTB_API.Models.QLTB.QUANLYCHUNG.QLTB_GiaoNhanThietBi_Manager;

namespace QLTB_API.Pdf.Services
{
    public interface IPdfService
    {
        Task<(bool success, string base64, string message)> QLTB_GenerateOrLoadAsync(PreviewPdfRequestQLTB request);
    }

    public class PdfService : IPdfService
    {
        private const string RootPdf = "wwwroot/fileQLTB/pdf";
        private const string RootTemplate = "wwwroot/fileQLTB/templates";
        private const string NotFoundPdf = "not_found.pdf";
        private readonly QLTB_GiaoNhanThietBi_Manager _giaoNhanManager = new QLTB_GiaoNhanThietBi_Manager();
        private readonly QLTB_KiemKeThietBi_Manager _kiemKeManager = new QLTB_KiemKeThietBi_Manager();

        public async Task<(bool success, string base64, string message)> QLTB_GenerateOrLoadAsync(PreviewPdfRequestQLTB request)
        {
            string documentType = ResolveDocumentType(request);
            if (string.IsNullOrWhiteSpace(documentType)) return (false, string.Empty, "Loai bien ban khong hop le");

            string fileName = $"{request.ma_dviqly}_{request.id}_{documentType}";
            string pdfPath = Path.Combine(RootPdf, $"{fileName}_table.pdf");
            if (request.trang_thai != 0)
            {
                if (File.Exists(pdfPath))
                    return (true, Convert.ToBase64String(await File.ReadAllBytesAsync(pdfPath)), "Da co san PDF");

                string notFoundPath = Path.Combine(RootPdf, NotFoundPdf);
                if (!File.Exists(notFoundPath))
                    return (false, string.Empty, "Khong tim thay file PDF da ky hoac file not_found.pdf");

                return (true, Convert.ToBase64String(await File.ReadAllBytesAsync(notFoundPath)), "File PDF da ky khong ton tai");
            }

            BienBanGiaoNhanData data = request.loai_bban == 4 || request.loai_nghiepvu == "KIEM_KE"
                ? ToBienBanData(_kiemKeManager.get_DATA_BIENBAN_KIEMKE_DOCX(request.id))
                : _giaoNhanManager.get_DATA_BIENBAN_GIAONHAN_DOCX(request.id, request.loai_bban);
            if (data == null) return (false, string.Empty, "Khong tim thay du lieu bien ban");

            var result = BuildPdf(request, data, fileName);
            if (!result.success) return result;
            Directory.CreateDirectory(RootPdf);
            await File.WriteAllBytesAsync(pdfPath, Convert.FromBase64String(result.base64));
            return result;
        }

        private static BienBanGiaoNhanData ToBienBanData(QLTB_KiemKeThietBi_Manager.BienBanKiemKeData data)
        {
            return data == null ? null : new BienBanGiaoNhanData { content = data.content, tableData1 = data.tableData1, tableData2 = data.tableData2 };
        }

        private static string ResolveDocumentType(PreviewPdfRequestQLTB request) => request.loai_bban switch
        {
            0 => "bangiao", 1 => "thuhoi", 2 => "tralai", 3 when request.loai_nghiepvu == "TLC4" => "kiemtrathanhly", 3 => "kiemtrathanhlyC3", 4 => "kiemke", _ when request.loai_nghiepvu == "KIEM_KE" => "kiemke", _ => string.Empty
        };

        private static string ResolveTemplate(PreviewPdfRequestQLTB request) => request.loai_bban switch
        {
            0 => "Bien_ban_bangiao_thietbi.docx", 1 => "Bien_ban_thuhoi_thietbi.docx", 2 => "Bien_ban_tralai_thietbi.docx", 3 when request.loai_nghiepvu == "TLC4" => "Bien_ban_kiemtrathanhly_thietbi.docx", 3 => "Bien_ban_kiemtrathanhlyC3_thietbi.docx", _ => "Bien_ban_kiemkethucte_thietbi.docx"
        };

        private (bool success, string base64, string message) BuildPdf(PreviewPdfRequestQLTB request, BienBanGiaoNhanData data, string fileName)
        {
            string templatePath = Path.Combine(RootTemplate, ResolveTemplate(request));
            if (!File.Exists(templatePath)) return (false, string.Empty, "Khong tim thay template DOCX");
            try
            {
                string replaced = DocxAndPdfHelper.ReplaceTextInDocx(templatePath, data.content, fileName);
                string docx = request.loai_bban == 4 || request.loai_nghiepvu == "KIEM_KE"
                    ? DocxAndPdfHelper.getDocxAfterInsertData(replaced, data.tableData2, fileName, 999, false, new HashSet<int> { 0, 2, 3, 4, 5, 6, 7 }, false, "22")
                    : DocxAndPdfHelper.getDocxAfterInsertDataTwoTable(replaced, data.tableData1, data.tableData2, fileName, 999, false, new HashSet<int> { 0, 2, 3 }, new HashSet<int> { 0, 2, 3 }, false, false, "22");
                return (true, Convert.ToBase64String(DocxAndPdfHelper.ConvertDocxToPdf(docx)), "Tao PDF thanh cong");
            }
            catch (Exception exception)
            {
                return (false, string.Empty, exception.Message);
            }
        }
    }
}
