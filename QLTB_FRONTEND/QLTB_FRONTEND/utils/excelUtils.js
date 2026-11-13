import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { arrLoaiPhuongTienTND } from "../constants/propGlobal";

/**
 * Xuất dữ liệu thành file Excel với tiêu đề, header, và định dạng
 * @param {Array} data - Dữ liệu mảng object [{ key1: value1, key2: value2 }]
 * @param {string} fileName - Tên file Excel
 * @param {string} sheetName - Tên sheet
 * @param {Object} mapKeys - Đối tượng ánh xạ tên cột { oldKey: "Tên mới" }
 * @param {string} title - Tiêu đề bảng dữ liệu
 */
export const exportToExcel = async (data, fileName = "export.xlsx", sheetName = "Sheet1", mapKeys = {}, title = "Báo cáo") => {
  if (!data || data.length === 0) {
    console.error("Dữ liệu rỗng, không thể xuất Excel!");
    return;
  }

  // Tạo workbook & worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Đổi tên cột theo mapKeys
  const formattedData = data.map(row => {
    let newRow = {};
    Object.keys(row).forEach(key => {
      const newKey = mapKeys[key] || key;
      newRow[newKey] = row[key];
    });
    return newRow;
  });

  // Lấy danh sách cột sau khi đổi tên
  const headers = Object.keys(formattedData[0]);

  // //Thêm TIÊU ĐỀ trên cùng (hợp nhất cột, in đậm, căn giữa)
  // const titleRow = worksheet.addRow([title]);
  // titleRow.font = { bold: true, size: 16 };
  // titleRow.alignment = { horizontal: "center" };
  // worksheet.mergeCells(1, 1, 1, headers.length); // Hợp nhất cột

  //Thêm dữ liệu vào sheet
  formattedData.forEach(row => {
    const rowData = headers.map(header => row[header]);
    const newRow = worksheet.addRow(rowData);
    newRow.eachCell(cell => {
      cell.alignment = { vertical: "top", wrapText: true }; //Cho phép xuống dòng
    });
  });

  const minWidth = 10; 
  //Căn chỉnh độ rộng cột tự động
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      // Bỏ qua dòng tiêu đề
      if (rowNumber > 1) {
        const cellValue = cell.value ? cell.value.toString().trim() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      }
    });

    // column.width = maxLength + 2; // Thêm padding
    // Giới hạn độ rộng tối đa (để Excel tự wrap)
    const optimalWidth = Math.max(maxLength + 2, minWidth); // đảm bảo tối thiểu minWidth
    column.width = Math.min(optimalWidth, 100); 
  });

  // Tăng chiều cao dòng tự động cho các ô có nội dung dài
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: "top" };
    });

    // Nếu dòng chứa ô dài, tăng chiều cao
    const maxCellLength = Math.max(...row.values.map(v => (v ? v.toString().length : 0)));
    if (maxCellLength > 100) row.height = 40;
    else if (maxCellLength > 200) row.height = 60;
  });

  if (!fileName.endsWith(".xlsx")) {
    fileName += ".xlsx"; // Tự động thêm đuôi nếu thiếu
  }

  // --- TIÊU ĐỀ (đặt sau khi chỉnh width để tránh lệch căn giữa) ---
  const titleRow = worksheet.insertRow(1, [title]);
  worksheet.mergeCells(1, 1, 1, headers.length);
  const titleCell = worksheet.getCell("A1");
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleRow.height = 30;

  //Thêm HEADER (in đậm, căn giữa, viền, bộ lọc)
  const headerRow = worksheet.insertRow(2, headers);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.eachCell(cell => {
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9E1F2" } }; // Màu nền xanh nhạt
  });

  //Bật bộ lọc cho header
  worksheet.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: headers.length } };

  //Xuất file Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const dataBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(dataBlob, fileName);
};


// Hàm generate file excel mẫu cho QT chì TND:
export const generateExcelTemplateForTND = async (type = "Chì", fileName = `QT_${type}_template.xlsx`) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('QT_' + type);

  const isQTChi = type == "Chì";
  const isQTTem = type == "Tem";

  let headers = [];

  const labelMap = {
    STT: "STT",
    sO_BBAN: "Số biên bản",
    nO_BBAN: "NO biên bản",
    booC_CONGQUANG: "Booc, cổng quang",
    cuA_TU: "Cửa tủ",
    chuP_BUZI_TI_TU: "Chụp buzi, ti, tu",
    tonG_SO_CHI_THU_HOI: "Tổng số chì thu hồi",
    loaI_PT: "Loại phương tiện",
    ngaY_NIEM_PHONG: "Ngày niêm phong",
    tonG_SO_CHI_NIEM_PHONG: "Tổng số chì niêm phong",
    sO_TEM_SD: "Số tem sử dụng",
  };
  if (isQTChi) {
    headers = [
      "STT",
      "sO_BBAN",
      "nO_BBAN",
      "booC_CONGQUANG",
      "cuA_TU",
      "chuP_BUZI_TI_TU",
      "tonG_SO_CHI_THU_HOI",
      "loaI_PT",
      "ngaY_NIEM_PHONG",
      "tonG_SO_CHI_NIEM_PHONG",
    ];
  } else if (isQTTem) {
    headers = [
      "STT",
      "sO_BBAN",
      "nO_BBAN",
      "sO_TEM_SD",
      "loaI_PT",
      "ngaY_NIEM_PHONG",
    ];
  } else {
    console.error("Loại không hợp lệ, chỉ hỗ trợ 'Chì' hoặc 'Tem'");
    return null;
  }

  // Thêm tiêu đề bảng:
  const title = `MẪU NHẬP DỮ LIỆU QT ${type === "Chì" ? "CHÌ" : "TEM"}`;
  const titleRow = worksheet.addRow([title]);
  titleRow.font = { bold: true, size: 16 };
  titleRow.alignment = { horizontal: "center" };
  worksheet.mergeCells(`A1:${String.fromCharCode(64 + headers.length)}1`);

  // Label
  const labelRow = worksheet.addRow(headers.map(h => labelMap[h] || h));
  labelRow.font = { bold: true };
  labelRow.alignment = { horizontal: "center", vertical: "middle" };
  labelRow.eachCell(cell => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BDD7EE" } };
    cell.border = {
      top: { style: "thin" }, bottom: { style: "thin" },
      left: { style: "thin" }, right: { style: "thin" },
    };
  });

  // Thêm dòng headers (kỹ thuật)
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { italic: true, color: { argb: "888888" }, size: 9 };
  headerRow.hidden = true; //Ẩn hiện tên trường

  // Thêm dòng ví dụ:
  const exampleRow = headers.map(header => {
    if (header === "STT") return { formula: "ROW()-3" };
    if (["booC_CONGQUANG", "cuA_TU", "chuP_BUZI_TI_TU", "sO_TEM_SD", "tonG_SO_CHI_THU_HOI"].includes(header)) return 0;
    if (header === "loaI_PT") return arrLoaiPhuongTienTND[0].name;
    if (header === "ngaY_NIEM_PHONG") {
      const now = new Date();
      const fixedDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      return fixedDate;
    };
    return "";
  });
  const rowData = worksheet.addRow(exampleRow);

  //Căn giữa STT:
  const sttColIndex = headers.indexOf("STT") + 1;
  worksheet.getColumn(sttColIndex).alignment = { horizontal: "center" };

  // Định dạng ngày:
  const ngayColIndex = headers.indexOf("ngaY_NIEM_PHONG");
  if (ngayColIndex !== -1) {
    worksheet.getColumn(ngayColIndex + 1).numFmt = "dd/mm/yyyy";
  }

  //Validate ngày:
  if (ngayColIndex !== -1) {
    const colLetter = getExcelAlpha(ngayColIndex + 1);
    const cellAddress = `${colLetter}${rowData.number}`;

    worksheet.dataValidations.add(cellAddress, {
      type: "date",
      operator: "between",
      allowBlank: true,
      formulae: [new Date(2000, 0, 1), new Date(2100, 11, 31)], // khoảng ngày cho phép
      showErrorMessage: true,
      errorTitle: "Ngày không hợp lệ",
      error: "Vui lòng nhập ngày đúng định dạng dd/mm/yyyy từ 01/01/2000 đến 31/12/2100.",
    });
  }

  // Dropdown cho loại phương tiện:
  const loaiPTColIndex = headers.indexOf("loaI_PT") + 1;
  worksheet.getColumn(loaiPTColIndex).eachCell((cell, rowNumber) => {
    if (rowNumber > 3) {
      worksheet.dataValidations.add(cell.address, {
        type: "list",
        allowBlank: true,
        formulae: [`"${arrLoaiPhuongTienTND.map(i => i.name).join(",")}"`],
        showDropDown: true,
      });
    }
  });

  // Ràng buộc số nguyên ≥ 0:
  const numberCols = [
    "booC_CONGQUANG",
    "cuA_TU",
    "chuP_BUZI_TI_TU",
    "tonG_SO_CHI_THU_HOI",
    "tonG_SO_CHI_NIEM_PHONG",
    "sO_TEM_SD"
  ];
  numberCols.forEach(col => {
    const idx = headers.indexOf(col);
    if (idx !== -1) {
      worksheet.getColumn(idx + 1).eachCell((cell, rowNumber) => {
        if (rowNumber > 3) {
          worksheet.dataValidations.add(cell.address, {
            type: "whole",
            operator: "greaterThanOrEqual",
            formulae: [0],
            showErrorMessage: true,
            errorStyle: "stop",
            errorTitle: "Giá trị không hợp lệ",
            error: "Chỉ được nhập số nguyên lớn hơn hoặc bằng 0",
          });
        }
      });
    }
  });

  // Công thức tự động tính tổng chì niêm phong (nếu là loại chì):
  if (isQTChi) {
    const boocIndex = headers.indexOf("booC_CONGQUANG") + 1;
    const cuaIndex = headers.indexOf("cuA_TU") + 1;
    const chupIndex = headers.indexOf("chuP_BUZI_TI_TU") + 1;
    const tongIndex = headers.indexOf("tonG_SO_CHI_NIEM_PHONG") + 1;

    const exampleRowNumber = rowData.number;

    const getLetter = (index) => worksheet.getColumn(index).letter;
    worksheet.getCell(exampleRowNumber, tongIndex).value = {
      formula: `SUM(${getLetter(boocIndex)}${exampleRowNumber},${getLetter(cuaIndex)}${exampleRowNumber},${getLetter(chupIndex)}${exampleRowNumber})`,
      result: 0
    };
  }

  // Auto width:
  worksheet.columns.forEach((col, i) => {
    const headerLength = (labelMap[headers[i]] || headers[i]).length;
    col.width = headerLength + 5;
  });

  addSummaryTable(worksheet, headers, type, rowData.number);

  // Xuất file:
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};


//Bảng phụ tính tổng số:
function addSummaryTable(worksheet, headers, type, startRow = 4,  startColIndex = headers.length + 3) {
  const thuHoiColIndex = headers.indexOf("tonG_SO_CHI_THU_HOI") + 1;
  const niemPhongColIndex = headers.indexOf("tonG_SO_CHI_NIEM_PHONG") + 1;
  const temSDColIndex = headers.indexOf("sO_TEM_SD") + 1;

  const isQTChi = type == "Chì";
  const isQTTem = type == "Tem";

  const lastRowNumber = worksheet.lastRow.number;
  let rowOffset = lastRowNumber;

  const addRow = (label, colIndex) => {

    const labelCell = worksheet.getCell(rowOffset, startColIndex);
    const valueCell = worksheet.getCell(rowOffset, startColIndex + 1);

    labelCell.value = label;
    labelCell.font = { bold: true };
    labelCell.alignment = { horizontal: "center", vertical: "middle" };
    labelCell.border = {
      top: { style: "thin" }, bottom: { style: "thin" },
      left: { style: "thin" }, right: { style: "thin" },
    };

    if (colIndex > 0) {
      const colLetter = getExcelAlpha(colIndex);
      valueCell.value = { formula: `SUM(${colLetter}${startRow}:${colLetter}1000)`};
    } else {
      valueCell.value = "";
    }

    valueCell.alignment = { horizontal: "center", vertical: "middle" };
    valueCell.border = {
      top: { style: "thin" }, bottom: { style: "thin" },
      left: { style: "thin" }, right: { style: "thin" },
    };

    rowOffset++;
  };

  if (isQTChi) {
    addRow("Tổng chì thu hồi", thuHoiColIndex);
    addRow("Tổng chì niêm phong", niemPhongColIndex);
  } else if (isQTTem) {
    addRow("Tổng tem sử dụng", temSDColIndex);
  }

  // Auto width bảng phụ
  worksheet.getColumn(startColIndex).width = 22;
  worksheet.getColumn(startColIndex + 1).width = 16;
}


function getExcelAlpha(colIndex) {
  let result = '';
  while (colIndex > 0) {
    const remainder = (colIndex - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    colIndex = Math.floor((colIndex - 1) / 26);
  }
  return result;
}