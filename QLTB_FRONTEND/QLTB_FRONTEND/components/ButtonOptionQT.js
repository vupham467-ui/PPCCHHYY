import { Button } from "primereact/button";
import { btnActionColors } from "../constants/propGlobal";
import useActionQT from "../hooks/useActionQT";

const ButtonOptionQT = ({rowData, actions, canDestroy = true,}) => {

    const { isNguoiTaoPhieu, isNguoiQLy, isTruongDv, showKyCap1Btn, showKyCap2Btn, showKyCap3Btn,
         showDeleteBtn, showViewBtn, showDestroyBtn } = useActionQT(rowData);

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

            {showKyCap1Btn && 
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

            
            {showKyCap3Btn && 
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
                    actions?.onDestroyConfirm?.(rowData); 
                }}
                />         
            }

        </div>
    );
};

export default ButtonOptionQT;