import { Button } from "primereact/button";
import { headerStyleColumn } from "../constants/propGlobal";

const ReloadButton = ({ onReload, isLoading, label = "" }) => {
    return (
        <Button
            label={label}
            tooltip="Tải lại"
            style={{backgroundColor: headerStyleColumn.backgroundColor}}
            tooltipOptions={{ position: 'left' }} 
            icon="pi pi-sync"
            //   className={`p-button-outlined ${isLoading ? "p-disabled" : ""}`}
            onClick={onReload}
            disabled={isLoading}
        />
    );
};

export default ReloadButton;
