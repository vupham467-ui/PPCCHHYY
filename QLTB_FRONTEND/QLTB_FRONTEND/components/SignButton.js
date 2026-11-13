import { Button } from "primereact/button";
import useAction from "../hooks/useAction";


const SignButton = ({ dataReport, signC1, signC2, showToast, isSigned = false, disabled = true, loading = false }) => {
    const { isNguoiTaoPhieu, isNguoiNhan, showKyCap1Btn, showKyCap2Btn,
         showDeleteBtn, showViewBtn, showDestroyBtn, showTralaiBtn, showQuyetToanBtn } = useAction(dataReport);
    const showKySoBtn = showKyCap1Btn || showKyCap2Btn;

    const idBienBan = dataReport?.id_bienban || dataReport?.id || "";
    const nguoi_nhan = dataReport?.nguoI_NHAN || dataReport?.nguoi_nhan || "";
    const id_kim = dataReport?.id_kim || dataReport?.id_kim || 0;
    if (!showKySoBtn || isSigned) {
        return null;
    }
    return (
        <Button
            label="Ký số"
            severity="success"
            className="me-3"
            style={{ 
                marginRight: "10px",
                backgroundColor: disabled ? "#ccc" : undefined,
                borderColor: disabled ? "#ccc" : undefined,
                color: disabled ? "#666" : undefined,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.3s ease" 
            }}
            loading={loading}
            disabled={disabled}
            onClick={() => {
                if (nguoi_nhan) {
                    if (showKyCap1Btn) {
                        signC1(idBienBan, id_kim);
                    } else {
                        signC2(idBienBan, id_kim);
                    }
                } else {
                    showToast("error", "Vui lòng chọn người nhận!");
                }
            }}
        />
    );
}

export default SignButton;