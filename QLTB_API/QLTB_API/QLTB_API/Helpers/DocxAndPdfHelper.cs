using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using OpenXmlPowerTools;
using WordTable = DocumentFormat.OpenXml.Wordprocessing.Table;
using WordTableCell = DocumentFormat.OpenXml.Wordprocessing.TableCell;
using WordTableRow = DocumentFormat.OpenXml.Wordprocessing.TableRow;


public class DocxAndPdfHelper
{
    // Hàm thay thế nội dung trong DOCX
    public static string ReplaceTextInDocx(string docxPath, Dictionary<string, object> data, string nameFile)
    {
        try
        {
            var replacements = new Dictionary<string, string>();
            foreach (var kvp in data)
            {
                replacements[$"{{{kvp.Key.ToLower()}}}"] = kvp.Value.ToString() ?? ""; // Thêm {} vào key
            }
            //Console.WriteLine("Danh sách replacements (JSON):");
            //Console.WriteLine(JsonSerializer.Serialize(replacements, new JsonSerializerOptions { WriteIndented = true }));

            string outputNameFile = $"{nameFile}.docx";

            string outputDocxPath = Path.Combine(Path.GetDirectoryName(docxPath), outputNameFile);

            // Copy file gốc để tránh sửa trực tiếp
            File.Copy(docxPath, outputDocxPath, true);

            // Đọc nội dung của file DOCX mới sao chép vào một mảng byte
            //var templateDoc = File.ReadAllBytes(outputDocxPath);

            // Tạo đối tượng WmlDocument từ mảng byte
            using (var memoryStream = new MemoryStream(File.ReadAllBytes(outputDocxPath)))
            {
                WmlDocument doc = new WmlDocument(outputDocxPath);
                foreach (var replacement in replacements)
                {
                    try
                    {
                        doc = doc.SearchAndReplace(replacement.Key, replacement.Value, true);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Lỗi khi thay thế {replacement.Key}: {ex.Message}");
                    }
                }
                var generatedDoc = doc.DocumentByteArray;

                File.WriteAllBytes(outputDocxPath, generatedDoc);
            }
            return outputDocxPath;
        }
        catch (FileFormatException ex)
        {
            Console.WriteLine($"Lỗi định dạng file: {ex.Message}");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Lỗi khi thao tác với file: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi không xác định: {ex.Message}");
        }
        return null;
    }

    //Thay thế kèm chèn xuống dòng:
    public static string ReplaceTextInDocx_AddLineBreak(string docxPath, Dictionary<string, object> data, string nameFile)
    {
        try
        {
            string outputDocxPath = Path.Combine(Path.GetDirectoryName(docxPath), $"{nameFile}.docx");
            File.Copy(docxPath, outputDocxPath, true);

            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(outputDocxPath, true))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;

                // Lặp qua từng đoạn văn (Paragraph) để xử lý
                foreach (var para in body.Descendants<Paragraph>())
                {
                    // Lấy toàn bộ text trong Paragraph
                    string paraText = para.InnerText;

                    foreach (var kvp in data)
                    {
                        string placeholder = $"{{{kvp.Key.ToLower()}}}";
                        if (paraText.Contains(placeholder))
                        {
                            string value = kvp.Value?.ToString() ?? "";

                            // Xử lý thay thế nội dung trong Paragraph này
                            ReplacePlaceholderInParagraph(para, placeholder, value);

                            // Cập nhật lại paraText sau khi thay thế để tránh lỗi các trường sau
                            paraText = para.InnerText;
                        }
                    }
                }
                wordDoc.MainDocumentPart.Document.Save();
            }
            return outputDocxPath;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi: {ex.Message}");
            return null;
        }
    }

    private static void ReplacePlaceholderInParagraph(Paragraph para, string placeholder, string newValue)
    {
        // Hợp nhất các Run trong Paragraph để tìm placeholder dễ hơn
        //tránh placeholder bị chia nhỏ XML
        string fullText = para.InnerText;
        if (!fullText.Contains(placeholder)) return;

        // Tách giá trị mới thành các dòng
        string[] lines = newValue.Split(new[] { "\n", "\r\n" }, StringSplitOptions.None);

        // Xóa toàn bộ Run cũ trong Paragraph
        var runs = para.Elements<Run>().ToList();

        // Tìm Run đầu tiên để giữ định dạng (Font, Size...)
        var firstRun = runs.FirstOrDefault();
        RunProperties rPr = firstRun?.RunProperties?.CloneNode(true) as RunProperties;

        // Xóa sạch các Run cũ
        foreach (var run in runs) run.Remove();

        // Thay thế text trong chuỗi tổng
        string updatedFullText = fullText.Replace(placeholder, "[[SPLIT_HERE]]");
        string[] parts = updatedFullText.Split(new[] { "[[SPLIT_HERE]]" }, StringSplitOptions.None);

        for (int i = 0; i < parts.Length; i++)
        {
            // Chèn phần văn bản trước/sau placeholder
            if (!string.IsNullOrEmpty(parts[i]))
            {
                para.Append(new Run(rPr?.CloneNode(true), new Text(parts[i]) { Space = SpaceProcessingModeValues.Preserve }));
            }

            // Nếu chưa phải phần cuối, chèn nội dung mới (kèm xuống dòng)
            if (i < parts.Length - 1)
            {
                Run newContentRun = new Run(rPr?.CloneNode(true));
                for (int j = 0; j < lines.Length; j++)
                {
                    newContentRun.AppendChild(new Text(lines[j]));
                    if (j < lines.Length - 1)
                    {
                        newContentRun.AppendChild(new Break());
                    }
                }
                para.Append(newContentRun);
            }
        }
    }


    public static string getDocxAfterInsertData(string docxPath, List<List<string>> tableData, string nameFile, int countBreak, bool needBreakPage, HashSet<int> columnsToCenter, bool needCenterLastRow = true, string fontSize = "20")
    {
        try
        {
            //string docxPath = "input.docx";
            string outputFile = $"{nameFile}_table.docx";

            string outputPath = InsertDataIntoTable(docxPath, tableData, outputFile, countBreak, needBreakPage, columnsToCenter, needCenterLastRow, fontSize);
                
            //Xóa file docx trung gian sau khi thay dữ liệu đơn:
            File.Delete(docxPath);     
            return outputPath;
            //Console.WriteLine($"Dữ liệu đã được chèn vào: {outputPath}");
        } catch (Exception ex)
        {
            Console.WriteLine($"Lỗi không xác định: {ex.Message}");
            return null;
        }
    }

    public static string getDocxAfterInsertDataTwoTable(string docxPath, 
        List<List<string>> tableData1, List<List<string>> tableData2, string nameFile, 
        int countBreak, bool needBreakPage,
        HashSet<int> columnsToCenter1, HashSet<int> columnsToCenter2, 
        bool needCenterLastRow1 = true, bool needCenterLastRow2 = true, string fontSize = "20")
    {
        try
        {
            //string docxPath = "input.docx";
            string outputFile = $"{nameFile}_table.docx";

            string outputPath = InsertDataIntoTwoTable(docxPath, tableData1, tableData2, outputFile, 
            countBreak, needBreakPage, 
            columnsToCenter1, columnsToCenter2, 
            needCenterLastRow1, needCenterLastRow2, fontSize);

            //Xóa file docx trung gian sau khi thay dữ liệu đơn:
            File.Delete(docxPath);
            return outputPath;
            //Console.WriteLine($"Dữ liệu đã được chèn vào: {outputPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi không xác định: {ex.Message}");
            return null;
        }
    }

    //Hàm thêm dữ liệu vào bảng:
    public static string InsertDataIntoTable(string docxPath, List<List<string>> tableData, string nameFile, int countBreak, bool needBreakPage, HashSet<int> columnsToCenter, bool needCenterLastRow, string fontSize)
    {
        try
        {
            string outputDocxPath = Path.Combine(Path.GetDirectoryName(docxPath), nameFile);

            File.Copy(docxPath, outputDocxPath, true);

            using (WordprocessingDocument wordDocument = WordprocessingDocument.Open(outputDocxPath, true))
            {
                Body body = wordDocument.MainDocumentPart.Document.Body;
                List<WordTable> tables = body.Elements<WordTable>().ToList();

                if (tables.Count == 0)
                {
                    Console.WriteLine("Không tìm thấy bảng nào trong tài liệu.");
                    return null;
                }
                //Console.WriteLine("------------");
                //Console.WriteLine(docxPath);
                //Console.WriteLine(tables.Count);
                //Console.WriteLine("------------");
                //Xác định các cột cần căn giữa:
                //HashSet<int> columnsToCenter = new HashSet<int> { 0, 1, 6, 7, 8, 9, 11 };

                //Xóa dòng tiêu đề đầu tiên:
                if (tableData.Count > 1)
                {
                    tableData = tableData.Skip(1).ToList();
                }


                // Tìm bảng chứa dòng có ô chứa `{data}`
                WordTable targetTable = FindTableByMarker(tables, "{data}");
                if (targetTable == null)
                {
                    Console.WriteLine("Không tìm thấy bảng có dòng chứa `{data}`.");
                    return null;
                }

                // Tìm dòng chứa `{data}`
                WordTableRow dataMarkerRow = FindRowContainingText(targetTable, "{data}");
                if (dataMarkerRow == null)
                {
                    Console.WriteLine("Không tìm thấy dòng chứa `{data}`.");
                    return null;
                }

                WordTableRow referenceRow = CloneTableRow(dataMarkerRow);
                dataMarkerRow.Remove();

                //Console.WriteLine("Dữ liệu tableData:");
                //foreach (var row in tableData)
                //{
                //    Console.WriteLine(string.Join(" | ", row)); // In mỗi hàng, cách nhau bởi dấu "|"
                //}

                // Chèn dữ liệu vào bảng
                InsertDataTable(tableData, targetTable, referenceRow, columnsToCenter, needCenterLastRow, fontSize);
                


                 wordDocument.MainDocumentPart.Document.Save();
            }

            return outputDocxPath;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi: {ex.Message}");
        }
        return null;
    }

    //Thêm dữ liệu vào 2 bảng:
    public static string InsertDataIntoTwoTable(
        string docxPath, List<List<string>> tableData1, List<List<string>> tableData2, 
        string nameFile, int countBreak, bool needBreakPage, 
        HashSet<int> columnsToCenter1, HashSet<int> columnsToCenter2, 
        bool needCenterLastRow1, bool needCenterLastRow2, string fontSize)
    {
        try
        {
            string outputDocxPath = Path.Combine(Path.GetDirectoryName(docxPath), nameFile);

            File.Copy(docxPath, outputDocxPath, true);

            using (WordprocessingDocument wordDocument = WordprocessingDocument.Open(outputDocxPath, true))
            {
                Body body = wordDocument.MainDocumentPart.Document.Body;
                List<WordTable> tables = body.Elements<WordTable>().ToList();

                if (tables.Count == 0)
                {
                    Console.WriteLine("Không tìm thấy bảng nào trong tài liệu.");
                    return null;
                }
                //Console.WriteLine("------------");
                //Console.WriteLine(docxPath);
                //Console.WriteLine(tables.Count);
                //Console.WriteLine("------------");
                //Xác định các cột cần căn giữa:
                //HashSet<int> columnsToCenter = new HashSet<int> { 0, 1, 6, 7, 8, 9, 11 };

                //Xóa dòng tiêu đề đầu tiên:
                if (tableData1.Count > 1)
                {
                    tableData1 = tableData1.Skip(1).ToList();
                }


                // Tìm bảng 1 chứa dòng có ô chứa `{data}`
                WordTable targetTable1 = FindTableByMarker(tables, "{data1}");
                if (targetTable1 == null)
                {
                    Console.WriteLine("Không tìm thấy bảng có dòng chứa `{data1}`.");
                    return null;
                }

                // Tìm dòng chứa `{data}`
                WordTableRow dataMarkerRow1 = FindRowContainingText(targetTable1, "{data1}");
                if (dataMarkerRow1 == null)
                {
                    Console.WriteLine("Không tìm thấy dòng chứa `{data1}`.");
                    return null;
                }

                WordTableRow referenceRow1 = CloneTableRow(dataMarkerRow1);
                dataMarkerRow1.Remove();



                // Chèn dữ liệu vào bảng 1
                InsertDataTable(tableData1, targetTable1, referenceRow1, columnsToCenter1, needCenterLastRow1, fontSize);


                if (tableData2.Count > 1)
                {
                    tableData2 = tableData2.Skip(1).ToList();
                }
                // Tìm bảng 2 chứa dòng có ô chứa `{data}`
                WordTable targetTable2 = FindTableByMarker(tables, "{data2}");
                if (targetTable2 == null)
                {
                    Console.WriteLine("Không tìm thấy bảng có dòng chứa `{data2}`.");
                    return null;
                }

                // Tìm dòng chứa `{data}`
                WordTableRow dataMarkerRow2 = FindRowContainingText(targetTable2, "{data2}");
                if (dataMarkerRow2 == null)
                {
                    Console.WriteLine("Không tìm thấy dòng chứa `{data2}`.");
                    return null;
                }

                WordTableRow referenceRow2 = CloneTableRow(dataMarkerRow2);
                dataMarkerRow2.Remove();



                // Chèn dữ liệu vào bảng
                InsertDataTable(tableData2, targetTable2, referenceRow2, columnsToCenter2, needCenterLastRow2, fontSize);

                wordDocument.MainDocumentPart.Document.Save();
            }

            return outputDocxPath;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi: {ex.Message}");
        }
        return null;
    }

    //Hàm chung thêm dữ liệu vào bảng:
    public static void InsertDataTable(List<List<string>> tableData, WordTable targetTable, WordTableRow referenceRow, HashSet<int> columnsToCenter, bool needCenterLastRow, string fontSize = "20")
    {
        for (int rowIndex = 0; rowIndex < tableData.Count; rowIndex++)
        {
            var rowData = tableData[rowIndex];
            WordTableRow newRow = CloneTableRow(referenceRow);

            int cellIndex = 0;
            foreach (var cell in newRow.Elements<WordTableCell>())
            {
                if (cellIndex < rowData.Count)
                {
                    cell.RemoveAllChildren<Paragraph>();

                    // Tạo run và thiết lập kiểu chữ
                    Run run = new Run(new Text(rowData[cellIndex]));
                    RunProperties runProperties = new RunProperties(
                        new RunFonts()
                        {
                            Ascii = "Times New Roman",
                            HighAnsi = "Times New Roman",
                            EastAsia = "Times New Roman",
                            ComplexScript = "Times New Roman"
                        },
                        new FontSize() { Val = fontSize },
                        new FontSizeComplexScript() { Val = fontSize }
                    );

                    //RunProperties runProperties = new RunProperties(new FontSize { Val = fontSize });

                    // Nếu là dòng cuối cùng của bảng cần căn giữa, in đậm toàn bộ
                    if (rowIndex == tableData.Count - 1 && needCenterLastRow)
                    {
                        runProperties.Append(new Bold());
                    }

                    run.RunProperties = runProperties;

                    // Tạo đoạn văn bản
                    Paragraph paragraph = new Paragraph(run);

                    // Nếu là dòng cuối cùng của bảng cần căn giữa hoặc cột cần căn giữa, áp dụng căn giữa
                    if ((rowIndex == tableData.Count - 1 && needCenterLastRow) || columnsToCenter.Contains(cellIndex))
                    {
                        paragraph.ParagraphProperties = new ParagraphProperties(new Justification { Val = JustificationValues.Center });
                    }

                    cell.Append(paragraph);
                }
                cellIndex++;
            }

            targetTable.Append(newRow);
        }
    }

    // 🔍 Tìm bảng chứa dòng có ô chứa `{data}`
    static WordTable FindTableByMarker(List<WordTable> tables, string marker)
    {
        foreach (var table in tables)
        {
            if (table.Elements<WordTableRow>().Any(row => row.Elements<WordTableCell>().Any(cell => cell.InnerText.Contains(marker))))
            {
                return table;
            }
        }
        return null;
    }

    // 🔍 Tìm dòng chứa "{data}"
    static WordTableRow FindRowContainingText(WordTable table, string searchText)
    {
        foreach (var row in table.Elements<WordTableRow>())
        {
            if (row.Elements<WordTableCell>().Any(cell => cell.InnerText.Contains(searchText)))
            {
                return row;
            }
        }
        return null;
    }

    // 📌 Clone một dòng để giữ nguyên format
    static WordTableRow CloneTableRow(WordTableRow row)
    {
        return (WordTableRow)row.CloneNode(true);
    }



    // Hàm chuyển DOCX thành PDF
    public static byte[] ConvertDocxToPdf(string docxPath)
    {
        try
        {
            if (!File.Exists(docxPath))
            {
                Console.WriteLine("Tệp DOCX không tồn tại.");
                return null;
            }

            //Đường dẫn lưu pdf:
            string outputDirectory = Path.GetDirectoryName(docxPath).Replace("templates", "pdf");

            string pdfPath = Path.Combine(outputDirectory, Path.GetFileNameWithoutExtension(docxPath) + ".pdf");

            // Đường dẫn tới LibreOffice:
            string libreOfficePath = @"C:\Program Files\LibreOffice\program\soffice.exe";
            if (!File.Exists(libreOfficePath))
            {
                Console.WriteLine("============");
                Console.WriteLine("LibreOffice không được cài đặt hoặc đường dẫn không chính xác.");
                Console.WriteLine("============");
                return null;
            }
            // Gọi LibreOffice để chuyển đổi DOCX sang PDF
            Process process = new Process();
            process.StartInfo.FileName = libreOfficePath; // Trên Windows có thể là "soffice.exe"
            //process.StartInfo.Arguments = $"--headless --convert-to pdf \"{docxPath}\" --outdir \"{outputDirectory}\"";
            //process.StartInfo.UseShellExecute = false;
            //process.StartInfo.CreateNoWindow = true;
            //process.Start();
            //process.WaitForExit();

            process.StartInfo.Arguments = $"--headless --convert-to pdf \"{docxPath}\" --outdir \"{outputDirectory}\"";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.RedirectStandardOutput = false;
            process.StartInfo.RedirectStandardError = true;
            process.Start();

            // Đọc lỗi nếu có
            string errorOutput = process.StandardError.ReadToEnd();
            //string output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            
            if (!File.Exists(pdfPath))
            {
                Console.WriteLine("Không thể tạo tệp PDF.");
                Console.WriteLine("Lỗi LibreOffice: " + errorOutput);
                return null;
            }


            //// Kiểm tra xem tệp PDF đã được tạo chưa
            //if (!File.Exists(pdfPath))
            //{
            //    Console.WriteLine("Không thể tạo tệp PDF.");
            //    return null;
            //}

            // Đọc nội dung PDF vào mảng byte
            byte[] pdfBytes = File.ReadAllBytes(pdfPath);

            // Xóa tệp DOCX, PDF sau khi đọc
            File.Delete(docxPath);
            //File.Delete(pdfPath);

            return pdfBytes;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi không xác định: {ex.Message}");
            return null;
        }
    }
}
