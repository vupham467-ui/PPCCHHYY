using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Drawing.Imaging;
using System.Drawing;
using DocumentFormat.OpenXml.Spreadsheet;
using SkiaSharp;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;


namespace APIPCHY.APIHelper
{
    public class AddSignatureResult
    {
        public bool success { get; set; }
        public string message { get; set; }
        public string data { get; set; }
    }

    public class ChecksignNameRequest
    {
        public string pdfBase64 { get; set; }
        public List<string> signNames { get; set; }
    }

    public class APIHelper
    {
        private readonly HttpClient client = new HttpClient();

        /// Gọi API với JSON hoặc Form-Data
        public async Task<string> CallApiAsync(string apiUrl, HttpMethod method, object? requestData = null, string? filePath = null)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpRequestMessage request = new HttpRequestMessage(method, apiUrl);
                    HttpResponseMessage response;

                    // Nếu là GET hoặc DELETE, không cần gửi nội dung
                    if ((method == HttpMethod.Get || method == HttpMethod.Delete) && requestData == null)
                    {
                        response = await client.SendAsync(request);
                    }
                    else
                    {
                        // Nếu có dữ liệu JSON gửi lên
                        if (requestData != null)
                        {
                            string json = JsonConvert.SerializeObject(requestData);
                            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
                        }

                        // Nếu có file đính kèm, gửi dưới dạng multipart/form-data
                        if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
                        {

                            var form = new MultipartFormDataContent();
                            var fileBytes = File.ReadAllBytes(filePath);
                            var fileContent = new ByteArrayContent(fileBytes);
                            // Xác định Content-Type theo phần mở rộng
                            string mimeType = GetMimeType(filePath);
                            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(mimeType);
                            form.Add(fileContent, "file", Path.GetFileName(filePath));
                            request.Content = form;

                        }

                        response = await client.SendAsync(request); // Gán giá trị cho response
                    }

                    // Xử lý kết quả trả về
                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        return $"Error: {response.StatusCode}";
                    }
                }
                catch (Exception ex)
                {
                    return $"Exception: {ex.Message}";
                }
            }
        }

        // Hàm lấy MIME type từ đuôi file
        private string GetMimeType(string filePath)
        {
            var ext = Path.GetExtension(filePath).ToLower();
            return ext switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                _ => "application/octet-stream" // MIME mặc định nếu không nhận diện được
            };
        }

        public async Task<AddSignatureResult> CheckAllSignersExistInPdf(ChecksignNameRequest req)
        {
            try
            {
                string rootApi = "http://10.47.0.19:997/api";
                string checkSignNameUrl = $"{rootApi}/checkSignNameInPdf";

                string result = await CallApiAsync(checkSignNameUrl, HttpMethod.Post, req);
                // Nếu không phải JSON thì báo lỗi rõ ràng
                if (string.IsNullOrWhiteSpace(result) || !result.TrimStart().StartsWith("{"))
                {
                    throw new Exception($"Lỗi khi gọi API: {result}");
                }
                JObject jsonResult = JObject.Parse(result);
                bool success = jsonResult["success"]?.ToObject<bool>() ?? false;
                string data = jsonResult["data"]?.ToString();
                string message = jsonResult["message"]?.ToString();

                return new AddSignatureResult { success = success, message = message, data = data };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi kiểm tra chữ ký: {ex.Message}");
                return new AddSignatureResult
                {
                    success = false,
                    message = ex.Message,
                    data = null
                };
            }
        }


        public async Task<AddSignatureResult> AddSignatureAsync(string dataBase64, string sign_name, string imgPath, int signType = 1, bool isImgPath = true, string version = "v1", bool showSignTime = false)
        {
            try
            {
                string rootApi = "http://10.47.0.19:997/api";
                //string rootApi = "http://localhost:5000/api";

                string base64Img = imgPath;

                //Nếu truyền vào đường dẫn ảnh thì cần gọi api chuyển sang base64 trước:
                if (isImgPath)
                {
                    // URL endpoint để chuyển ảnh thành base64
                    string convertToBase64ImgUrl = $"{rootApi}/to-base64";

                    // Gọi API để chuyển ảnh thành base64
                    string resultImg = await CallApiAsync(convertToBase64ImgUrl, HttpMethod.Post, null, imgPath);
                    JObject jsonObj = JObject.Parse(resultImg);
                    base64Img = jsonObj["data"]?.ToString();
                }

                //Nếu cần hiển thị ảnh thời gian ký:
                string base64SignTimeImg = "";
                if (showSignTime == true)
                {
                    string blank_time = Path.Combine("wwwroot/images/chuky/blank_time.png");;
                    base64SignTimeImg = await AddSignTimeToImage(blank_time);
                }


                // Chuẩn bị dữ liệu JSON để gửi lên API thêm chữ ký
                var jsonData = new
                {
                    dataBase64,
                    signImgBase64 = base64Img,
                    signName = sign_name,
                    signType,
                    isAuthSignature = false,
                    multiple = false,
                    base64SignTimeImg
                };


                // URL endpoint để thêm chữ ký
                string addImgUrl = version == "v1" ? $"{rootApi}/add-sign/json" : $"{rootApi}/add-sign-{version}/json";


                // Gọi API để thêm chữ ký và nhận kết quả trả về
                string result = await CallApiAsync(addImgUrl, HttpMethod.Post, jsonData);

                JObject jsonResult = JObject.Parse(result);

                bool success = jsonResult["success"]?.ToObject<bool>() ?? false;
                string data = jsonResult["data"]?.ToString();
                string message = jsonResult["message"]?.ToString();


                return new AddSignatureResult { success = success, message = message, data = data };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi thêm chữ ký: {ex.Message}");
                return null;
            }
        }

        public async Task<string> AddTextToImage(string inputImagePath)
        {
            try
            {
                if (!File.Exists(inputImagePath))
                {
                    Console.WriteLine("File không tồn tại: " + inputImagePath);
                    return null;
                }

                string fileName = Path.GetFileNameWithoutExtension(inputImagePath);
                string outputFileName = $"{fileName}_DaKySo_{DateTime.Now:yyyyMMdd_HHmmss}_{Guid.NewGuid():N}.png";
                string outputDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "temp");
                Directory.CreateDirectory(outputDir);
                string outputImagePath = Path.Combine(outputDir, outputFileName);

                string text1 = "Đã ký số";
                string text2 = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                using (SKBitmap bitmap = SKBitmap.Decode(inputImagePath))
                using (SKCanvas canvas = new SKCanvas(bitmap))
                {
                    // canvas.DrawColor(SKColors.White, SKBlendMode.DstOver); // Nếu cần nền trắng

                    int fontSize = Math.Max(bitmap.Width / 20, 16);

                    using SKPaint boldPaint = new SKPaint
                    {
                        Color = SKColors.Black,
                        TextSize = fontSize,
                        IsAntialias = true,
                        Typeface = SKTypeface.FromFamilyName("Arial", SKFontStyle.Bold)
                    };

                    using SKPaint italicPaint = new SKPaint
                    {
                        Color = SKColors.Black,
                        TextSize = fontSize,
                        IsAntialias = true,
                        Typeface = SKTypeface.FromFamilyName("Arial", SKFontStyle.Italic)
                    };

                    // Đo kích thước chữ
                    SKRect textBounds1 = new SKRect();
                    SKRect textBounds2 = new SKRect();
                    boldPaint.MeasureText(text1, ref textBounds1);
                    italicPaint.MeasureText(text2, ref textBounds2);

                    float totalTextHeight = textBounds1.Height + textBounds2.Height + 10;
                    float xCenter = bitmap.Width / 2;
                    float yStart = (bitmap.Height - totalTextHeight) / 2;

                    canvas.DrawText(text1, xCenter - textBounds1.Width / 2, yStart + textBounds1.Height, boldPaint);
                    canvas.DrawText(text2, xCenter - textBounds2.Width / 2, yStart + textBounds1.Height + textBounds2.Height + 10, italicPaint);

                    using SKImage image = SKImage.FromBitmap(bitmap);
                    using SKData data = image.Encode(SKEncodedImageFormat.Png, 100);
                    await File.WriteAllBytesAsync(outputImagePath, data.ToArray());
                }

                byte[] fileBytes = await File.ReadAllBytesAsync(outputImagePath);
                File.Delete(outputImagePath); // Xoá file tạm

                string base64 = Convert.ToBase64String(fileBytes);
                return base64;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi chèn chữ vào ảnh: {ex.Message}");
                return null;
            }
        }


        public async Task<string> AddSignTimeToImage(string inputImagePath)
            {
                try
                {
                    if (!File.Exists(inputImagePath))
                    {
                        Console.WriteLine("File không tồn tại: " + inputImagePath);
                        return null;
                    }
                    // Tạo tên file duy nhất, ví dụ: input_20250730_143015_GUID.png
                    string fileName = Path.GetFileNameWithoutExtension(inputImagePath);
                    string outputFileName = $"{fileName}_{DateTime.Now:yyyyMMdd_HHmmss}_{Guid.NewGuid():N}.png";
                    string outputDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "temp");
                    Directory.CreateDirectory(outputDir);
                    string outputImagePath = Path.Combine(outputDir, outputFileName);

                    string time = DateTime.Now.ToString("HH:mm dd/MM/yyyy");
                    string timeText = $"{time}";


                    using (SKBitmap bitmap = SKBitmap.Decode(inputImagePath))
                    using (SKCanvas canvas = new SKCanvas(bitmap))
                    {
                        //canvas.DrawColor(SKColors.White, SKBlendMode.DstOver); // Đảm bảo nền không bị ghi đè

                        // Chọn kích thước chữ dựa trên kích thước ảnh
                        int fontSize = Math.Max(bitmap.Width / 20, 14);

                        //using SKPaint boldPaint = new SKPaint
                        //{
                        //    Color = SKColors.Black,
                        //    TextSize = fontSize,
                        //    IsAntialias = true,
                        //    Typeface = SKTypeface.FromFamilyName("Arial", SKFontStyle.Bold)
                        //};

                        using SKPaint italicPaint = new SKPaint
                        {
                            Color = SKColors.Black,
                            TextSize = fontSize,
                            IsAntialias = true,
                            Typeface = SKTypeface.FromFamilyName("Arial", SKFontStyle.Italic)
                        };

                        // Đo kích thước chữ
                        SKRect textBounds = new SKRect();
                        italicPaint.MeasureText(timeText, ref textBounds);

                        // Tổng chiều cao
                        float totalTextHeight = textBounds.Height;

                        //// Căn giữa toàn bộ nội dung
                        //float xCenter = bitmap.Width / 2;
                        float yStart = (bitmap.Height - totalTextHeight) / 2;

                        //// Vẽ thời gian (Bold)
                        //canvas.DrawText(timeText, xCenter - textBounds.Width / 2, yStart + textBounds.Height, italicPaint);

                        float xLeft = 10; // Hoặc chừa 1 khoảng đệm như 10px
                        canvas.DrawText(timeText, xLeft, yStart + textBounds.Height, italicPaint);

                    // Lưu ảnh mới
                    using SKImage image = SKImage.FromBitmap(bitmap);
                        using SKData data = image.Encode(SKEncodedImageFormat.Png, 100);
                        await File.WriteAllBytesAsync(outputImagePath, data.ToArray());
                    }

                // Đọc file vừa tạo thành mảng byte, sau đó xóa
                byte[] fileBytes = await File.ReadAllBytesAsync(outputImagePath);
                File.Delete(outputImagePath); // Xoá file tạm

                string base64 = Convert.ToBase64String(fileBytes);


                return base64;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Lỗi khi chèn chữ vào ảnh: {ex.Message}");
                    return null;
                }
            }
    }
}

