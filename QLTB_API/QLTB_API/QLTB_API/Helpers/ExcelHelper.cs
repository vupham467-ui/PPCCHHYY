using QLTB_API.Models.QUAN_TRI.DM_DONVI;
using QLTB_API.Models.QUAN_TRI.DM_PHONGBAN;
using DocumentFormat.OpenXml.Bibliography;
using OfficeOpenXml;
using OfficeOpenXml.DataValidation;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using QLTB_API.Models.QLTB.DANH_MUC;
using System;
using System.Collections.Generic;
using System.Drawing;

public class ExcelHelper
{
    public ExcelHelper()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    }

    public byte[] ExportToExcel<T>(List<T> data, List<string> columnNames, List<string> hyperlinkColumns)
    {
        using (var package = new ExcelPackage())
        {
            // Tạo một worksheet mới
            var worksheet = package.Workbook.Worksheets.Add("Sheet1");

            // Tạo tiêu đề cho các cột và căn chỉnh header
            for (int col = 0; col < columnNames.Count; col++)
            {
                var headerCell = worksheet.Cells[1, col + 1];
                headerCell.Value = columnNames[col];
                headerCell.Style.Font.Color.SetColor(Color.White); // Chữ trắng
                headerCell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // Đặt kiểu nền là solid
                headerCell.Style.Fill.BackgroundColor.SetColor(Color.Green); // Nền xanh
                headerCell.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center; // Căn giữa
                headerCell.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center; // Căn giữa theo chiều dọc

                // Thêm border cho các cạnh của header
                headerCell.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                headerCell.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                headerCell.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                headerCell.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                // Tăng padding bằng cách điều chỉnh chiều cao dòng
                worksheet.Row(1).Height = 25; // Điều chỉnh chiều cao của dòng header để tạo thêm không gian
            }

            // Điền dữ liệu vào bảng
            for (int row = 0; row < data.Count; row++)
            {
                var item = data[row];

                // Duyệt qua các cột để lấy giá trị
                for (int col = 0; col < columnNames.Count; col++)
                {
                    var value = GetPropertyValue(item, col); // Lấy giá trị từ đối tượng theo thứ tự cột

                    // Điền giá trị cho các cột thông thường
                    worksheet.Cells[row + 2, col + 1].Value = value;

                    // Kiểm tra nếu cột này là hyperlink và giá trị là một URL hợp lệ
                    if (hyperlinkColumns.Contains(columnNames[col]) && value != null && Uri.IsWellFormedUriString(value.ToString(), UriKind.Absolute))
                    {
                        // Hiển thị "Link" thay vì URL trong ô Excel
                        worksheet.Cells[row + 2, col + 1].Hyperlink = new Uri(value.ToString());
                        worksheet.Cells[row + 2, col + 1].Value = "Link";

                        // Định dạng liên kết: chữ xanh nước biển và gạch chân
                        worksheet.Cells[row + 2, col + 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        worksheet.Cells[row + 2, col + 1].Style.Font.UnderLine = true; // Gạch chân
                        worksheet.Cells[row + 2, col + 1].Style.Font.Color.SetColor(Color.Blue); // Màu chữ xanh nước biển
                    }
                }
            }

            // Tự động điều chỉnh chiều rộng cột để vừa với nội dung của cả header và dữ liệu
            for (int col = 0; col < columnNames.Count; col++)
            {
                worksheet.Column(col + 1).AutoFit();
            }

            // Trả về mảng byte của file Excel
            return package.GetAsByteArray();
        }
    }

    // Hàm hỗ trợ lấy giá trị của đối tượng theo thứ tự cột (dựa trên chỉ số cột)
    private object GetPropertyValue<T>(T item, int columnIndex)
    {
        var properties = item.GetType().GetProperties();
        if (columnIndex >= 0 && columnIndex < properties.Length)
        {
            return properties[columnIndex].GetValue(item);
        }

        return null;
    }

    public byte[] GenerateThietBiTemplate(
        List<DM_DONVI_Model> donViArr,
        //List<DM_PHONGBAN_Model> phongBanArr,
        List<QLTB_DM_KHO_Model> khoArr,
        List<QLTB_DM_CHUNGLOAI_Model> chungLoaiArr,
        List<QLTB_DM_HANGSX_Model> hangSXArr,
        List<QLTB_DM_NUOCSX_Model> nuocSXArr,
        List<QLTB_DM_DONVITINH_Model> dvtArr
    )
    {
        try
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            string passwordExcel = "Hieuct@1995";

            using (var package = new ExcelPackage())
            {
                //--------------------------------------------------
                // Sheet 0: HuongDan
                //--------------------------------------------------
                var wsGuide = package.Workbook.Worksheets.Add("HuongDan");

                // Tiêu đề lớn
                wsGuide.Cells["A1"].Value = "HƯỚNG DẪN NHẬP THIẾT BỊ";
                wsGuide.Cells["A1"].Style.Font.Bold = true;
                wsGuide.Cells["A1"].Style.Font.Size = 16;

                // Nội dung hướng dẫn
                wsGuide.Cells["A3"].Value =
                    "1. Chỉ nhập dữ liệu tại sheet 'NhapThietBi' từ dòng 3 trở đi.\n" +
                    "2. Không chỉnh sửa, xóa hoặc thêm cột.\n" +
                    "3. Các cột danh mục phải chọn đúng giá trị mã tương ứng:\n" +
                    "   3.1. Cột 'Mã ĐVQL' và 'ĐVQL ID' lần lượt tương ứng giá trị cột 'ma_dviqly' và 'dm_donvi_id' ở sheet 'DanhMucChinh'\n" +
                    "   3.2. Cột 'Kho đơn vị' tương ứng giá trị cột 'tbi_kho_id' ở sheet 'DanhMucChinh'\n" +
                    "   3.3. Cột 'Đơn vị tính' tương ứng giá trị cột 'dm_donvitinh_id' ở sheet 'DonViTinh'\n" +
                    "   3.4. Cột 'Chủng loại' tương ứng giá trị cột 'tbi_dm_chungloai_id' ở sheet 'ChungLoai'\n" +
                    "   3.5. Cột 'Hãng sản xuất' tương ứng giá trị cột 'tbi_dm_hangsx_id' ở sheet 'HangSX'\n" +
                    "   3.6. Cột 'Nước sản xuất' tương ứng giá trị cột 'tbi_dm_nuocsx_id' ở sheet 'NuocSX'\n" +
                    "4. Năm sản xuất: 1900–2100.\n" +
                    "5. Ngày vận hành: định dạng dd/MM/yyyy và không lớn hơn ngày hiện tại.\n" +
                    "6. Lưu file và upload lên hệ thống.\n" +
                    "Lưu ý: Với các thiết bị CNTT cần điền các thông tin chi tiết (Máy tính, laptop, ...): Sau khi thêm mới từ excel, chỉnh sửa để nhập thông tin ở tab 'Thông tin chi tiết'";

                // Format cho đẹp
                wsGuide.Column(1).Width = 150;
                wsGuide.Cells["A3:A20"].Style.WrapText = true;

                // Khóa sheet hướng dẫn
                wsGuide.Protection.IsProtected = true;
                wsGuide.Protection.AllowSelectLockedCells = true;
                wsGuide.Protection.AllowSelectUnlockedCells = true;
                wsGuide.Protection.SetPassword(passwordExcel);

                //--------------------------------------------------
                // Sheet 1: NhapThietBi
                //--------------------------------------------------
                var ws = package.Workbook.Worksheets.Add("NhapThietBi");

                var headers = new[]
                {
                    "Mã ĐVQL(ma_dviqly)", "ĐVQL ID(dm_donvi_id)", "Kho đơn vị(tbi_kho_id)", "Tên thiết bị", "Mã thiết bị", "Serial",
                    "Đơn vị tính(dm_donvitinh_id)", "Năm sản xuất", "Chủng loại(tbi_dm_chungloai_id)", "Hãng sản xuất(tbi_dm_hangsx_id)", "Nước sản xuất(tbi_dm_nuocsx_id)",
                    "Ngày vận hành", "Thông tin khác"
                };

                var dbFields = new[]
                {
                    "ma_dviqly", "dm_donvi_id", "tbi_kho_id", "ten_thietbi", "ma_thietbi", "no_thietbi",
                    "dm_donvitinh_id", "namsx", "tbi_dm_chungloai_id", "tbi_dm_hangsx_id", "tbi_nuocsx_id",
                    "ngay_vanhanh", "thong_tin_khac"
                };

                var dataTypes = new[]
                {
                    "string", "string", "string", "string", "string", "string",
                    "string", "number", "string", "string", "string",
                    "date", "string"
                };

                for (int col = 1; col <= headers.Length; col++)
                {
                    ws.Cells[1, col].Value = headers[col - 1];
                    ws.Cells[1, col].Style.Font.Bold = true;
                    ws.Cells[1, col].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    ws.Cells[1, col].Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                    ws.Cells[2, col].Value = dbFields[col - 1];
                    ws.Column(col).Style.Numberformat.Format = dataTypes[col - 1] switch
                    {
                        "number" => "0",
                        "date" => "dd/MM/yyyy",
                        _ => "@"
                    };
                    ws.Column(col).Width = 25;
                    //ws.Column(2).Width = 50; //dm_donvi_id
                    //ws.Column(3).Width = 50; //dm_phongban_id
                    //ws.Column(8).Width = 50; //dm_donvitinh_id
                }


                ws.Row(2).Hidden = true;
                ws.View.FreezePanes(3, 1);
                ws.Cells.Style.Locked = false;      // mở khóa toàn bộ
                ws.Cells["1:2"].Style.Locked = true; // khóa header
                ws.Cells[1, 1, 1, headers.Length].AutoFilter = true;
                //ws.Protection.IsProtected = true;
                //ws.Protection.SetPassword(passwordExcel);
                //ws.Protection.AllowInsertColumns = false;
                //ws.Protection.AllowDeleteColumns = false;
                //ws.Protection.AllowSelectUnlockedCells = true;
                //ws.Protection.AllowAutoFilter = true;

                //--------------------------------------------------
                // Sheet 2: DanhMucChinh (DonVi, PhongBan, Kho)
                //--------------------------------------------------
                var wsDMChinh = package.Workbook.Worksheets.Add("DanhMucChinh");
                int currentRow = 1;

                void WriteSection<T>(string title, IEnumerable<T> list, string[] props, Func<T, object[]> getter)
                {
                    wsDMChinh.Cells[currentRow, 1].Value = $"##{title}";
                    wsDMChinh.Cells[currentRow, 1].Style.Font.Bold = true;
                    currentRow++;

                    // Header
                    for (int i = 0; i < props.Length; i++)
                    {
                        wsDMChinh.Cells[currentRow, i + 1].Value = props[i];
                        wsDMChinh.Cells[currentRow, i + 1].Style.Font.Bold = true;
                        wsDMChinh.Cells[currentRow, i + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        wsDMChinh.Cells[currentRow, i + 1].Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                    }

                    int startRow = currentRow + 1;

                    foreach (var item in list)
                    {
                        var values = getter(item);
                        for (int c = 0; c < values.Length; c++)
                            wsDMChinh.Cells[startRow, c + 1].Value = values[c];
                        startRow++;
                    }

                    // Table + Filter
                    var tbl = wsDMChinh.Tables.Add(wsDMChinh.Cells[currentRow, 1, startRow - 1, props.Length], $"{title}Table");
                    tbl.ShowHeader = true;
                    tbl.TableStyle = TableStyles.None;

                    // Tên vùng (cột tên)
                    package.Workbook.Names.Add($"{title}List", wsDMChinh.Cells[currentRow + 1, 3, startRow - 1, 3]);

                    // AutoFit
                    wsDMChinh.Cells[currentRow, 1, startRow - 1, props.Length].AutoFitColumns();
                    wsDMChinh.Column(2).Width = Math.Max(wsDMChinh.Column(2).Width, 50);
                    currentRow = startRow + 1;
                }

                WriteSection("DonVi", donViArr, new[] { "ma_dviqly", "dm_donvi_id", "ten_donvi" }, d => new object[] { d.ma_dviqly, d.id, d.ten });
                //WriteSection("PhongBan", phongBanArr, new[] { "ma_dviqly", "dm_phongban_id", "ten_phongban" }, p => new object[] { p.ma_dviqly, p.id, p.ten });
                WriteSection("Kho", khoArr, new[] { "ma_dviqly", "tbi_kho_id", "ten_kho" }, k => new object[] { k.ma_dviqly, k.id, k.ten_kho });

                wsDMChinh.Protection.IsProtected = true;
                wsDMChinh.Protection.AllowSelectLockedCells = true;
                wsDMChinh.Protection.AllowSelectUnlockedCells = true;
                wsDMChinh.Protection.AllowAutoFilter = true;
                wsDMChinh.Protection.SetPassword(passwordExcel);

                //--------------------------------------------------
                // Các sheet danh mục phụ: Table + Filter
                //--------------------------------------------------
                void CreateTableSheet<T>(string sheetName, List<T> list, string colId, string colName, Func<T, object[]> getter)
                {
                    var wsS = package.Workbook.Worksheets.Add(sheetName);
                    wsS.Cells[1, 1].Value = colId;
                    wsS.Cells[1, 2].Value = colName;
                    using (var header = wsS.Cells[1, 1, 1, 2])
                    {
                        header.Style.Font.Bold = true;
                        header.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        header.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                    }

                    int r = 2;
                    foreach (var item in list)
                    {
                        var vals = getter(item);
                        wsS.Cells[r, 1].Value = vals[0];
                        wsS.Cells[r, 2].Value = vals[1];
                        r++;
                    }

                    var tbl = wsS.Tables.Add(wsS.Cells[1, 1, r - 1, 2], $"{sheetName}Table");
                    tbl.ShowHeader = true;
                    tbl.TableStyle = TableStyles.None;

                    wsS.Cells[1, 1, r - 1, 2].AutoFitColumns();

                    package.Workbook.Names.Add($"{sheetName}List", wsS.Cells[2, 2, r - 1, 2]);
                    package.Workbook.Names.Add($"{sheetName}IdList", wsS.Cells[2, 1, r - 1, 1]);

                    // Khóa sheet nhưng vẫn copy, filter
                    wsS.Protection.IsProtected = true;
                    wsS.Protection.AllowSelectLockedCells = true;
                    wsS.Protection.AllowSelectUnlockedCells = true;
                    wsS.Protection.AllowAutoFilter = true;
                    wsS.Protection.AllowDeleteColumns = false;
                    wsS.Protection.AllowDeleteRows = false;
                    wsS.Protection.SetPassword(passwordExcel);
                }

                CreateTableSheet("ChungLoai", chungLoaiArr, "tbi_dm_chungloai_id", "ten_chungloai", c => new object[] { c.id, c.ten_chungloai });
                CreateTableSheet("HangSX", hangSXArr, "tbi_dm_hangsx_id", "ten_hangsx", h => new object[] { h.id, h.ten_hang_sx });
                CreateTableSheet("NuocSX", nuocSXArr, "tbi_dm_nuocsx_id", "ten_nuoc_sx", n => new object[] { n.id, n.ten_nuoc_sx });
                CreateTableSheet("DonViTinh", dvtArr, "dm_donvitinh_id", "ten_donvitinh", d => new object[] { d.id, d.ten_donvitinh });

                //--------------------------------------------------
                // Data Validation cho NhapThietBi
                //--------------------------------------------------
                int maxRow = 500;

                // 1. Năm sản xuất (I) 1900–2100
                for (int row = 3; row <= maxRow; row++)
                {
                    var dvYear = ws.DataValidations.AddDecimalValidation($"H{row}");
                    dvYear.Operator = ExcelDataValidationOperator.between;
                    dvYear.Formula.Value = 1900;
                    dvYear.Formula2.Value = 2100;
                    //dvYear.AllowBlank = false;
                    dvYear.ShowErrorMessage = true;
                    dvYear.ErrorTitle = "Giá trị không hợp lệ";
                    dvYear.Error = "Giá trị phải là số từ 1900 đến 2100";
                }

                // 2. Ngày vận hành (M) kiểu date
                for (int row = 3; row <= maxRow; row++)
                {
                    var dvDate = ws.DataValidations.AddDateTimeValidation($"L{row}");
                    dvDate.Operator = ExcelDataValidationOperator.between;
                    dvDate.Formula.ExcelFormula = "DATE(1900,1,1)";
                    dvDate.Formula2.ExcelFormula = "TODAY()";
                    //dvDate.AllowBlank = false;
                    dvDate.ShowErrorMessage = true;
                    dvDate.ErrorTitle = "Giá trị không hợp lệ";
                    dvDate.Error = "Ngày vận hành phải ở định dạng dd/MM/yyyy(1900 <= day <= ngày hiện tại)";

                    ws.Column(12).Style.Numberformat.Format = "dd/MM/yyyy";
                }

                // 3. Các cột bắt buộc nhập (A–L)
                //char[] requiredCols = "ABCDEFGHJKL".ToCharArray();
                //for (int row = 3; row <= maxRow; row++)
                //{
                //    foreach (var col in requiredCols)
                //    {
                //        // Kiểm tra đã có validation chưa trước khi thêm
                //        if (!ws.DataValidations.Any(v => v.Address.Address == $"{col}{row}"))
                //        {
                //            var cv = ws.DataValidations.AddCustomValidation($"{col}{row}");
                //            cv.Formula.ExcelFormula = $"LEN({col}{row})>0";
                //            cv.ShowErrorMessage = true;
                //            cv.ErrorTitle = "Bắt buộc nhập";
                //            cv.Error = "Ô này không được để trống";
                //        }
                //    }
                //}

                package.Workbook.Protection.LockStructure = true;
                package.Workbook.Protection.SetPassword(passwordExcel);

                return package.GetAsByteArray();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

}
