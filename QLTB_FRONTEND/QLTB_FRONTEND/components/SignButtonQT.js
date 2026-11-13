import { Button } from "primereact/button";
import useActionQT from "../hooks/useActionQT";


const SignButtonQT = ({ dataReport, signC1, signC2, signC3, showToast, isSigned = false, disabled = true, loading = false }) => {
    const { isNguoiTaoPhieu, isNguoiQLy, isTruongDv, showKyCap1Btn, showKyCap2Btn, showKyCap3Btn,
        showDeleteBtn, showViewBtn, showDestroyBtn } = useActionQT(dataReport);

    const showKySoBtn = showKyCap1Btn || showKyCap2Btn || showKyCap3Btn;

    const idBienBan = dataReport?.iD_QUYETTOAN || dataReport?.id || "";
    const nguoi_qly = dataReport?.nguoI_QUANLY_KIMCHI || dataReport?.nguoI_QUANLY_CHI || "";
    const truongdv = dataReport?.lanhdaO_QUANLY_KIMCHI || dataReport?.truongdV_QUANLY_CHI || "";

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
            disabled={disabled}
            loading={loading}
            onClick={() => {
                if (showKyCap1Btn) {
                    if (nguoi_qly && truongdv) {
                        signC1(idBienBan);
                    } else {
                        showToast("error", "Vui lòng chọn đủ người quản lý kìm chì và trưởng đơn vị!");
                    }
                } else if (showKyCap2Btn) {
                    signC2(idBienBan);
                } else if (showKyCap3Btn) {
                    signC3(idBienBan);
                }
            }}
        />
    );
}

export default SignButtonQT;