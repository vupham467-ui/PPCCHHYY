import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { validateRequiredFields } from "../../../../utils/commonUltil";
import { QLTB_DM_NUOCSX } from "../../../../models/quanlythietbi/QLTB_DM_NUOCSX";
import { nuocSxService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";

const DiaglogForm = ({
  formData,
  setFormData,
  isUpdate,
  visible,
  setVisible,
  showToast,
  loadData,
}) => {

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!isUpdate) {
      setFormData(QLTB_DM_NUOCSX);
    }
  }, []);

  const validateFields = () => {
    const requiredFields = {
      ma_nuoc_sx: "Mã nước SX",
      ten_nuoc_sx: "Tên nước SX",
    };
    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {   
    setIsSubmitting(true);
    if (!validateFields()) {
      showToast("error", "Vui lòng điền đủ thông tin!")
      setIsSubmitting(false);
      return;
    }
    try {
      if (isUpdate) {
        await handleUpdate();
      } else {
        await handleCreate();
      }
    } catch (err) {
      let message = "Lỗi khi gửi dữ liệu";
      const error = err?.response?.data;
      message = (error && typeof error == "string" ? err?.response?.data : message);
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
    
  };

    // Hàm xử lý dữ liệu khi submit
  const handleCreate = async () => {
    try {
      const params = {
        ...formData,
      }
      await nuocSxService.insert(params);
      showToast("success", "Thêm dữ liệu thành công!");
      setVisible(false);
      loadData();
    } catch (err) {
      const message = "Lỗi khi gửi dữ liệu!"
      showToast("error", message);
    }
  };

  const handleUpdate = async () => {
    try {
      await nuocSxService.update(formData);
      showToast("success", "Cập nhật dữ liệu thành công!");
      setVisible(false);
      loadData();
    } catch (err) {
      const message = "Lỗi khi gửi dữ liệu!"
      showToast("error", message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <Dialog
      header={
        isUpdate ? "Sửa thông tin": "Thêm mới"
      }
      visible={visible}
      className="w-11 md:w-9 lg:w-7 xl:w-5"
      onHide={() => {
        setVisible(false);
        setFormData({QLTB_DM_NUOCSX}); // Reset dữ liệu khi đóng modal
      }}
    >
      <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
        <div className="grid">
          <div className="md:field col-12">
            <label htmlFor="ma_nuoc_sx" className="font-bold text-sm md:my-2 my-1 block">
              Mã nước SX <span style={{ color: "red" }}>(*)</span>
            </label>
            <InputText
              id="ma_nuoc_sx"
              name="ma_nuoc_sx"
              className="w-full"
              placeholder="Nhập mã nước SX"
              value={formData?.ma_nuoc_sx || ""}
              onChange={handleInputChange}
              type="text"
            />
            {errors?.ma_nuoc_sx && (
              <small className="p-error">{errors.ma_nuoc_sx}</small>
            )}

          </div>
          <div className="md:field col-12">
            <label htmlFor="ten_nuoc_sx" className="font-bold text-sm md:my-2 my-1 block">
              Tên nước SX <span style={{ color: "red" }}>(*)</span>
            </label>
            <InputText
              id="ten_nuoc_sx"
              name="ten_nuoc_sx"
              className="w-full"
              placeholder="Nhập tên nước SX"
              onChange={handleInputChange}
              value={formData?.ten_nuoc_sx || ""}
              type="text"
            />
            {errors?.ten_nuoc_sx && (
              <small className="p-error">{errors.ten_nuoc_sx}</small>
            )}
          </div>
        </div>
      </div>
      {/* Nút hành động */}
      <div className="flex justify-content-center gap-2 mt-4">
          <Button
            label="Lưu"
            onClick={handleSubmit}
            severity="success"
            style={{ backgroundColor: "#1445a7", border: "none" }}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => setVisible(false)}
          />
      </div>
    </Dialog>
  );
};

export default DiaglogForm;