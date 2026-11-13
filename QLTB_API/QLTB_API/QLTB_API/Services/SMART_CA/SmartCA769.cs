using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using APIPCHY.Helpers;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2010.Excel;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.codec;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OpenXmlPowerTools.HtmlToWml;
using QRCoder;
using RestSharp;
using SignService.Common.HashSignature.Common;
using SignService.Common.HashSignature.Interface;
using static API_PCHY.Services.SMART_CA.Model_SMART_CA;
using static SignService.Common.HashSignature.Common.TSAClientBouncyCastleRewrite;
using PdfReader = iTextSharp.text.pdf.PdfReader;



namespace API_PCHY.Services.SMART_CA
{
    public class SmartCA769
    {

        private static string client_id = "4b0c-638712580414678530.apps.smartcaapi.com";
        private static string client_secret = "ODFlMTAxYjE-NjYxOS00YjBj";
        private readonly string _uriServer;
        //private static string URI_InsertSignatureToFile = "http://localhost:9999/api/add-sign/json";
        private static string URI_InsertSignatureToFile = "http://10.47.0.19:997/api/add-sign/json";
        private static string URI_Kyso = "http://10.47.0.19:6868/APIPCHY/KYSO";
        private readonly IWebHostEnvironment _webHostEnvironment;


        public SmartCA769(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _webHostEnvironment = webHostEnvironment;
            _uriServer = configuration["URI_SEVER"];
        }

        //Hàm ký số 
        public async Task<ResponseSign> _signDigital(RequestSign req, int nhomNguoiKy, int hinhthucKy, string urlServer)
        {
            ResponseSign resSign = new ResponseSign();

            string pathFileInput = req.pathFileIn_Out.StartsWith("/")
                ? Path.Combine(_webHostEnvironment.WebRootPath, req.pathFileIn_Out.TrimStart('/'))
                : Path.Combine(_webHostEnvironment.WebRootPath, req.pathFileIn_Out ?? string.Empty); // File cần ký

            string pathImageSign = req.pathImageSign ?? "";

            string pathImageSignUser = Path.Combine(_webHostEnvironment.WebRootPath, pathImageSign.TrimStart('/')); //Ảnh chữ ký người dùng

            byte[] signed = null;
            try
            {
                if (!System.IO.File.Exists(pathFileInput))
                {
                    Console.WriteLine("Không tìm thấy file pdf: " + pathFileInput);
                    resSign.isSuccess = false;
                    resSign.message = "Không tìm thấy file pdf: " + pathFileInput;
                    return resSign;
                }
                if (!System.IO.File.Exists(pathImageSignUser))
                {
                    Console.WriteLine("Không tìm thấy ảnh chữ ký: " + pathImageSignUser);
                    resSign.isSuccess = false;
                    resSign.message = "Không tìm thấy ảnh chữ ký: " + pathImageSignUser;
                    return resSign;
                }
                byte[] fileBytesImage = File.ReadAllBytes(pathImageSignUser);
                byte[] fileBytes = File.ReadAllBytes(pathFileInput);

                string dataBase64 = Convert.ToBase64String(fileBytes);
                string signImgBase64 = Convert.ToBase64String(fileBytesImage);

                string outputPath = Path.ChangeExtension(pathFileInput, ".pdf");

                req.pathFileIn_Out = dataBase64;
                req.pathImageSign = signImgBase64;
                req.qR_String = "";

                //Nếu ký giám đốc cuối cùng thì thêm qr:
                if (req.signType == 1 && nhomNguoiKy == 4)
                {
                    req.qR_String = $"{urlServer}/APIPCHY/PDF/download-pdf?isview=true&filepath={outputPath}";
                }

                //req.fullNameUser = "Test";

                var uri = "";
                if (hinhthucKy == 1)
                {
                    uri = URI_Kyso + "/esign_VNPT";
                }
                if (hinhthucKy == 5)
                {
                    uri = URI_Kyso + "/esign_EVN";

                }
                if (hinhthucKy == 6)
                {
                    uri = URI_Kyso + "/esign_IMG";
                }

                uri = URI_Kyso + "/esign_IMG";

                if (string.IsNullOrEmpty(uri))
                {
                    resSign.isSuccess = false;
                    resSign.message = "Hình thức ký không hợp lệ!";
                    return resSign;
                }

                //Gọi api ký số:
                ResponseInsertSignature res = await CallApiKySoAsync(req, uri);

                //string json = JsonConvert.SerializeObject(res, Formatting.Indented);
                //Console.WriteLine(json);
                if (!res.Success)
                {
                    resSign.isSuccess = false;
                    resSign.message = res.Message;
                    return resSign;
                }

                signed = Convert.FromBase64String(res.Data);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                // Ghi log lỗi nếu không đọc được file
                resSign.isSuccess = false;
                resSign.message = "Có lỗi trong quá trình đọc file và chèn chữ ký!";
                return resSign;
            }


            try
            {

                string pathFileOutput = Path.ChangeExtension(pathFileInput, ".pdf");
                File.Delete(pathFileInput);
                File.WriteAllBytes(pathFileOutput, signed);
                string pathFileOutputDB = "/" + Path.GetRelativePath(_webHostEnvironment.WebRootPath, pathFileOutput).Replace("\\", "/");

                //try
                //{
                //    insert_LOG_KYSO(reqSign, "1", req.idUserApp);
                //}
                //catch (Exception ex)
                //{
                //    resSign.isSuccess = false;
                //    resSign.message = "Có lỗi khi kết nối đến cơ sở dữ liệu để thực hiện lưu trữ phiên giao dịch !";
                //    return resSign;

                //}

                //if (req.signType > 1) // Hoàn tất ký nháy sẽ chèn qr code 
                //{

                //    string qrCodeLink = _uriServer + pathFileOutput;
                //    byte[] qrCodeImageBytes = GenerateQrCode(qrCodeLink);
                //    // Chèn QR code vào file PDF đã ký
                //    AddQrCodeToPdf(pathFileOutput, qrCodeImageBytes);
                //}

                resSign.isSuccess = true;
                resSign.message = "Thực hiện ký số thành công";
                resSign.pathFileNew = pathFileOutputDB;
                return resSign;
            }
            catch (Exception ex)
            {

                // Ghi log lỗi nếu không ghi được file
                resSign.isSuccess = false;
                resSign.message = "Thực hiện ký số thất bại hãy liên hệ quản trị viên để hỗ trợ ";
                return resSign;
            }
        }

        //Ký lô:
        public async Task<ResponseSignMulti> _signDigitalMulti(RequestSignMulti req, int hinhthucKy, string urlServer)
        {
            try
            {
                ResponseSignMulti result = new ResponseSignMulti
                {
                    signedDocuments = new List<ResponseSign>(),
                    allSuccess = true,
                    message = ""
                };

                string pathImageSign = req.pathImageSign ?? "";
                string pathImageSignUser = Path.Combine(_webHostEnvironment.WebRootPath, pathImageSign.TrimStart('/'));
                if (!System.IO.File.Exists(pathImageSignUser))
                {
                    result.allSuccess = false;
                    result.message = "Không tìm thấy ảnh chữ ký: " + pathImageSignUser;
                    return result;
                }

                byte[] imageBytes = File.ReadAllBytes(pathImageSignUser);
                string base64Image = Convert.ToBase64String(imageBytes);
                req.pathImageSign = base64Image;



                foreach (var doc in req.documents)
                {
                    // Xử lý path input
                    string pathFileInput = doc.pathFileIn_Out.StartsWith("/")
                        ? Path.Combine(_webHostEnvironment.WebRootPath, doc.pathFileIn_Out.TrimStart('/'))
                        : Path.Combine(_webHostEnvironment.WebRootPath, doc.pathFileIn_Out ?? string.Empty);
                    if (!System.IO.File.Exists(pathFileInput))
                    {
                        Console.WriteLine($"Không tìm thấy file của biên bản {doc.maCTTN}");
                        result.allSuccess = false;
                        result.message = "Không tìm thấy file: " + pathFileInput + " của biên bản " + doc.id;

                        return result;
                    }

                    // Đọc file và chuyển sang base64
                    byte[] fileBytes = File.ReadAllBytes(pathFileInput);
                    string base64File = Convert.ToBase64String(fileBytes);

                    doc.pathFileIn_Out = base64File;
                    doc.pathFileInput = pathFileInput; //đường dẫn

                    // Tạo URL QR nếu cần
                    if (doc.lastSign)
                    {
                        string pathOut = Path.ChangeExtension(pathFileInput, ".pdf");
                        string qrUrl = $"{urlServer}?filepath={pathOut}";
                        doc.qR_String = qrUrl;
                    }
                    else
                    {
                        doc.qR_String = "";
                    }

                    //Nếu là ký nháy, lặp nhiều lần ký đơn
                    if (hinhthucKy == 6)
                    {
                        string uriKyAnh = URI_Kyso + "/esign_IMG";
                        byte[] signed = null;
                        var reqSign = new RequestSign
                        {
                            userSign = req.userSign,
                            descSign = req.description,
                            fullNameUser = req.fullNameUser,
                            pathImageSign = req.pathImageSign,
                            pathFileIn_Out = doc.pathFileIn_Out,
                            signType = doc.signType,
                            qR_String = doc.qR_String
                        };


                        //Gọi api ký số:
                        ResponseInsertSignature res = await CallApiKySoAsync(reqSign, uriKyAnh);
                        if (!res.Success)
                        {
                            result.signedDocuments.Add(new ResponseSign
                            {
                                id = doc.id,
                                isSuccess = false,
                                maCTTN = doc.maCTTN,
                                message = res.Message
                            });
                            result.allSuccess = false;
                            result.message = $"Lỗi YCTN có id ${doc.id}";
                            return result;
                        }


                        string pathFileOutput = Path.ChangeExtension(pathFileInput, ".pdf");

                        result.signedDocuments.Add(new ResponseSign
                        {
                            id = doc.id,
                            idBangNguoiKy = doc.idBangNguoiKy,
                            isSuccess = true,
                            maCTTN = doc.maCTTN,
                            nhomNguoiKy = doc.nhomNguoiKy,
                            message = res.Message,
                            pathFileNew = pathFileOutput,
                            pathFileInput = pathFileInput,
                            data = Convert.FromBase64String(res.Data)
                        });
                        //signed = Convert.FromBase64String(res.Data);

                        //string pathFileOutput = Path.ChangeExtension(pathFileInput, ".pdf");
                        //File.Delete(pathFileInput);
                        //File.WriteAllBytes(pathFileOutput, signed);
                        //string pathFileOutputDB = "/" + Path.GetRelativePath(_webHostEnvironment.WebRootPath, pathFileOutput).Replace("\\", "/");
                    }

                }

                //Nếu ký thành công tất cả
                if (hinhthucKy == 6 && result.allSuccess)
                {
                    for (int i = 0; i < result.signedDocuments.Count; i++)
                    {
                        var docRes = result.signedDocuments[i];
                        try
                        {
                            File.Delete(docRes.pathFileInput);
                            File.WriteAllBytes(docRes.pathFileNew, docRes.data);
                            string pathFileOutputDB = "/" + Path.GetRelativePath(_webHostEnvironment.WebRootPath, docRes.pathFileNew).Replace("\\", "/");
                            docRes.pathFileNew = pathFileOutputDB;
                        }
                        catch (Exception ex)
                        {
                            docRes.isSuccess = false;
                            docRes.message = "Lỗi khi ghi file đã ký: " + ex.Message;
                            result.allSuccess = false;
                        }
                    }
                    return result;
                }

                //Ký lô VNPT:
                if (hinhthucKy != 1)
                {
                    result.allSuccess = false;
                    result.message = "Hình thức ký không đúng";

                }

                var uri = "";
                uri = URI_Kyso + "/esign_VNPTS";
                //Gọi api ký số:
                ResponseSignMulti apiRes = await CallApiKySoAsyncMulti(req, uri);

                if (!apiRes.allSuccess)
                {
                    return new ResponseSignMulti
                    {
                        signedDocuments = new List<ResponseSign>(),
                        allSuccess = false,
                        message = apiRes.message
                    };
                }
                //Console.WriteLine("===== Kết quả từ api ký =====");
                //string json = JsonConvert.SerializeObject(apiRes.signedDocuments, Formatting.Indented);
                //Console.WriteLine(json);
                //Console.WriteLine("req gốc:");
                //string jsonreq = JsonConvert.SerializeObject(req.documents);
                //Console.WriteLine(json);
                foreach (var docResult in apiRes.signedDocuments)
                {
                    // Tìm document gốc để lấy lại path input (theo id)
                    var originalDoc = req.documents.FirstOrDefault(d => d.id == docResult.id);
                    if (originalDoc == null || !docResult.isSuccess)
                    {
                        return new ResponseSignMulti
                        {
                            signedDocuments = new List<ResponseSign>(),
                            allSuccess = false,
                            message = $"Có lỗi với biên bản số ${docResult.id}"
                        };
                    }

                    try
                    {
                        // Tạo path ghi file mới
                        string pathFileInput = originalDoc.pathFileInput;
                        string pathFileOutput = Path.ChangeExtension(pathFileInput, ".pdf");

                        byte[] signed = Convert.FromBase64String(docResult.message);
                        File.Delete(pathFileInput);
                        File.WriteAllBytes(pathFileOutput, signed);

                        string pathFileOutputDB = "/" + Path.GetRelativePath(_webHostEnvironment.WebRootPath, pathFileOutput).Replace("\\", "/");

                        // Cập nhật path file mới cho DB
                        docResult.pathFileNew = pathFileOutputDB;
                        docResult.idBangNguoiKy = originalDoc.idBangNguoiKy;
                        docResult.maCTTN = originalDoc.maCTTN;
                        docResult.nhomNguoiKy = originalDoc.nhomNguoiKy;

                        // Nếu cần log lại việc ký số
                        // insert_LOG_KYSO(req.userSign, "1", req.userSign?.idUserApp);
                    }
                    catch (Exception ex)
                    {
                        return new ResponseSignMulti
                        {
                            signedDocuments = new List<ResponseSign>(),
                            allSuccess = false,
                            message = ex.Message
                        };
                    }
                }

                result.allSuccess = apiRes.allSuccess;
                result.signedDocuments = apiRes.signedDocuments;
                result.message = apiRes.allSuccess ? "" : "Thất bại!";
                Console.WriteLine("===== Kết quả từ api ký =====");
                string json = JsonConvert.SerializeObject(result, Formatting.Indented);
                Console.WriteLine(json);
                return result;
            }
            catch (Exception ex)
            {
                return new ResponseSignMulti
                {
                    signedDocuments = new List<ResponseSign>(),
                    allSuccess = false,
                    message = ex.Message
                };

            }
        }


        //Gọi API ký số:
        public async Task<ResponseInsertSignature> CallApiKySoAsync(RequestSign req, string uri)
        {

            try
            {
                // Tạo client và request
                RestClient client = new RestClient(uri);
                RestRequest request = new RestRequest(Method.POST);
                // Thêm header Content-Type
                request.AddHeader("Content-Type", "application/json");
                var body = JsonConvert.SerializeObject(req);
                //string json = JsonConvert.SerializeObject(req, Formatting.Indented);
                //Console.WriteLine(body);
                request.AddParameter("application/json", body, ParameterType.RequestBody);
                IRestResponse response = await client.ExecuteAsync(request);

                //Console.WriteLine("======= RESPONSE LOG =======");
                //Console.WriteLine($"StatusCode: {(int)response.StatusCode} ({response.StatusCode})");
                //Console.WriteLine($"StatusDescription: {response.StatusDescription}");
                //Console.WriteLine($"ResponseUri: {response.ResponseUri}");
                //Console.WriteLine($"ContentType: {response.ContentType}");
                //Console.WriteLine($"ContentLength: {response.Content?.Length}");
                //Console.WriteLine($"IsSuccessful: {response.IsSuccessful}");
                //Console.WriteLine();

                //// Log nội dung response
                //Console.WriteLine("Content:");
                //Console.WriteLine(response.Content ?? "<no content>");
                //Console.WriteLine();

                var responseContent = JsonConvert.DeserializeObject<string>(response.Content);

                //Kiểm tra trả về có phải base64 pdf không:
                bool isPdf = CheckPdfPrefix(responseContent);

                if (isPdf)
                {
                    return new ResponseInsertSignature
                    {
                        Success = true,
                        Message = "Thực hiện ký số thành công!",
                        Data = responseContent
                    };
                }
                else
                {
                    return new ResponseInsertSignature
                    {
                        Success = false,
                        Message = responseContent,
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                // Trả về đối tượng ResponseInsertSignature với thông báo lỗi
                return new ResponseInsertSignature
                {
                    Success = false,
                    Message = $"Exception: {ex.Message}"
                };
            }
        }

        public async Task<ResponseSignMulti> CallApiKySoAsyncMulti(RequestSignMulti req, string uri)
        {
            try
            {
                RestClient client = new RestClient(uri);
                RestRequest request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");

                string body = JsonConvert.SerializeObject(req);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);

                if (!response.IsSuccessful)
                {
                    return new ResponseSignMulti
                    {
                        allSuccess = false,
                        message = response.ErrorMessage,
                        signedDocuments = new List<ResponseSign>
                            {
                                new ResponseSign
                                {
                                    isSuccess = false,
                                    message = "Lỗi gọi API: " + response.ErrorMessage
                                }
                            },
                    };
                }

                // Parse đúng kiểu trả về
                var result = JsonConvert.DeserializeObject<ResponseSignMulti>(response.Content);

                return result ?? new ResponseSignMulti
                {
                    allSuccess = false,
                    message = response.ErrorMessage,
                    signedDocuments = new List<ResponseSign>()
                };
            }
            catch (Exception ex)
            {
                return new ResponseSignMulti
                {
                    allSuccess = false,
                    message = ex.ToString(),
                    signedDocuments = new List<ResponseSign>()
                };
            }
        }



        //Kiểm tra base64 có phải của file pdf không:
        public static bool CheckPdfPrefix(string base64String)
        {
            try
            {
                // Kiểm tra chuỗi Base64 có rỗng không
                if (string.IsNullOrEmpty(base64String))
                {
                    return false;
                }

                base64String = base64String
                        .Trim()
                        .Trim('"')
                        .Trim('\uFEFF')
                        .Replace("\n", "")
                        .Replace("\r", "")
                        .Replace(" ", "");

                // Chuyển chuỗi Base64 thành byte array
                byte[] data = Convert.FromBase64String(base64String);

                // Đảm bảo rằng độ dài byte array đủ lớn để kiểm tra prefix
                if (data.Length >= 5)
                {
                    // Kiểm tra nếu 5 byte đầu tiên là "%PDF" (ASCII values của '%', 'P', 'D', 'F')
                    if (data[0] == 0x25 && data[1] == 0x50 && data[2] == 0x44 && data[3] == 0x46)
                    {
                        return true; // Đúng, đây là một file PDF
                    }
                }

                return false; // Không phải PDF
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi chuyển đổi sang base64: {ex.Message}");
                return false;
            }
        }



        public async Task<ResponseInsertSignature> InsertSignatureToFile(string url, RequestInsertSignature req)
        {
            try
            {
                // Tạo client và request
                RestClient client = new RestClient(url);
                RestRequest request = new RestRequest(Method.POST);
                // Thêm header Content-Type
                request.AddHeader("Content-Type", "application/json");
                var body = JsonConvert.SerializeObject(req);
                request.AddParameter("application/json", body, ParameterType.RequestBody);
                IRestResponse response = await client.ExecuteAsync(request);
                if (response.IsSuccessful)
                {
                    return JsonConvert.DeserializeObject<ResponseInsertSignature>(response.Content);
                }
                else
                {
                    // Trả về đối tượng ResponseInsertSignature với thông tin lỗi
                    return JsonConvert.DeserializeObject<ResponseInsertSignature>(response.Content);
                }
            }
            catch (Exception ex)
            {
                // Trả về đối tượng ResponseInsertSignature với thông báo lỗi
                return new ResponseInsertSignature
                {
                    Success = false,
                    Message = $"Exception: {ex.Message}"
                };
            }
        }


        // Hàm tạo QR code
        public static byte[] GenerateQrCode(string link)
        {
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            {
                // Tạo dữ liệu mã QR từ chuỗi liên kết
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(link, QRCodeGenerator.ECCLevel.Q);

                // Tạo mã QR dưới dạng mảng byte PNG
                using (PngByteQRCode qrCode = new PngByteQRCode(qrCodeData))
                {
                    // Trả về mảng byte của QR code (PNG)
                    return qrCode.GetGraphic(20);  // Trả về byte[] trực tiếp, không cần Bitmap
                }
            }
        }



        public static void AddQrCodeToPdf(string inputPdfPath, byte[] qrCodeImageBytes)
        {
            string tempFilePath = Path.Combine(Path.GetDirectoryName(inputPdfPath), Path.GetFileNameWithoutExtension(inputPdfPath) + "_temp.pdf");

            try
            {
                // Tạo một đối tượng Image từ mảng byte
                using (MemoryStream ms = new MemoryStream(qrCodeImageBytes))
                {
                    Image qrCodeImage = Image.GetInstance(ms.ToArray());

                    // Mở file PDF gốc và tạo file PDF tạm thời
                    using (PdfReader reader = new PdfReader(inputPdfPath))
                    using (FileStream fs = new FileStream(tempFilePath, FileMode.Create))
                    using (PdfStamper stamper = new PdfStamper(reader, fs))
                    {
                        int totalPages = reader.NumberOfPages;

                        // Kích thước QR Code (1cm = 28.35pt)
                        float qrCodeSize = 33.35f;

                        // Lặp qua tất cả các trang của file PDF và thêm hình ảnh
                        for (int pageNum = 1; pageNum <= totalPages; pageNum++)
                        {
                            // Lấy trang hiện tại
                            PdfContentByte canvas = stamper.GetOverContent(pageNum);

                            // Vị trí thêm QR Code vào góc dưới bên trái của trang
                            float x = 20;
                            float y = reader.GetPageSize(pageNum).GetBottom(0) + 20; // Đặt vị trí đúng cho tất cả các trang

                            canvas.SetColorFill(BaseColor.WHITE); // Màu trắng để bôi vùng cũ
                            canvas.Rectangle(x, y, qrCodeSize, qrCodeSize); // Vùng hình chữ nhật
                            canvas.Fill();
                            // Điều chỉnh kích thước QR Code
                            qrCodeImage.SetAbsolutePosition(x, y);
                            qrCodeImage.ScaleToFit(qrCodeSize, qrCodeSize); // Điều chỉnh kích thước QR Code

                            // Thêm hình ảnh vào trang
                            canvas.AddImage(qrCodeImage);
                        }
                    }
                }

                // Sau khi thêm QR Code, thay thế file PDF gốc bằng file tạm thời
                File.Replace(tempFilePath, inputPdfPath, null);
                Console.WriteLine("QR Code đã được thêm vào tất cả các trang PDF.");
            }
            catch (Exception ex)
            {
                // Thông báo lỗi nếu có vấn đề
                throw new Exception("Lỗi khi thêm QR code vào PDF: " + ex.Message, ex);
            }
        }



        //Lấy thông tin chứng thư của người dùng
        private static UserCertificate _getAccountCert(String uri, SigningUser inforUser)
        {
            var response = Query(new ReqGetCert
            {
                sp_id = client_id,
                sp_password = client_secret,
                user_id = inforUser.user_id,
                serial_number = inforUser.serial_number,
                transaction_id = Guid.NewGuid().ToString()
            }, uri);
            if (response != null)
            {
                ResGetCert res = JsonConvert.DeserializeObject<ResGetCert>(response);

                if (res.data.user_certificates.Count() == 1)
                {
                    return res.data.user_certificates[0];
                }
                else if (res.data.user_certificates.Count() > 1)
                {

                    String certIndex = Console.ReadLine();
                    int certIn;
                    bool isNumber = int.TryParse(certIndex, out certIn);
                    if (!isNumber)
                    {
                        return null; ;
                    }
                    if (certIn < 0 || certIn >= res.data.user_certificates.Count())
                    {
                        return null;
                    }
                    return res.data.user_certificates[certIn];

                }
                else
                {
                    return null;
                }

            }
            return null;

        }

        //Gửi request ký số
        private static DataSign _sign(String uri, string data_to_be_signed, SigningUser user, String descSign, string transactionID, out ReqSign reqS)
        {


            var sign_files = new List<SignFile>();
            var sign_file = new SignFile();
            sign_file.data_to_be_signed = data_to_be_signed;
            sign_file.doc_id = data_to_be_signed;
            sign_file.file_type = "pdf";
            sign_file.sign_type = "hash";
            sign_files.Add(sign_file);
            var req = new ReqSign
            {
                sp_id = client_id,
                sp_password = client_secret,
                user_id = user.user_id,
                transaction_desc = descSign,
                transaction_id = transactionID,
                sign_files = sign_files,
                serial_number = user.serial_number
            };
            reqS = req;
            var response = Query(req, uri);
            if (response != null)
            {
                ResSign res = JsonConvert.DeserializeObject<ResSign>(response);
                return res.data;
            }
            return null;
        }


        private static String Query(object req, string serviceUri)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            ServicePointManager.ServerCertificateValidationCallback
                += new RemoteCertificateValidationCallback(SslHelper.ValidateRemoteCertificate);

            RestClient client = new RestClient(serviceUri);
            RestRequest request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            var body = JsonConvert.SerializeObject(req);
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = null;
            try
            {
                response = client.Execute(request);
            }
            catch (Exception ex)
            {
                //_log.Error($"Connect gateway error: {ex.Message}", ex);
                return null;
            }

            if (response == null || response.ErrorException != null)
            {
                //_log.Error("Service return null response");
                return null;
            }
            if (response.StatusCode != HttpStatusCode.OK)
            {
                //_log.Error($"Status code={response.StatusCode}. Status content: {response.Content}");
                return null;
            }

            return response.Content;
        }

        private static DataTransaction _getStatus(String uri)
        {
            var response = Query(new Object
            {
            }, uri);
            if (response != null)
            {
                ResStatus res = JsonConvert.DeserializeObject<ResStatus>(response);
                return res.data;
            }
            return null;
        }
    }


}
