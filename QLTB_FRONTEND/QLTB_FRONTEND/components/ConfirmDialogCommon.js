// ConfirmDialogCommon.jsx
import React from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

const ConfirmDialogCommon = ({
  visible,
  setVisible,
  header = "Xác nhận",
  message = "Bạn có chắc chắn thực hiện thao tác này không?",
  icon = "pi pi-info-circle",
  onConfirm,
  onCancel,
  isDanger = false,
  multiInfo = { isMulti: false, count: 0 }, // default an toàn
  loading = false
}) => {

  const renderMessage = () => {
    if (multiInfo?.isMulti) {
      return `Bạn có chắc chắn thực hiện với ${multiInfo.count} bản ghi đã chọn không?`;
    }
    return message;
  };

  const handleHide = () => {
    setVisible(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setVisible(false);
  };

  return (
    <ConfirmDialog
      visible={visible}
      onHide={handleHide}
      header={header}
      message={renderMessage()}  
      icon={icon}
      footer={
        <div className="flex justify-content-center gap-3">
          <Button
            severity="secondary"
            label="Hủy"
            icon="pi pi-times"
            onClick={handleHide}
          />

          <Button
            severity={isDanger ? "danger" : "primary"}
            label="Đồng ý"
            icon="pi pi-check"
            loading={loading}
            onClick={handleConfirm}
          />
        </div>
      }
    />
  );
};

export default ConfirmDialogCommon;
