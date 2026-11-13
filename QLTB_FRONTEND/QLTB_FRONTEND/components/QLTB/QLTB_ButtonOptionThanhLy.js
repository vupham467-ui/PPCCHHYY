import { Button } from "primereact/button";
import useActionQLTB from "../../hooks/useActionQLTB";
import { btnActionColors } from "../../constants/propGlobal";


const QLTB_ButtonOptionThanhLy = ({rowData, actions, canDestroy = true}) => {
    const { isNguoiTaoPhieu, isNguoiKyC1, isNguoiNhan, showUpdateBtn, showKyCap1Btn, showKyCap2Btn,
         showDeleteBtn, showViewBtn, showDestroyBtn, showThanhLyBtn, showThongTinThanhLy, showDuyetThanhLy } = useActionQLTB(rowData);

    const styleBtn = {
        border: "none",
        color: "#fff",
        marginRight: "10px",
        fontSize: "3px",
        height: "37px",
        width: "37px",
    }

    return (
        <div className="flex">

            {showUpdateBtn &&
                <Button
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.edit,
                    }}
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {
                        actions?.handleOnClickUpdateBtn?.(rowData);
                        actions?.setIsUpdate?.(true); // Đặt trạng thái cập nhật
                    }}
                />
            }

            {(showKyCap1Btn) && 
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
                        actions?.handleOnClickKySoBtn?.(rowData);

                        actions?.setIsPdfView?.(false);
                    }}
                />
            }

            {showViewBtn && 
                <Button
                    icon="pi pi-eye"
                    tooltip="Xem biên bản kiểm tra"
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
                        actions?.setShowConfirmDialog?.(true);
                        actions?.setBienBan?.(rowData);
                        actions?.setId?.(rowData?.id);
                        actions?.setIsMultiDelete?.(false);

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
                }}
                />         
            }

            {showThanhLyBtn && 
                <Button
                    icon="pi pi-eraser"
                    tooltip="Thanh lý thiết bị"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.destroy,
                    }}
                    onClick={() => {
                        actions?.handleOnClickThanhLyBtn?.(rowData);
                    }}
                />
            }

            {showThongTinThanhLy && 
                <Button
                    icon="pi pi-ticket"
                    tooltip="Thông tin thanh lý"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.edit,
                    }}
                    onClick={() => {
                        actions?.handleOnClickThongTinThanhLyBtn?.(rowData);
                    }}
                />
            }

            
            {/* {showDuyetThanhLy && 
                <Button
                    icon="pi pi-pencil"
                    tooltip="Duyệt thanh lý"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        ...styleBtn,
                        backgroundColor: btnActionColors.edit,
                    }}
                    onClick={() => {
                        actions?.handleOnClickDuyetThanhLyBtn?.(rowData);
                    }}
                />
            } */}
  
        </div>
    );
};

export default QLTB_ButtonOptionThanhLy;