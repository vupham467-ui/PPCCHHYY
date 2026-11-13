using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SkiaSharp;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace QLTB_API.Helpers
{
    public static class FtpHelper
    {
        private static IConfiguration _configuration;

        public static void SetConfiguration(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public static async Task<string> UploadFTPAsync(IFormFile file, string remoteFolder)
        {
            if (_configuration == null)
                throw new InvalidOperationException("FtpHelper chưa được cấu hình. Gọi SetConfiguration() trước.");

            if (file == null || file.Length == 0)
                throw new ArgumentException("File không hợp lệ.");

            // Lấy cấu hình từ appsettings.json
            var ftpServer = _configuration["FTP:Server"];
            var username = _configuration["FTP:Username"];
            var password = _configuration["FTP:Password"];

            string sanitizedFileName = Path.GetFileName(file.FileName);
            string ftpFilePath = $"{ftpServer}{remoteFolder}/{sanitizedFileName}";

            // Tạo folder nếu chưa tồn tại
            FtpWebRequest createDir = (FtpWebRequest)WebRequest.Create($"{ftpServer}{remoteFolder}");
            createDir.Method = WebRequestMethods.Ftp.MakeDirectory;
            createDir.Credentials = new NetworkCredential(username, password);
            createDir.UsePassive = true;
            createDir.UseBinary = true;
            createDir.KeepAlive = false;

            try
            {
                using var _ = createDir.GetResponse();
            }
            catch (WebException ex)
            {
                if (((FtpWebResponse)ex.Response).StatusCode != FtpStatusCode.ActionNotTakenFileUnavailable)
                    throw; // folder tồn tại hay lỗi khác
            }

            // Upload file
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            byte[] fileContents;
            var ext = Path.GetExtension(file.FileName).ToLower();

            if (ext == ".webp")
            {
                fileContents = memoryStream.ToArray(); // giữ nguyên WebP
            }
            else
            {
                using var image = Image.FromStream(memoryStream);
                using var compressedStream = new MemoryStream();
                EncoderParameters encoderParams = new EncoderParameters(1);
                encoderParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 80L);
                ImageCodecInfo jpegCodec = ImageCodecInfo.GetImageDecoders()
                    .FirstOrDefault(c => c.FormatID == ImageFormat.Jpeg.Guid);

                if (jpegCodec != null)
                    image.Save(compressedStream, jpegCodec, encoderParams);

                fileContents = compressedStream.ToArray();
            }

            FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpFilePath);
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.Credentials = new NetworkCredential(username, password);
            request.UsePassive = true;
            request.UseBinary = true;
            request.KeepAlive = false;

            using var requestStream = request.GetRequestStream();
            await requestStream.WriteAsync(fileContents, 0, fileContents.Length);

            return ftpFilePath; // trả về đường dẫn FTP đã upload
        }

        // Lấy ảnh từ FTP và trả về MemoryStream (nén JPEG nếu cần)
        public static async Task<byte[]> GetImgFromFTPAsync(string remoteFilePath, bool compressJpeg = true)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(remoteFilePath))
                {
                    Console.WriteLine("remoteFilePath NULL hoặc rỗng.");
                    return null;
                }

                // Lấy cấu hình
                var ftpServer = _configuration["FTP:Server"];
                var username = _configuration["FTP:Username"];
                var password = _configuration["FTP:Password"];


                if (string.IsNullOrEmpty(ftpServer))
                {
                    Console.WriteLine("FTP:Server bị NULL trong cấu hình.");
                    return null;
                }

                // Tạo URL FTP đầy đủ
                string ftpFilePath = $"{ftpServer}{(remoteFilePath.StartsWith("/") ? "" : "/")}{remoteFilePath}";


                // Request
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpFilePath);
                request.Method = WebRequestMethods.Ftp.DownloadFile;
                request.Credentials = new NetworkCredential(username, password);
                request.UsePassive = true;
                request.UseBinary = true;
                request.KeepAlive = false;


                using FtpWebResponse response = (FtpWebResponse)await request.GetResponseAsync();

                using Stream responseStream = response.GetResponseStream();
                using MemoryStream originalStream = new MemoryStream();
                await responseStream.CopyToAsync(originalStream);
                originalStream.Position = 0;


                string ext = Path.GetExtension(remoteFilePath).ToLower();


                if (!compressJpeg || ext == ".webp")
                {
                    Console.WriteLine("Trả về ảnh gốc, không nén.");
                    return originalStream.ToArray();
                }


                using Image image = Image.FromStream(originalStream);
                using MemoryStream compressedStream = new MemoryStream();
                EncoderParameters encoderParams = new EncoderParameters(1);
                encoderParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 80L);
                ImageCodecInfo jpegCodec = ImageCodecInfo.GetImageDecoders()
                    .FirstOrDefault(codec => codec.FormatID == ImageFormat.Jpeg.Guid);

                if (jpegCodec == null)
                {
                    Console.WriteLine("JPEG codec không tìm thấy.");
                    return originalStream.ToArray();
                }

                image.Save(compressedStream, jpegCodec, encoderParams);


                return compressedStream.ToArray();
            }
            catch (Exception ex)
            {
                Console.WriteLine("=== FTP ERROR ===");
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        //Ảnh avatar:
        public static async Task<byte[]?> GetImgBytesFromFTPAsync(string remoteFilePath, int size = 96)
        {
            try
            {
                if (_configuration == null)
                    throw new InvalidOperationException("FtpHelper chưa được cấu hình. Gọi SetConfiguration() trước.");
                var ftpServer = _configuration["FTP:Server"];
                var username = _configuration["FTP:Username"];
                var password = _configuration["FTP:Password"];

                string ftpFilePath = $"{ftpServer}/{remoteFilePath.TrimStart('/')}";

                var request = (FtpWebRequest)WebRequest.Create(ftpFilePath);
                request.Method = WebRequestMethods.Ftp.DownloadFile;
                request.Credentials = new NetworkCredential(username, password);
                request.UseBinary = true;
                request.UsePassive = true;
                request.KeepAlive = false;

                using var response = (FtpWebResponse)await request.GetResponseAsync();
                using var stream = response.GetResponseStream();

                if (stream == null)
                    return null;

                using var ms = new MemoryStream();
                await stream.CopyToAsync(ms);

                //Resize ảnh:
                //var originalBytes = ms.ToArray();
                //return ResizeAvatarSkia(originalBytes, size);

                return ms.ToArray();
            }
            catch (WebException ex)
            {
                // log nội bộ
                Console.Error.WriteLine($"FTP error: {ex.Message}");
                return null;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Unexpected error: {ex.Message}");
                return null;
            }
        }

        public static byte[] ResizeAvatarSkia(
            byte[] imageBytes,
            int maxSize = 96
        )
        {
            using var input = new SKMemoryStream(imageBytes);
            using var original = SKBitmap.Decode(input);

            if (original == null)
                throw new Exception("Không decode được ảnh");

            float ratio = Math.Min(
                (float)maxSize / original.Width,
                (float)maxSize / original.Height
            );

            // Không phóng to ảnh nhỏ
            if (ratio > 1f)
                ratio = 1f;

            int newWidth = (int)(original.Width * ratio);
            int newHeight = (int)(original.Height * ratio);

            using var resized = original.Resize(
                new SKImageInfo(newWidth, newHeight),
                SKFilterQuality.High
            );

            if (resized == null)
                throw new Exception("Resize ảnh thất bại");

            using var image = SKImage.FromBitmap(resized);

            // PNG cho avatar:
            using var data = image.Encode(
                SKEncodedImageFormat.Png,
                100
            );

            return data.ToArray();
        }


    }
}
