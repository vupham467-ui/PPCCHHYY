import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { validateRequiredFields } from "../../../../utils/commonUltil";
import { QLTB_DM_KHO } from "../../../../models/quanlythietbi/QLTB_DM_KHO";
import { khoTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { MADV_CTY } from "../../../../constants/propGlobal";

const DiaglogForm = ({
  formData,
  setFormData,
  isUpdate,
  visible,
  setVisible,
  showToast,
  loadData,
  donViArr,
  current_MADVIQLY
}) => {

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUpdate) {
      setFormData({
        ...QLTB_DM_KHO,
        ma_dviqly: current_MADVIQLY
      });
    }
  }, []);

  const validateFields = () => {
    const requiredFields = {
      ma_dviqly: "Đơn vị quản lý",
      ma_kho: "Mã kho",
      ten_kho: "Tên kho",
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
        ...formData
      }
      await khoTBService.insert(params);
      showToast("success", "Thêm dữ liệu thành công!");
      setVisible(false);
      loadData();
    } catch (err) {
      let message = "Lỗi khi gửi dữ liệu";
      const error = err?.response?.data;
      message = (error && typeof error == "string" ? err?.response?.data : message);
      showToast("error", message);
    }
  };

  const handleUpdate = async () => {
    try {
      await khoTBService.update(formData);
      showToast("success", "Cập nhật dữ liệu thành công!");
      setVisible(false);
      loadData();
    } catch (err) {
      let message = "Lỗi khi gửi dữ liệu";
      const error = err?.response?.data;
      message = (error && typeof error == "string" ? err?.response?.data : message);
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
        setFormData({QLTB_DM_KHO}); // Reset dữ liệu khi đóng modal
      }}
    >
      <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
        <div className="grid">
          <div className="md:field col-12">
            <label htmlFor="ma_dviqly" className="font-bold text-sm md:my-2 my-1 block">
              Đơn vị quản lý <span style={{ color: "red" }}>(*)</span>
            </label>

            <Dropdown
              id="ma_dviqly"
              className="w-full"
              placeholder="Chọn đơn vị quản lý"
              value={formData?.ma_dviqly || current_MADVIQLY}
              optionLabel="ten"
              optionValue="ma_dviqly"
              disabled={current_MADVIQLY !== MADV_CTY}
              filter
              options={donViArr}
              onChange={(e) => {
                  setFormData({ ...formData, ma_dviqly: e.value })
                } 
              }
            />
            {errors?.ma_dviqly && (
              <small className="p-error">{errors.ma_dviqly}</small>
            )}
          </div>
          <div className="md:field col-12">
            <label htmlFor="ma_kho" className="font-bold text-sm md:my-2 my-1 block">
              Mã kho <span style={{ color: "red" }}>(*)</span>
            </label>
            <InputText
              id="ma_kho"
              name="ma_kho"
              className="w-full"
              placeholder="Nhập mã kho"
              onChange={handleInputChange}
              value={formData?.ma_kho || ""}
              type="text"
            />
            {errors?.ma_kho && (
              <small className="p-error">{errors.ma_kho}</small>
            )}
          </div>
          <div className="md:field col-12">
            <label htmlFor="ten_kho" className="font-bold text-sm md:my-2 my-1 block">
              Tên kho <span style={{ color: "red" }}>(*)</span>
            </label>
            <InputText
              id="ten_kho"
              name="ten_kho"
              className="w-full"
              placeholder="Nhập tên kho"
              onChange={handleInputChange}
              value={formData?.ten_kho || ""}
              type="text"
            />
            {errors?.ten_kho && (
              <small className="p-error">{errors.ten_kho}</small>
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