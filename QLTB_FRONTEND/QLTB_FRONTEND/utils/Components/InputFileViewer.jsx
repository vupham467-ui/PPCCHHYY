import { memo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PDFViewerComponent from "../../components/PDFViewer";
import DocViewerComponent from "../../components/DOCViewer";
import { Notification } from "../notification";

const InputFileViewer = ({ onChange, label = "Upload file", className, nameField, setFormData, showSelectedFile = true, showPreview = false, isDisabled = false }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const fileInputRef = useRef(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        ];
        const allowedExtensions = ["pdf", "docx"];

        const fileTypeValid = allowedTypes.includes(file.type);
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const fileExtensionValid = allowedExtensions.includes(fileExtension);
        if (!fileTypeValid || !fileExtensionValid) {
            Notification("Chỉ chấp nhận file định dạng .docx hoặc .pdf.");
            e.target.value = ""; // reset input
            return;
        }

        if (file) {
            setSelectedFile(file);
            const fileURL = URL.createObjectURL(file);
            if (fileURL) {
                setFileURL(fileURL);
            }
            const formData = new FormData();
            formData.append("file", file);
            if (setFormData) {
                setFormData((prev) => ({
                    ...prev,
                    [nameField || "file"]: formData,
                }));
            }
            if (onChange) {
                onChange(formData);
            }
        }
    };

    const handlePreview = () => {
        setIsDialogVisible(true);
    };

    const renderPreviewContent = () => {
        if (!selectedFile && !fileURL) return null;
        if (selectedFile.type === "application/pdf") {
            // Hiển thị file PDF bằng <embed>
            return (
                // <embed
                //     src={fileURL}
                //     type="application/pdf"
                //     width="100%"
                //     height="500px"
                // />
                <PDFViewerComponent pdfData={fileURL} fileName={selectedFile.name} plugin={defaultLayoutPluginInstance} /> 
                    
            );
        } else if (
            selectedFile.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // DOCX
            selectedFile.type === "application/msword" // DOC
        ) {
            // Hiển thị link mở bằng Google Docs Viewer
            return (
                // <iframe
                //     src={`https://docs.google.com/viewer?url=${fileURL}&embedded=true`}
                //     width="100%"
                //     height="500px"
                //     title="Preview"
                // />
                <DocViewerComponent file={selectedFile} /> 
            );
        } else {
            // Hiển thị nút tải xuống nếu không hỗ trợ xem trước
            return (
                <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-link"
                >
                    Nhấn vào đây để tải file
                </a>
            );
        }
    };

    return (
        <div className={`flex flex-column gap-2 ${className}`}>
            <div className="flex flex-column gap-2">
                <span>
                    <input
                        type="file"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Button
                        tooltipOptions={{position:"bottom"}}
                        tooltip="Nhấn vào để thay đổi File"
                        onClick={() => fileInputRef.current.click()}
                        severity="info"
                        className="bg-white text-primary"
                        style={{
                            width: "100%",
                            maxHeight: "40px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                        disabled={isDisabled}
                        icon={"pi pi-upload"}
                        label={selectedFile ? selectedFile.name : "Chọn file"}
                    />
                </span>
                {selectedFile && showPreview && (
                    <Button
                        tooltip="Xem trước File"
                        onClick={handlePreview}
                        severity="secondary"
                        title="Xem trước File"
                        className="bg-white text-primary mt-2"
                        style={{ maxHeight: "40px" }}
                        icon={"pi pi-eye"}
                        label="Xem trước File"
                        disabled={isDisabled}
                    />
                )}
            </div>

            {/* Dialog hiển thị preview */}
            {
                isDialogVisible && (
                    <Dialog
                        header="Xem trước File"
                        visible={isDialogVisible}
                        style={{ width: "80%" }}
                        onHide={() => setIsDialogVisible(false)}
                    >
                        {renderPreviewContent()}
                    </Dialog>
                )
            }
        </div>
    );
};

export default memo(InputFileViewer);
