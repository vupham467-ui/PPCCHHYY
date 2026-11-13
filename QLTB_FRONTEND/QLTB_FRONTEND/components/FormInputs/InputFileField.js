import { memo, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import DocxViewerComponent from "../DOCViewer";
import PDFViewerComponent from "../PDFViewer";
import { urlServer } from "../../constants/api";

const InputFileField = ({
  label = "Tải lên tệp",
  name,
  value,              // File | null
  fileUrl = null,     // URL file cũ
  onChange,
  error,
  required = false,
  disabled = false,
  accept = "*",
  showPreview = false,
  divClassName = "flex flex-column gap-2 w-full",
  labelClassName = "font-bold text-sm mb-1 block",
  showToast
}) => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Sync file mới từ form
  useEffect(() => {
    if (value instanceof File) {
      setSelectedFile(value);
      setPreviewBlobUrl(null); // reset preview cũ
    }
  }, [value]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
      // ===== Validate định dạng PDF =====
  const isPdfByType = file.type === "application/pdf";
  const isPdfByName = file.name.toLowerCase().endsWith(".pdf");

  if (!isPdfByType && !isPdfByName) {
    showToast?.("error", "Chỉ cho phép tải lên file PDF");
    e.target.value = "";
    return;
  }

    setSelectedFile(file);
    setPreviewBlobUrl(null);

    onChange?.({
      target: {
        name,
        value: file,
      },
    });
  };

  const handleOpenPreview = async () => {
    // Có file mới → preview trực tiếp
    if (selectedFile) {
      setIsDialogVisible(true);
      return;
    }

    // Có URL → fetch → blob
    if (fileUrl && !previewBlobUrl) {
      try {
        setLoadingPreview(true);

        const url = urlServer + fileUrl;
        const res = await fetch(url, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Không tải được file");

        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPreviewBlobUrl(blobUrl);
      } catch (e) {
        console.error(e);
        showToast?.("error", "Không thể xem trước file");
        return;
      } finally {
        setLoadingPreview(false);
      }
    }

    setIsDialogVisible(true);
  };

  const renderPreviewContent = () => {
    // File mới
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);

      if (selectedFile.type === "application/pdf") {
        return <PDFViewerComponent pdfData={url} fileName={selectedFile.name} />;
      }

      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type === "application/msword"
      ) {
        return <DocxViewerComponent file={selectedFile} />;
      }

      return (
        <a href={url} download className="text-blue-600 underline">
          Tải file ({selectedFile.name})
        </a>
      );
    }

    // File cũ (URL → Blob)
    if (previewBlobUrl) {
      return <PDFViewerComponent pdfData={previewBlobUrl} fileName="File đã lưu" />;
    }

    return <p>Không có dữ liệu xem trước</p>;
  };

  return (
    <div className={divClassName}>
      {label && (
        <label htmlFor={name} className={labelClassName}>
          {label} {required && <span className="text-red-500">(*)</span>}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <Button
        icon="pi pi-upload"
        onClick={() => fileInputRef.current.click()}
        className="bg-white text-primary border w-full justify-start"
        label={selectedFile?.name || (fileUrl ? "Đã có file" : "Chọn file")}
        disabled={disabled}
      />

      {(selectedFile || fileUrl) && showPreview && (
        <Button
          icon="pi pi-eye"
          className="bg-white text-primary border w-full"
          label={loadingPreview ? "Đang tải..." : "Xem trước"}
          onClick={handleOpenPreview}
          disabled={loadingPreview}
        />
      )}

      {error && <small className="p-error">{error}</small>}

      <Dialog
        header="Xem trước file"
        visible={isDialogVisible}
        className="w-11 lg:w-9 xl:w-7"
        onHide={() => setIsDialogVisible(false)}
      >
        {renderPreviewContent()}
      </Dialog>
    </div>
  );
};

export default memo(InputFileField);
