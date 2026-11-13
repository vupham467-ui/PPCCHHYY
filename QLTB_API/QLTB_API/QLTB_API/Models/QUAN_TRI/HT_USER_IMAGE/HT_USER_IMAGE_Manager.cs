using Oracle.ManagedDataAccess.Client;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Data;
using QLTB_API.Helpers;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;
using APIPCHY.Helpers;


namespace QLTB_API.Models.QUAN_TRI.HT_USER_IMAGE
{
    public class HT_USER_IMAGE_Manager
    {
        private readonly DataHelper helper;

        public HT_USER_IMAGE_Manager()
        {
            helper = new DataHelper(DbConnectionType.QLTB);
        }

        /// <summary>
        /// Import ảnh user từ Excel, gọi SP_IMPORT_USER_IMAGE
        /// </summary>
        /// <param name="tenDangNhap">Tên đăng nhập</param>
        /// <param name="imageType">Loại ảnh (avatar, signature, ...)</param>
        /// <param name="imagePath">Đường dẫn lưu ảnh (relative path)</param>
        /// <param name="createdBy">Người thao tác</param>
        /// <returns>Chuỗi kết quả: "OK" hoặc lỗi</returns>
        public string ImportUserImage(string tenDangNhap, string imageType, string imagePath, string createdBy)
        {
            try
            {
                string result = helper.ExcuteNonQuery_v2(
                    "PKG_QLTB_THIETBI.SP_IMPORT_USER_IMAGE",
                    "p_Error",               // tên parameter out lỗi
                    "p_ten_dang_nhap",       // input parameters
                    "p_image_type",
                    "p_image_path",
                    "p_created_by",
                    tenDangNhap,
                    imageType,
                    imagePath,
                    createdBy
                );

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Lỗi import user image: " + ex.Message);
                return ex.Message;
            }
        }

        /// <summary>
        /// Import nhiều user từ DataTable (Excel đọc vào)
        /// Gọi ImportUserImage cho từng dòng
        /// </summary>
        /// <param name="dtExcel">DataTable chứa TEN_DANG_NHAP, IMAGE_TYPE, RELATIVE_PATH</param>
        /// <param name="createdBy">Người thao tác</param>
        /// <returns>DataTable kết quả có thêm cột STATUS, ERROR_MSG</returns>
        public DataTable ImportFromExcel(DataTable dtExcel, string createdBy)
        {
            if (!dtExcel.Columns.Contains("STATUS"))
                dtExcel.Columns.Add("STATUS", typeof(string));

            if (!dtExcel.Columns.Contains("ERROR_MSG"))
                dtExcel.Columns.Add("ERROR_MSG", typeof(string));

            foreach (DataRow row in dtExcel.Rows)
            {
                string tenDangNhap = row["TEN_DANG_NHAP"]?.ToString().Trim();
                //string imageType = row["IMAGE_TYPE"]?.ToString().Trim();
                string imageType = "AVATAR";
                string relativePath = row["RELATIVE_PATH"]?.ToString().Trim();

                if (string.IsNullOrEmpty(tenDangNhap) || string.IsNullOrEmpty(relativePath))
                {
                    row["STATUS"] = "ERROR";
                    row["ERROR_MSG"] = "Thiếu TEN_DANG_NHAP hoặc RELATIVE_PATH";
                    continue;
                }

                string result = ImportUserImage(tenDangNhap, imageType, relativePath, createdBy);

                if (result.ToUpper() == "OK")
                {
                    row["STATUS"] = "OK";
                    row["ERROR_MSG"] = "";
                }
                else
                {
                    row["STATUS"] = "ERROR";
                    row["ERROR_MSG"] =
                    $"DEBUG | TEN_DANG_NHAP='{tenDangNhap}', " +
                    $"IMAGE_TYPE='{imageType}', " +
                    $"RELATIVE_PATH='{relativePath}' | " +
                    result;
                    //row["ERROR_MSG"] = result;
                }
            }

            return dtExcel;
        }
    }
}
