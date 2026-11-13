import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { Menu } from "primereact/menu";

const ActionQTButtonsTND = ({ 
    existedPQT, 
    bBanQT, 
    setIsAdd, 
    setFormDataQuyetToan, 
    setVisibleFormQuyetToan, 
    handleCreateQT, 
    isLoading, 
    setIsVisiableBB, 
    onDestroyConfirm, 
    QLTB_C4_CHITIET_QT_TND,
    setShowDialogImportFile

}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 850);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuRef = useRef(null);

  const actions = [
    {
      label: "Import file",
      icon: "pi pi-file-import",
      command: () => {
        // setIsAdd(true);
        // setFormDataQuyetToan(QLTB_C4_CHITIET_QT_TND);
        // setVisibleFormQuyetToan(true);
        setShowDialogImportFile(true);
      },
      disabled: existedPQT,
    },
    {
      label: "Nhập trực tiếp",
      icon: "pi pi-plus-circle",
      command: () => {
        setIsAdd(true);
        setFormDataQuyetToan(QLTB_C4_CHITIET_QT_TND);
        setVisibleFormQuyetToan(true);
      },
      disabled: existedPQT,
    },
    {
      label: "Tạo phiếu QT",
      icon: "pi pi-file",
      command: () => handleCreateQT(),
      disabled: existedPQT,
    },
    ...(existedPQT
      ? [
          {
            label: bBanQT.tranG_THAI !== 0 ? "Xem thông tin phiếu" : "Ký số phiếu",
            icon: bBanQT.tranG_THAI !== 0 ? "pi pi-eye" : "pi pi-pencil",
            command: () => setIsVisiableBB(true),
          },
          ...(bBanQT.tranG_THAI === 0 || bBanQT.tranG_THAI === 1
            ? [
                {
                  label: "Hủy phiếu",
                  icon: "pi pi-trash",
                  command: () => onDestroyConfirm(bBanQT),
                  className: "p-menuitem-danger",
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <div className="flex gap-2">
      {isSmallScreen ? (
        <div className="relative">
          <Button
            label="Hành động"
            icon="pi pi-angle-down"
            iconPos="right"
            className="p-button-primary"
            onClick={(event) => menuRef.current.toggle(event)}
          />
        <Menu model={actions} popup ref={menuRef} />
        </div>
      ) : (
        <>
          <Button
            label="Import file"
            className="p-button-primary"
            onClick={() => {
              setShowDialogImportFile(true);
            }}
            disabled={existedPQT}
          />
          <Button
            label="Nhập trực tiếp"
            className="p-button-info"
            onClick={() => {
              setIsAdd(true);
              setFormDataQuyetToan(QLTB_C4_CHITIET_QT_TND);
              setVisibleFormQuyetToan(true);
            }}
            disabled={existedPQT}
          />
          <Button
            label="Tạo phiếu QT"
            className="p-button-success"
            onClick={handleCreateQT}
            loading={isLoading}
            disabled={existedPQT}
          />
          {existedPQT && (
            <Button
              label={bBanQT.tranG_THAI !== 0 ? "Xem thông tin phiếu" : "Ký số phiếu"}
              className="p-button-info"
              onClick={() => setIsVisiableBB(true)}
            />
          )}
          {existedPQT && (bBanQT.tranG_THAI === 0 || bBanQT.tranG_THAI === 1) && (
            <Button
              label="Hủy phiếu"
              className="p-button-danger"
              onClick={() => onDestroyConfirm(bBanQT)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ActionQTButtonsTND;
