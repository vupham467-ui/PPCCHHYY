import { Button } from "primereact/button";
import useAction from "../../hooks/useAction";


const SignButtonQLTB = ({ dataReport, sign, showToast, isSigned = false, disabled = true, loading = false }) => {
    const { isNguoiTaoPhieu, isNguoiNhan, showKyCap1Btn, showKyCap2Btn,
         showDeleteBtn, showViewBtn, showDestroyBtn, showTralaiBtn, showQuyetToanBtn } = useAction(dataReport);
    const showKySoBtn = showKyCap1Btn || showKyCap2Btn;

    const idBienBan = dataReport?.id_bienban || dataReport?.id || "";
    const nguoi_nhan = dataReport?.nguoI_NHAN || dataReport?.nguoi_nhan || "";

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
                        sign(idBienBan, 1);
                    } else {
                        sign(idBienBan, 2);
                    }   
                } else {
                    showToast("error", "Vui lòng chọn người nhận!");
                }
            }}
        />
    );
}

export default SignButtonQLTB;