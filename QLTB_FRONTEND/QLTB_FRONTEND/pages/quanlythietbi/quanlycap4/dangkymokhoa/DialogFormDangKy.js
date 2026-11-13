import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { validateRequiredFields } from "../../../../utils/commonUltil";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { dangKyMoKhoaTBService } from "../../../../services/quanlythietbi/QLTB_DangKyMoKhoaTBService";
import { storageHelper } from "../../../../utils/storageUtils";
import { MADV_CTY } from "../../../../constants/propGlobal";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import moment from "moment";



const danhMucLyDoMoKhoa = [
    { label: "Cập nhật thông tin thiết bị", value: "Cập nhật thông tin thiết bị" },
    { label: "Cập nhật thông tin thí nghiệm", value: "Cập nhật thông tin thí nghiệm" }
]

const DialogFormDangky = ({
    visible,
    setVisible,
    isMulti,
    showToast,
    loadData,
    current_MADVIQLY,
    selectedRecords,
    selectedId,

}) => {
    const user = storageHelper.get("user");
    const { ho_ten, ten_dang_nhap, dm_donvi_id } = user;
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formDangKyMoKhoa = {
        ma_dviqly: current_MADVIQLY ? current_MADVIQLY : MADV_CTY,
        tbi_dm_thietbi_id: "",
        mk_noi_dung: "",
        mk_ly_do: "",
        mk_nguoi_tao: ten_dang_nhap,
        mk_ngay_tao: moment(new Date()).format("HH:mm DD/MM/YYYY")
    }
    const [formData, setFormData] = useState(formDangKyMoKhoa);

    const validateFields = () => {
        const requiredFields = {
            mk_noi_dung: "Nội dung đăng ký mở khóa",
            mk_ly_do: "Lý do",
            mk_nguoi_tao: "Người ĐK",
            mk_ngay_tao: "Ngày ĐK"
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
            await handleCreateDangKy();
            loadData();
            setVisible(false);
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
    const handleCreateDangKy = async () => {
        try {
            if (isMulti) {
                if (!selectedRecords.length) {
                    showToast("warn", "Chưa chọn thiết bị nào đăng ký mở khóa");
                    return;
                }
                const ids = selectedRecords
                    .filter((r) => (r.mk_trang_thai == "0" || r.mk_trang_thai == "3")) //Chỉ lấy những thiết bị chưa đăng ký hoặc đang khóa
                    .map((r) => r.id);
                const params = {
                    ...formData,
                    tbi_dm_thietbi_ids: ids
                }

                const res = await dangKyMoKhoaTBService.insertmulti(params);
                const successMessage = (typeof res == "string") ? res : "Đăng ký mở khóa thành công!";
                showToast("success", successMessage);

            } else {

                if (!selectedId) {
                    showToast("error", "Không tìm thấy bản ghi đăng ký mở khóa");
                    return;
                }
                const params = {
                    ...formData,
                    tbi_dm_thietbi_id: selectedId
                }
                const res = await dangKyMoKhoaTBService.insert(params);
                const successMessage = (typeof res == "string") ? res : "Đăng ký mở khóa thành công!";
                showToast("success", successMessage);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


  return (
    <Dialog
      header={
        "Đăng ký mở khóa"
      }
      visible={visible}
      className="w-11 md:w-9 lg:w-7 xl:w-5"
      onHide={() => {
        setVisible(false);
        setFormData(formDangKyMoKhoa); // Reset dữ liệu khi đóng modal
      }}
    >
        <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
            <div className="grid">
                <InputTextField
                    label="Nội dung đăng ký mở khóa"
                    name="mk_noi_dung"
                    value={formData?.mk_noi_dung || ""}
                    onChange={handleInputChange}
                    error={errors?.mk_noi_dung}
                    required
                    divClassName="col-12"
                />
                <DropdownField
                    label="Lý do"
                    name="mk_ly_do"
                    value={formData?.mk_ly_do}
                    options={danhMucLyDoMoKhoa}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) => setFormData(prev => ({ ...prev, mk_ly_do: e.value }))}
                    required
                    error={errors?.mk_ly_do}
                    divClassName="col-12 lg:col-6"
                />
                <InputTextField
                    label="Người đăng ký"
                    name="mk_nguoi_tao"
                    value={formData?.mk_nguoi_tao || ""}
                    onChange={handleInputChange}
                    error={errors?.mk_nguoi_tao}
                    disabled
                    required
                    divClassName="col-12 md:col-6 lg:col-3"
                />
                <CalendarField
                    label="Ngày đăng ký"
                    name="mk_ngay_tao"
                    value={formData?.mk_ngay_tao}
                    onChange={(val) => setFormData(prev => ({ ...prev, mk_ngay_tao: val }))}
                    error={errors?.mk_ngay_tao}
                    disabled
                    required
                    showTime
                    divClassName="col-12 md:col-6 lg:col-3"
                />
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

export default DialogFormDangky;