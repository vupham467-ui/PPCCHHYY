using System;
using System.IO;
using GrapeCity.Documents.Word;
using GrapeCity.Documents.Word.Layout;
using System.IO.Compression;
using System.Collections.Generic;

namespace API_PCHY.Helpers
{
    public class FileHelper
    {
        public string ConvertFileToBase64(string filePath)
        {
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            {
                throw new FileNotFoundException("File không tồn tại.");
            }

            string extension = Path.GetExtension(filePath).ToLower();

            if (extension == ".docx" || extension == ".doc")
            {
                return ConvertDocxToBase64(filePath);
            }
            else if (extension == ".pdf")
            {
                return ConvertPdfToBase64(filePath);
            }
            else
            {
                throw new NotSupportedException("Chỉ hỗ trợ file DOCX và PDF.");
            }
        }

        private static string ConvertDocxToBase64(string filePath)
        {
            var wordDoc = new GcWordDocument();
            // Load DOCX file
            wordDoc.Load(filePath);

            using (var layout = new GcWordLayout(wordDoc))
            {
                // Define the PDF output settings
                PdfOutputSettings pdfOutputSettings = new PdfOutputSettings
                {
                    CompressionLevel = CompressionLevel.Fastest,
                    ConformanceLevel = GrapeCity.Documents.Pdf.PdfAConformanceLevel.PdfA1a
                };

                using (var memoryStream = new MemoryStream())
                {
                    // Save the Word layout to a MemoryStream as PDF
                    // Lưu vào MemoryStream thay vì truyền đường dẫn tệp
                    layout.SaveAsPdf(memoryStream, null, pdfOutputSettings);

                    // Reset vị trí của MemoryStream trước khi đọc
                    memoryStream.Position = 0;

                    // Chuyển dữ liệu trong MemoryStream thành Base64
                    return ConvertToBase64(memoryStream);
                }
            }
        }

        private static string ConvertPdfToBase64(string filePath)
        {
            byte[] fileBytes = File.ReadAllBytes(filePath);
            return Convert.ToBase64String(fileBytes);
        }

        private static string ConvertToBase64(MemoryStream memoryStream)
        {
            // Đọc dữ liệu từ MemoryStream và chuyển thành Base64
            byte[] fileBytes = memoryStream.ToArray();
            return Convert.ToBase64String(fileBytes);
        }

        // Tạo file ZIP từ danh sách file đường dẫn, trả về dưới dạng byte[]
        public byte[] CreateZipFromFiles(List<string> filePaths, bool isFullPath, string rootPath = "")
        {
            List<string> missingFiles = new List<string>();

            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
                {
                    foreach (var filePath in filePaths)
                    {
                        string actualFilePath = filePath;
                        // Nếu là relative path và bắt đầu bằng "/", thì bỏ dấu "/"
                        if (!isFullPath && filePath.StartsWith("/"))
                        {
                            actualFilePath = filePath.TrimStart('/');
                        }

                        string actualPath = isFullPath ? actualFilePath : Path.Combine(rootPath, actualFilePath);
                        if (File.Exists(actualPath))
                        {
                            // Lấy tên file từ đường dẫn (không lấy cả thư mục)
                            string fileName = Path.GetFileName(actualPath);

                            // Tạo entry trong ZIP
                            var zipEntry = archive.CreateEntry(fileName, CompressionLevel.Optimal);

                            using (var originalFileStream = File.OpenRead(actualPath))
                            using (var zipEntryStream = zipEntry.Open())
                            {
                                originalFileStream.CopyTo(zipEntryStream);
                            }
                        }
                        else
                        {
                            //Nếu file không tồn tại
                            Console.WriteLine($"File không tồn tại: {actualPath}");
                            missingFiles.Add(actualPath);
                        }
                    }

                    // Nếu có file thiếu thì tạo file txt liệt kê trong ZIP
                    if (missingFiles.Count > 0)
                    {
                        var txtEntry = archive.CreateEntry("missing_files.txt", CompressionLevel.Optimal);
                        using (var writer = new StreamWriter(txtEntry.Open()))
                        {
                            writer.WriteLine("Danh sách file không tìm thấy:");
                            foreach (var missing in missingFiles)
                            {
                                writer.WriteLine(missing);
                            }
                        }
                    }
                }

                // Đặt con trỏ về đầu MemoryStream trước khi đọc
                memoryStream.Seek(0, SeekOrigin.Begin);
                return memoryStream.ToArray();
            }
        }

    }
}
