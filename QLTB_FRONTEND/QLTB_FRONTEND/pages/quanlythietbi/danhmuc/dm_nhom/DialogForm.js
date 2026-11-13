import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { storageHelper } from "../../../../utils/storageUtils";
import { QLTB_DM_NHOM } from "../../../../models/quanlythietbi/QLTB_DM_NHOM";
import { getMenuCurrent } from "../../../../utils/Function";
import { nhomThietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";

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
  const user = storageHelper.get("user") || {};
  const userName = user?.ten_dang_nhap || "";

  // Xử lý thay đổi các trường nhập liệu
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
      nguoi_tao: isAdd ? userName : prev.nguoi_tao,
      nguoi_sua: !isAdd ? userName : prev.nguoi_sua,
    }));
  };

  const handleValidate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.ma_nhom) {
      isValid = false;
      tempErrors.ma_nhom = "Mã nhóm không được để trống";
    }

    if (!formData.ten_nhom) {
      isValid = false;
      tempErrors.ten_nhom = "Tên nhóm không được để trống";
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
        await nhomThietBiService.insert(formData);
        showToast("success", "Thêm mới thành công!")
      } else {
        await nhomThietBiService.update(formData);
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
    setFormData(QLTB_DM_NHOM);
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
            <label htmlFor="ma_nhom" className="font-bold text-sm md:my-2 my-1 block">
              Mã nhóm TB<span className="text-red-500"> (*)</span>
            </label>
            <InputText
              id="ma_nhom"
              name="ma_nhom"
              placeholder="Nhập mã nhóm TB"
              value={formData?.ma_nhom || ""}
              onChange={handleChange}
              className="w-full"
            />
            {errors?.ma_nhom && (
              <small className="p-error">{errors?.ma_nhom}</small>
            )}
          </div>
          <div className="md:field col-12">
            <label htmlFor="ten_nhom" className="font-bold text-sm md:my-2 my-1 block">
              Tên nhóm TB<span className="text-red-500"> (*)</span>
            </label>
            <InputText
              id="ten_nhom"
              name="ten_nhom"
              placeholder="Nhập tên nhóm TB"
              value={formData?.ten_nhom || ""}
              onChange={handleChange}
              className="w-full"
            />
            {errors?.ten_nhom && (
              <small className="p-error">{errors?.ten_nhom}</small>
            )}
          </div>

          <div className="md:field col-12">
            <label htmlFor="ghi_chu" className="font-bold text-sm md:my-2 my-1 block">
              Ghi chú
            </label>
            <InputText
              id="ghi_chu"
              name="ghi_chu"
              placeholder="Nhập ghi chú"
              value={formData?.ghi_chu || ""}
              onChange={handleChange}
              className="w-full"
            />
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
