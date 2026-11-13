using Microsoft.AspNetCore.Mvc;
using QLTB_API.Helpers;
using System.Data;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.IO;
using QLTB_API.Models.QUAN_TRI.HT_USER_IMAGE;
using System;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace QLTB_API.Controllers.QUAN_TRI.HT_USER_IMAGE
{
    [Route("api/[controller]")]
    [ApiController]
    public class HT_USER_MANAGERController : ControllerBase
    {
        private readonly HT_USER_IMAGE_Manager _manager;

        public HT_USER_MANAGERController()
        {
            _manager = new HT_USER_IMAGE_Manager();
        }

        /// <summary>
        /// Import Excel danh sách ảnh người dùng
        /// </summary>
        /// <param name="file">File Excel (.xlsx)</param>
        /// <param name="createdBy">Tên người thao tác</param>
        /// <returns>Danh sách kết quả import (có cột STATUS + ERROR_MSG)</returns>
        /// 
        [Route("import-excel-image")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult ImportExcel(
             IFormFile file,
            string createdBy)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Chưa upload file Excel." });

            DataTable dtExcel = new DataTable();
            try
            {
                // đọc Excel như hiện tại
                using (var stream = new MemoryStream())
                {
                    file.CopyTo(stream);
                    using (SpreadsheetDocument doc = SpreadsheetDocument.Open(stream, false))
                    {
                        var workbookPart = doc.WorkbookPart;
                        var sheet = workbookPart.Workbook.Sheets.GetFirstChild<Sheet>();
                        var worksheetPart = (WorksheetPart)workbookPart.GetPartById(sheet.Id);
                        var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

                        bool firstRow = true;
                        foreach (var r in sheetData.Elements<Row>())
                        {
                            if (firstRow)
                            {
                                foreach (var c in r.Elements<Cell>())
                                {
                                    string header = OpenXMLHelper.GetCellValue(doc, c);
                                    dtExcel.Columns.Add(header.Trim());
                                }
                                firstRow = false;
                            }
                            else
                            {
                                var dr = dtExcel.NewRow();
                                int colIndex = 0;
                                foreach (var c in r.Elements<Cell>())
                                {
                                    string cellValue = OpenXMLHelper.GetCellValue(doc, c);
                                    if (colIndex < dtExcel.Columns.Count)
                                        dr[colIndex] = cellValue;
                                    colIndex++;
                                }
                                dtExcel.Rows.Add(dr);
                            }
                        }
                    }
                }

                // Gọi hàm import
                var resultTable = _manager.ImportFromExcel(dtExcel, createdBy);

                // Tạo tổng hợp kết quả
                int totalValid = 0;
                var errors = new List<object>();
                for (int i = 0; i < resultTable.Rows.Count; i++)
                {
                    var row = resultTable.Rows[i];
                    if (row["STATUS"].ToString().ToUpper() == "OK")
                        totalValid++;
                    else
                        errors.Add(new { row = i + 2, message = row["ERROR_MSG"].ToString() }); // +2 vì header + index từ 0
                }

                return Ok(new
                {
                    success = totalValid > 0,
                    totalValid,
                    totalError = errors.Count,
                    errors
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi đọc hoặc import Excel: " + ex.Message });
            }
        }

    }
}
