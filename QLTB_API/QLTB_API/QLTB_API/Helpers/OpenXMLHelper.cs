using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Globalization;
using System.Linq;

namespace QLTB_API.Helpers
{
    public static class OpenXMLHelper
    {
        /// <summary>
        /// Lấy giá trị ô Excel từ OpenXML
        /// </summary>
        /// <param name="doc">SpreadsheetDocument</param>
        /// <param name="cell">Cell cần đọc</param>
        /// <returns>Giá trị string</returns>
        public static string GetCellValue(
                SpreadsheetDocument doc,
                Cell cell)
        {
            if (cell == null || cell.CellValue == null)
                return string.Empty;

            var value = cell.CellValue.InnerText;

            if (cell.DataType != null &&
                cell.DataType.Value == CellValues.SharedString)
            {
                return doc.WorkbookPart.SharedStringTablePart
                    .SharedStringTable
                    .ElementAt(int.Parse(value))
                    .InnerText
                    .Trim();
            }

            return value.Trim();
        }
    }
}
