import { useMemo } from "react";
import { storageHelper } from "../utils/storageUtils";

const useAction = (dataReport) => {
    const user = storageHelper.get("user") || {};
    const isAdmin = user?.is_admin == "Y" && user?.ma_dviqly === "PA23";
    
    const returnAble = dataReport?.dA_THU_HOI == "N" || dataReport?.da_thu_hoi == "N";

    return useMemo(() => {
        if (!dataReport) {
            return {
                isNguoiTaoPhieu: false,
                isNguoiNhan: false,
                showKyCap1Btn: false,
                showKyCap2Btn: false,
                showDeleteBtn: false,
                showViewBtn: false,
                showDestroyBtn: false,
                showQuyetToanBtn: false,
                showThuHoiBtn: false,
            };
        }

        const trang_thai = dataReport?.tranG_THAI || dataReport?.trang_thai || 0;
        const nguoi_giao = dataReport?.nguoI_GIAO || dataReport?.nguoi_giao || "";
        const nguoi_nhan = dataReport?.nguoI_NHAN || dataReport?.nguoi_nhan || "";
        const loai_bienban = dataReport?.loaI_BBAN || dataReport?.loai_bban || "";

        const isNguoiTaoPhieu = user?.id == nguoi_giao || user?.ten_dang_nhap == nguoi_giao;
        const isNguoiNhan = user?.id == nguoi_nhan || user?.ten_dang_nhap == nguoi_nhan;

        //Biên bản chờ duyệt và là người tạo phiếu thì có thể sửa và ký C1:
        const showKyCap1Btn = isNguoiTaoPhieu && trang_thai == 0;
        //Biên bản đã ký cấp 1 và là người nhận thì có thể ký C2:
        const showKyCap2Btn = isNguoiNhan && trang_thai == 1;
        //Người tạo phiếu có thể xóa biên bản chờ duyệt:
        const showDeleteBtn = isNguoiTaoPhieu && trang_thai == 0;
        // const showDeleteBtn = true;
        //Hiện nút view nếu không hiện đồng thời nút ký C1 và nút ký cấp 2 hoặc không phải người giao và cũng không phải người nhận:
        const showViewBtn = (!showKyCap1Btn && !showKyCap2Btn) || (!isNguoiTaoPhieu && !isNguoiNhan);
        //Người tạo phiếu có thể hủy khi biên bản đã ký cấp 1:
        const showDestroyBtn = (isNguoiTaoPhieu && (trang_thai == 1)) || (isAdmin && trang_thai !== 0);


        //Nếu là người tạo phiếu và loại biên bản = 0 (giao), đã ký cả 2 cấp và chưa có biên bản trả lại: (phiếu bàn giao kìm)
        const showThuHoiBtn = isNguoiTaoPhieu && loai_bienban == 0 && trang_thai == 2 && returnAble;
        // const showChiTietTralaiBtn = (isNguoiNhan || isNguoiTaoPhieu) && loai_bienban == 0 && trang_thai == 2;

        //Với trả lại tem chì C4 (loại biên bản giao đang là 1):
        // const showTLTemChiC4Btn = isNguoiNhan && loai_bienban == 1 && trang_thai == 2;
        //Nếu là người nhận và loại biên bản = 1 và đã ký cả 2 cấp (với phiếu bàn giao tem, chì loại biên bản là 1)
        const showQuyetToanBtn = isNguoiNhan && loai_bienban == 1 && trang_thai == 2;

        return {
            isNguoiTaoPhieu,
            isNguoiNhan,
            showKyCap1Btn,
            showKyCap2Btn,
            showDeleteBtn,
            showViewBtn,
            showDestroyBtn,
            showQuyetToanBtn,
            showThuHoiBtn,
        };
    }, [dataReport, user]);
};

export default useAction;