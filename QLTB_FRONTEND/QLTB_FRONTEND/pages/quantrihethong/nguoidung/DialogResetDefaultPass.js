
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";

const DEFAULT_PASSWORD = "DLHY@123"

const DialogResetDefaultPass = ({ idNguoiDung, account, visible, onClose, toast }) => {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        try {
            const res = await HT_NGUOIDUNG_Service.resetDefaultPassword({ ID: idNguoiDung, defaultPassword: DEFAULT_PASSWORD });
            console.log(`ResetPassword: ${res}`);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Reset mật khẩu thành công!', life: 5000 });
            onClose();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Reset mật khẩu thất bại!', life: 3000 });
        }
        setLoading(false);
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(DEFAULT_PASSWORD);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Dialog header="Reset mật khẩu" visible={visible} style={{ width: '400px' }} onHide={onClose}>
                <div className="flex flex-column gap-4">
                <div className="flex flex-column gap-2">
                    <label htmlFor="resetPassword">Tài khoản <span className="font-bold">{account}</span> sẽ reset về mật khẩu mặc định:</label>
                    <div className="p-inputgroup">
                        <InputText id="resetPassword" 
                            value={DEFAULT_PASSWORD} 
                            readOnly 
                            className="w-full text-center font-bold text-xl"
                        />
                        <Button icon="pi pi-copy" onClick={handleCopyPassword} tooltip="Sao chép mật khẩu" tooltipOptions={{ position: "top" }} />
                    </div>
                    {copied && <small className="text-green-500">Mật khẩu đã được sao chép!</small>}
                </div>

                </div>

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Hủy" icon="pi pi-times" className="p-button-outlined" onClick={onClose} />
                    <Button label="Xác nhận" icon="pi pi-check" onClick={handleReset} loading={loading} />
                </div>
            </Dialog>
        </>
    );
};

export default DialogResetDefaultPass;