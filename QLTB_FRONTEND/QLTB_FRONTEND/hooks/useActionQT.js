import { useMemo } from "react";
import { storageHelper } from "../utils/storageUtils";

const useActionQT = (dataReport) => {
    const user = storageHelper.get("user") || {};

    const isAdmin = user?.ma_dviqly === "PA23" && user?.is_admin == "Y";


    return useMemo(() => {
        if (!dataReport) {
            return {
                isNguoiTaoPhieu: false,
                isNguoiQLy: false,
                isTruongDv: false,
                showKyCap1Btn: false,
                showKyCap2Btn: false,
                showKyCap3Btn: false,
                showDeleteBtn: false,
                showViewBtn: false,
                showDestroyBtn: false,
            };
        }

        //Với cấp 3 là dữ liệu bên phải:
        const trang_thai = dataReport?.tranG_THAI || 0;
        const nguoi_qtoan = dataReport?.nguoI_QUYET_TOAN || dataReport?.nguoI_DVLINH || "";
        const nguoi_qly = dataReport?.nguoI_QUANLY_KIMCHI || dataReport?.nguoI_QUANLY_CHI || "";
        const truongdv = dataReport?.lanhdaO_QUANLY_KIMCHI || dataReport?.truongdV_QUANLY_CHI || "";
        const isNguoiTaoPhieu = user.id == nguoi_qtoan;
        const isNguoiQLy = user.id == nguoi_qly;
        const isTruongDv = user.id == truongdv;
        //Biên bản chờ duyệt và là người tạo phiếu thì có thể sửa và ký C1:
        const showKyCap1Btn = isNguoiTaoPhieu && trang_thai == 0;
        //Biên bản đã ký cấp 1 và là người nhận thì có thể ký C2:
        const showKyCap2Btn = isNguoiQLy && trang_thai == 1;
        //Biên bản đã ký cấp 2 và là người nhận thì có thể ký C3:
        const showKyCap3Btn = isTruongDv && trang_thai == 2;
        //Người tạo phiếu có thể xóa biên bản chờ duyệt:
        const showDeleteBtn = isNguoiTaoPhieu && trang_thai == 0;
        // const showDeleteBtn = true;
        //Hiện nút view nếu không hiện đồng thời nút ký C1 và nút ký cấp 2 hoặc không phải người giao và cũng không phải người nhận:
        const showViewBtn = (!showKyCap1Btn && !showKyCap2Btn && !showKyCap3Btn) || (!isNguoiTaoPhieu && !isNguoiQLy && !isTruongDv);
        //Người tạo phiếu có thể hủy khi biên bản mới tạo hoặc đã ký cấp 1:
        const showDestroyBtn = (isNguoiTaoPhieu && (trang_thai == 0 || trang_thai == 1)) || isAdmin;

        return {
            isNguoiTaoPhieu,
            isNguoiQLy,
            isTruongDv,
            showKyCap1Btn,
            showKyCap2Btn,
            showKyCap3Btn,
            showDeleteBtn,
            showViewBtn,
            showDestroyBtn,
        };
    }, [dataReport, user]);
}


export default useActionQT;