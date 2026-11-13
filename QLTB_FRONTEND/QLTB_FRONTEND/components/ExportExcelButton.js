import React from "react";
import { exportToExcel } from "../utils/excelUtils";
import { Button } from "primereact/button";


const ExportExcelButton = ({ fetchData, ...props }) => {

    const { fileName, sheetName, mapKeys, title, isLoading, disabled = false } = props;

    const handleExport = async () => {
        try {
            if (!fetchData) {
                console.warn("No fetchData function provided.");
                return;
            }

            const data = await fetchData();

            let newTitle = (fileName || "").toUpperCase();
            if (title) {
                newTitle = title.toUpperCase();
            }

            exportToExcel(data, fileName, sheetName, mapKeys, newTitle);
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
        }
    };

    return (
        <Button
            icon="pi pi-file-export"
            label="Xuất Excel"
            className="p-button-success"
            onClick={handleExport}
            loading={isLoading}
            disabled={disabled || isLoading}
        />
    );

};

export default ExportExcelButton;
