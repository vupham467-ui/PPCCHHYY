import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { validateRequiredFields } from "../../../../utils/commonUltil";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { storageHelper } from "../../../../utils/storageUtils";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import moment from "moment";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import { kiemTraTBService } from "../../../../services/quanlythietbi/QLTB_KiemTraTBService";


const DialogFormKiemTra = ({
    donViArr,
    danhMucKetQuaKiemTra,
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
    const [users, setUsers] = useState([]);
    const danhMucKetQuaKiemTraFiltered = danhMucKetQuaKiemTra.filter(item => item.value !== "O");

    const formKiemTra = {
        donvi_kiemtra: current_MADVIQLY,
        nguoi_kiemtra: ten_dang_nhap,
        ket_qua: "Y",
        ngay_kiemtra: moment().format("DD/MM/YYYY"),
        ghi_chu: "",
    }
    const [formData, setFormData] = useState(formKiemTra);

    useEffect(() => {
        const getHT_NGUOIDUNGByMA_DVIQLY = async () => {
        try {
            const data = { ma_dviqly: user?.ma_dviqly };
            const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(data);
            
            setUsers(res);
        } catch (e) {
            console.log(e);
        }
    };

        getHT_NGUOIDUNGByMA_DVIQLY();
    }, []);


    const validateFields = () => {
        const requiredFields = {
            donvi_kiemtra: "Đơn vị kiểm tra",
            nguoi_kiemtra: "Lý Người kiểm tra",
            ket_qua: "Kết quả",
            ngay_kiemtra: "Ngày kiểm tra"
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
            await handleCreateKiemTra();
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
    const handleCreateKiemTra = async () => {
        try {
            if (isMulti) {
                if (!selectedRecords.length) {
                    showToast("warn", "Chưa chọn thiết bị nào kiểm tra");
                    return;
                }
                const ids = selectedRecords
                    .map((r) => r.tbi_id) || [];
                const params = {
                    ...formData,
                    tbi_ids: ids
                }
                
                const res = await kiemTraTBService.insertmulti(params);
                const successMessage = (typeof res == "string") ? res : "Thêm thông tin kiểm tra thành công!";
                showToast("success", successMessage);

            } else {
                if (!selectedId) {
                    showToast("error", "Không tìm thấy bản ghi!");
                    return;
                }
                const params = {
                    ...formData,
                    tbi_id: selectedId
                }
                
                const res = await kiemTraTBService.insert(params);
                const successMessage = (typeof res == "string") ? res : "Thêm thông tin kiểm tra thành công!";
                showToast("success", successMessage);
            }
        } catch (err) {
            console.error(err);
            const message = err?.response?.data || "Có lỗi xảy ra!";
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
        "Kiểm tra thiết bị"
      }
      visible={visible}
      className="w-11 md:w-9 lg:w-7 xl:w-5"
      onHide={() => {
        setVisible(false);
        setFormData(formKiemTra); // Reset dữ liệu khi đóng modal
      }}
    >
        <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
            <div className="grid">
                <DropdownField
                    label="Đơn vị kiểm tra"
                    name="donvi_kiemtra"
                    value={formData?.donvi_kiemtra}
                    options={donViArr}
                    optionLabel="ten"
                    optionValue="ma_dviqly"
                    required
                    error={errors?.donvi_kiemtra}
                    onChange={handleInputChange}
                    disabled
                    divClassName="col-12 md:col-6 lg:col-6"
                    labelClassName="mb-2 block"
                />
                <DropdownField
                    label="Người kiểm tra"
                    name="nguoi_kiemtra"
                    value={formData?.nguoi_kiemtra}
                    options={users}
                    // optionLabel="hO_TEN"
                    optionLabel={(o) => `${o.teN_DANG_NHAP} - ${o.hO_TEN}`}
                    optionValue="teN_DANG_NHAP"
                    required
                    error={errors?.nguoi_kiemtra}
                    onChange={handleInputChange}
                    disabled
                    divClassName="col-12 md:col-6 lg:col-6"
                    labelClassName="mb-2 block"
                />
                <DropdownField
                    label="Kết quả"
                    name="ket_qua"
                    value={formData?.ket_qua}
                    options={danhMucKetQuaKiemTraFiltered}
                    optionLabel="label"
                    optionValue="value"
                    onChange={handleInputChange}
                    required
                    error={errors?.ket_qua}
                    divClassName="col-12 md:col-6 lg:col-6"
                />
                <CalendarField
                    label="Ngày kiểm tra"
                    name="ngay_kiemtra"
                    value={formData?.ngay_kiemtra}
                    onChange={(val) => setFormData(prev => ({ ...prev, ngay_kiemtra: val }))}
                    error={errors?.ngay_kiemtra}
                    required
                    disabled
                    dateStringFormat="DD/MM/YYYY"
                    divClassName="col-12 md:col-6 lg:col-6"
                />
                {/* Ghi_chú */}
                <InputTextField
                    label="Ghi chú"
                    name="ghi_chu"
                    value={formData.ghi_chu}
                    onChange={handleInputChange}
                    divClassName="col-12"
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

export default DialogFormKiemTra;