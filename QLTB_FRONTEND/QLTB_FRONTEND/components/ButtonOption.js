import { Button } from "primereact/button";
import useAction from "../hooks/useAction";
import { btnActionColors } from "../constants/propGlobal";

const ButtonOption = ({rowData, actions, hasQuyetToan = false, canDestroy = true, isBGC3 = false, isKimC4 = false}) => {
    const { isNguoiTaoPhieu, isNguoiNhan, showKyCap1Btn, showKyCap2Btn,
         showDeleteBtn, showViewBtn, showDestroyBtn, showQuyetToanBtn, showThuHoiBtn } = useAction(rowData);

    const styleBtn = {
        border: "none",
        color: "#fff",
        marginRight: "10px",
        fontSize: "3px",
        height: "37px",
        width: "37px",
    }

    const hasImage = rowData?.dA_CO_ANH == "Y" || rowData?.da_co_anh == "Y";
    const showPhotoBtn = isKimC4; //Chỉ hiện nút ảnh nếu là phiếu giao nhận kìm;
    const showKyCap1KimC4 = hasImage && showKyCap1Btn && isKimC4; //Nếu là phiếu giao nhận kìm C4 thì hiện nút ký chỉ khi có ảnh, người đăng nhập là người tạo và phiếu ở trạng thái 0 
    const showKyCap1Khac = showKyCap1Btn && !isKimC4; //Các loại phiếu khác: người đăng nhập là người tạo phiếu và trạng thái = 0


    return (
        <div className="flex">
            {
                showPhotoBtn &&
                <Button
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.accounting,
                    }}
                    icon="pi pi-image"
                    tooltip="Ảnh"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {
                        actions?.handleClickPhoto?.(rowData); // Cập nhật state
                    }}
                />
            }
            {showKyCap1Btn &&
                <Button
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.edit,
                    }}
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {
                        // actions?.setVisible?.(true); // Hiển thị modal
                        actions?.onClickUpdateBtn?.(rowData);
                        actions?.handleOnClickUpdateBtn?.(rowData);
                        actions?.setData?.(rowData); // Cập nhật state
                        actions?.setIsUpdate?.(true); // Đặt trạng thái cập nhật
                        actions?.setIsAdd?.(false);
                        actions?.setVisibleForm?.(true);
                    }}
                />
            }

            {(showKyCap1KimC4 || showKyCap1Khac) && 
                <Button
                    icon="pi pi-user-edit"
                    tooltip="Ký số"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.sign,
                    }}
                    onClick={() => {
                        actions?.handleOnClickKySoBtn?.(rowData);

                        actions?.setIsPdfView?.(false);
                    }}
                />
            }

            {showKyCap2Btn && 
                <Button
                    icon="pi pi-user-edit"
                    tooltip="Ký số"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.sign,
                    }}
                    onClick={() => {
                        // console.log("on click");
                        actions?.handleOnClickKySoBtn?.(rowData);

                        actions?.setIsPdfView?.(false);
                    }}
                />
            }

            {showViewBtn && 
                <Button
                    icon="pi pi-eye"
                    tooltip="Xem chi tiết"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.view,
                    }}
                    onClick={() => {
                        actions?.handleOnClickKySoBtn?.(rowData);

                        actions?.setIsPdfView?.(true);
                    }}
                />
            }
            {showDeleteBtn &&
                <Button
                    icon="pi pi-trash"
                    tooltip="Xóa"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.delete,
                    }}
                    onClick={() => {
                        actions?.setIsHide?.(true);
                        actions?.setShowConfirmDialog?.(true); //Giao kìm C3
                        actions?.setBienBan?.(rowData); //Giao kìm C3
                        actions?.setId?.(rowData?.id);
                        actions?.setIsMultiDelete?.(false);

                        actions?.onDeleteConfirm?.(rowData); //Giaonhantemchic4

                        actions?.setSelectedRecord?.(rowData); //Giaonhamkimc4
                    }}
                />
            }
            {canDestroy && showDestroyBtn && 
                <Button
                icon="pi pi-ban"
                tooltip={"Hủy biên bản"}
                tooltipOptions={{ position: "top" }}
                style={{
                    ...styleBtn,
                    backgroundColor: btnActionColors.destroy,
                }}
                onClick={() => {
                    actions?.setShowConfirmCancelDialog?.(true);
                    actions?.setBienBan?.(rowData);
     
                    actions?.onDestroyConfirm?.(rowData); 
                }}
                />         
            }

            {!isBGC3 && showThuHoiBtn && 
                <Button
                icon="pi pi-replay"
                tooltip={"Thu hồi"}
                tooltipOptions={{ position: "top" }}
                style={{
                    ...styleBtn,
                    backgroundColor: btnActionColors.return,
                }}
                onClick={() => {
                    actions?.handleOpenReturnModal?.(rowData);
                    // actions?.setBienBan?.(rowData);
     
                }}
                />         
            }

            {hasQuyetToan &&
                showQuyetToanBtn &&
                <Button
                    icon="pi pi-file"
                    tooltip="Quyết toán"
                    onClick={() => actions?.handleNavigateToQuyetToan?.(rowData)}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.accounting
                    }}          
                />
            }
            
        </div>
    );
};

export default ButtonOption;