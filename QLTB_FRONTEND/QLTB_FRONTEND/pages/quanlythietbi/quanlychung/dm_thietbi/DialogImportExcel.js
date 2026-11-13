import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { thietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { storageHelper } from "../../../../utils/storageUtils";

const DialogImportExcel = ({ 
    visible, 
    setVisible,
    showToast, 
    loadData,  
    current_MADVIQLY
}) => {
  const [importFile, setImportFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const user = storageHelper.get("user");
  const { ho_ten, ten_dang_nhap, dm_donvi_id, ma_dviqly } = user;

  // const handleUpload = async () => {
  //   if (!importFile) return;
  //   setIsUploading(true);

  //   try {
  //     //Chỉ Admin hoặc người quản lý TB tại P10 khi thêm excel tính là duyệt luôn:
  //     const dsQuyen = user?.ds_quyen || "";
  //     const dsQuyenArr = dsQuyen.split(',');
  //     const checkQuyenDuyet = ['ADMIN', 'QLTB_QLP10'];
  //     const hasQuyenDuyet = dsQuyenArr.some(q => checkQuyenDuyet.includes(q));
      
  //     // Gọi service import
  //     const result = await thietBiService.importExcel({
  //       file: importFile,
  //       ma_dvi: current_MADVIQLY,
  //       username: ten_dang_nhap,
  //       duyet_ngay: hasQuyenDuyet == true ? "Y" : "N"
  //     });

  //     const successCount = result.totalValid || 0;
  //     const errorCount = result.totalError || 0;

  //     // Hàm phụ tạo file .txt lỗi và trả về tên file
  //     const createErrorFile = (errors) => {
  //       const errorsText = errors.map((err, idx) => `${idx + 1}. ${err}`).join("\r\n");
  //       const blob = new Blob([errorsText], { type: "text/plain;charset=utf-8" });
  //       const fileName = `LoiImport_${new Date().toISOString().slice(0, 10)}.txt`;
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.setAttribute("download", fileName);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //       return fileName;
  //     };

  //     if (result.success) {
  //       if (errorCount === 0) {
  //         showToast("success", `${successCount} thiết bị đã được import thành công!`);
  //       } else if (errorCount === 1) {
  //         showToast(
  //           "success",
  //           `Import ${successCount} thiết bị thành công, 1 lỗi: ${result.errors[0]}`
  //         );
  //       } else {
  //         const errorFileName = createErrorFile(result.errors);
  //         showToast(
  //           "success",
  //           `Import ${successCount} thiết bị thành công, ${errorCount} thiết bị lỗi. Chi tiết lỗi được lưu trong file ${errorFileName}`
  //         );
  //       }
  //     } else {
  //       // Toàn bộ thất bại
  //       if (errorCount === 1) {
  //         showToast("error", result.errors[0]);
  //       } else if (errorCount > 1) {
  //         const errorFileName = createErrorFile(result.errors);
  //         showToast("error", `Toàn bộ import thất bại. Chi tiết lỗi trong file ${errorFileName}`);
  //       } else {
  //         showToast("error", "Import thất bại nhưng không có chi tiết lỗi.");
  //       }
  //     }

  //     // Reset UI
  //     setImportFile(null);
  //     setVisible(false);
  //     loadData();
  //   } catch (err) {
  //     showToast("error", err.message || "Có lỗi xảy ra khi upload file.");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };


  // handleUpload mới
  
  const handleUpload = async () => {
    if (!importFile) return;
    setIsUploading(true);

    try {
      const dsQuyen = user?.ds_quyen || "";
      const dsQuyenArr = dsQuyen.split(",");
      const checkQuyenDuyet = ["ADMIN", "QLTB_QLP10"];
      const hasQuyenDuyet = dsQuyenArr.some(q => checkQuyenDuyet.includes(q));

      const data = await thietBiService.importExcel_v2({
        file: importFile,
        ma_dvi: current_MADVIQLY,
        username: ten_dang_nhap,
        duyet_ngay: hasQuyenDuyet ? "Y" : "N",
      });
      
    const totalValid = data?.totalValid  || 0;
    // Nếu backend trả file lỗi
    if (!data.success && data.fileContent) {
      const byteArray = Uint8Array.from(atob(data.fileContent), c => c.charCodeAt(0));
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `ThietBi_Loi${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      if (totalValid > 0) {
        showToast(
          "warn",
          data.message || `${totalValid} dòng đã import thành công. Một số dòng có lỗi, vui lòng mở file tải xuống để chỉnh sửa và upload lại.`,
          10000
        );
      } else {
        showToast("error", "Tất cả thất bại. Vui lòng mở file tải xuống để chỉnh sửa và upload lại.", 10000);
      }
    } else {
      showToast("success", data.message || `${data.totalValid} thiết bị đã được import.`, 10000);
    }

      // Reset UI
      setImportFile(null);
      setVisible(false);
      loadData();
    } catch (err) {
      const message = err?.response?.data?.detail ||  err?.response?.data?.message || "Có lỗi xảy ra khi upload file.";
      showToast("error", message , 10000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
        setIsLoadingTemplate(true); 
        if (!current_MADVIQLY) {
            showToast("error", "Không thấy đơn vị hiện tại!");
            return;
        }
        const res = await thietBiService.downloadTemplateExcel({current_madviqly: current_MADVIQLY});
        // Tạo URL tạm thời cho file
        const blob = new Blob([res.data], { type: res.data.type });
        const downloadUrl = window.URL.createObjectURL(blob);

        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

        // Lấy tên file từ header Content-Disposition nếu có, fallback nếu không
        const contentDisposition = res.headers['content-disposition'];
        let fileName = `${current_MADVIQLY}_MauNhapThietBi_${dateStr}.xlsx`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) fileName = match[1];
        }

        // Tạo link download và click
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Giải phóng object URL
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.log(error);
        showToast("error", "Có lỗi xảy ra!");
    } finally {
        setIsLoadingTemplate(false);
    }
  }

  return (
    <Dialog
      header="Import dữ liệu từ Excel"
      visible={visible}
      style={{ width: "450px", maxWidth: "90%" }}
      onHide={() => setVisible(false)}
      modal
      className="p-dialog-rounded p-p-3"
    >
      <div className="flex flex-column gap-4">
        
        {/* Nút tải file mẫu */}
        <Button
          label="Tải file mẫu"
          icon="pi pi-download"
          onClick={handleDownloadTemplate}
          loading={isLoadingTemplate}
          className="p-button-info p-button-outlined"
          style={{ width: "100%" }}
        />

        {/* Chọn file */}
        <div className="flex flex-column gap-2">
            <label className="font-medium text-gray-700">Chọn file Excel:</label>
            <div className="flex align-items-center gap-3">
                <Button
                    label="Chọn file"
                    icon="pi pi-upload"
                    className="p-button-rounded p-button-secondary"
                    onClick={() => document.getElementById("importFile").click()}
                />
                <span className="text-gray-600 italic">
                    {importFile ? importFile.name : "Chưa chọn file nào"}
                </span>
            </div>
            <input
                type="file"
                id="importFile"
                accept=".xlsx,.xls"
                hidden
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const allowedTypes = [
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/vnd.ms-excel",
                    ];

                    if (!allowedTypes.includes(file.type)) {
                        showToast("error", "Vui lòng chọn file Excel (.xlsx hoặc .xls)!");
                        e.target.value = null; // reset input
                        setImportFile(null);
                        return;
                    }

                    setImportFile(file);
                }}
            />
        </div>

        {/* Nút upload */}
        <Button
          label="Import"
          icon="pi pi-cloud-upload"
          className="p-button-success"
          disabled={!importFile || isUploading}
          loading={isUploading}
          onClick={handleUpload}
          style={{ width: "100%" }}
        />

      </div>
    </Dialog>

  );
};

export default DialogImportExcel;
