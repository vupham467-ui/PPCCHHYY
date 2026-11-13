import { useMemo } from "react";
import { storageHelper } from "../utils/storageUtils";

const useActionQLTB = (dataReport) => {
    const user = storageHelper.get("user") || {};
    const isAdmin = user?.is_admin == "Y" && user?.ma_dviqly === "PA23";

    return useMemo(() => {
        if (!dataReport) {
            return {
                isNguoiTaoPhieu: false,
                isNguoiKyC1: false,
                isNguoiNhan: false,
                showUpdateBtn: false,
                showKyCap1Btn: false,
                showKyCap2Btn: false,
                showDeleteBtn: false,
                showViewBtn: false,
                showDestroyBtn: false,
                showThanhLyBtn: false,
                showThongTinThanhLy: false,
                showDuyetThanhLy: false,
            };
        }

        const trang_thai = dataReport?.tranG_THAI || dataReport?.trang_thai || 0;
        const nguoi_giao = dataReport?.nguoI_GIAO || dataReport?.nguoi_giao || "";
        const nguoi_nhan = dataReport?.nguoI_NHAN || dataReport?.nguoi_nhan || "";
        const nguoi_tao = dataReport?.nguoI_TAO || dataReport?.nguoi_tao || "";
        const loai_bienban = dataReport?.loaI_BBAN || dataReport?.loai_bban || "";
        const trang_thai_thanh_ly = dataReport?.trang_thai_thanh_ly || "";
        const nguoi_kiemsoat = dataReport?.nguoi_kiemsoat || "";

        const isNguoiTaoPhieu = user?.id == nguoi_tao || user?.ten_dang_nhap == nguoi_tao;
        const isNguoiKyC1 = user?.id == nguoi_giao || user?.ten_dang_nhap == nguoi_giao;
        const isNguoiNhan = user?.id == nguoi_nhan || user?.ten_dang_nhap == nguoi_nhan;
        const isNguoiDuyetThanhLy = user?.ten_dang_nhap == nguoi_kiemsoat;
        
        const showUpdateBtn = isNguoiTaoPhieu && trang_thai == 0;
        //Biên bản chờ duyệt và là người tạo phiếu thì có thể sửa và ký C1:
        const showKyCap1Btn = isNguoiKyC1 && trang_thai == 0;
        //Biên bản đã ký cấp 1 và là người nhận thì có thể ký C2:
        const showKyCap2Btn = isNguoiNhan && trang_thai == 1;
        //Người tạo phiếu có thể xóa biên bản chờ duyệt:
        const showDeleteBtn = isNguoiTaoPhieu && trang_thai == 0;
        // const showDeleteBtn = true;
        //Hiện nút view nếu không hiện đồng thời nút ký C1 và nút ký cấp 2 hoặc không phải người giao và cũng không phải người nhận:
        const showViewBtn = (!showKyCap1Btn && !showKyCap2Btn) || (!isNguoiKyC1 && !isNguoiNhan);
        //Người tạo phiếu có thể hủy khi biên bản đã ký cấp 1:
        const showDestroyBtn = ((isNguoiTaoPhieu || isAdmin) && (trang_thai == 1));

        //Nút thanh lý thiết bị:
        const canThanhLy = isNguoiTaoPhieu && trang_thai == 2;
        const showThanhLyBtn = canThanhLy && trang_thai_thanh_ly == -1;
        const showThongTinThanhLy = trang_thai == 2 && (trang_thai_thanh_ly  == 0 || trang_thai_thanh_ly == 1) ;
        const showDuyetThanhLy = isNguoiDuyetThanhLy && trang_thai_thanh_ly == 0;
        

        return {
            isNguoiTaoPhieu,
            isNguoiNhan,
            showUpdateBtn,
            showKyCap1Btn,
            showKyCap2Btn,
            showDeleteBtn,
            showViewBtn,
            showDestroyBtn,
            showThanhLyBtn,
            showThongTinThanhLy,
            showDuyetThanhLy
        };
    }, [dataReport, user]);
};

export default useActionQLTB;