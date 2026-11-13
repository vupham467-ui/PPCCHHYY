import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { getMenuCurrent } from "../../../../utils/Function";
import { hangSxTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { QLTB_DM_HANGSX } from "../../../../models/quanlythietbi/QLTB_DM_HANGSX";

const DialogForm = ({
  show,
  setShow,
  isAdd,
  formData,
  setFormData,
  setShowDialog,
  showToast,
  loadData,
}) => {

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi các trường nhập liệu
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleValidate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.ten_hang_sx) {
      isValid = false;
      tempErrors.ten_hang_sx = "Tên hãng SX không được để trống";
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Hàm gửi dữ liệu khi lưu
  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!handleValidate()) {
      showToast("error", "Vui lòng điền đủ thông tin!")
      setIsSubmitting(false);
      return;
    }
    try {
      if (isAdd) {
        await hangSxTBService.insert(formData);
        showToast("success", "Thêm mới thành công!")
      } else {
        await hangSxTBService.update(formData);
        showToast("success", "Cập nhật thành công!")
      }
      setShowDialog(false);
      loadData();
    } catch (err) {
      let message = "Lỗi khi gửi dữ liệu";
      const error = err?.response?.data;
      message = (error && typeof error == "string" ? err?.response?.data : message);
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span>
          {isAdd ? "Thêm mới" : "Cập nhật thông tin"} {getMenuCurrent()}
        </span>
      </div>
    );
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData(QLTB_DM_HANGSX);
    setErrors({});
  };

  return (
    <Dialog
      header={renderHeader}
      visible={show} 
      // closable={false}
      // style={{ width: "50vw", height: "auto", overflowY: "visible" }}
      className="w-11 md:w-9 lg:w-7 xl:w-5"
      contentStyle={{ paddingTop: "10px" }}
      onHide={handleCloseDialog}
    >
      <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
        <div className="grid">
          <div className="md:field col-12">
            <label htmlFor="ten_hang_sx" className="font-bold text-sm md:my-2 my-1 block">
              Tên hãng SX<span className="text-red-500"> (*)</span>
            </label>
            <InputText
              id="ten_hang_sx"
              name="ten_hang_sx"
              placeholder="Nhập tên hãng SX"
              value={formData?.ten_hang_sx || ""}
              onChange={handleChange}
              className="w-full"
            />
            {errors?.ten_hang_sx && (
              <small className="p-error">{errors?.ten_hang_sx}</small>
            )}
          </div>

        </div>
      </div>
      <div className="flex justify-content-center gap-2 mt-4">
          <Button
            label="Lưu"
            onClick={handleSubmit}
            severity="success"
            loading={isSubmitting}
            disabled={isSubmitting}
            style={{ backgroundColor: "#1445a7", border: "none" }}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={handleCloseDialog}
          />
        </div>
    </Dialog>
  );
};

export default DialogForm;
