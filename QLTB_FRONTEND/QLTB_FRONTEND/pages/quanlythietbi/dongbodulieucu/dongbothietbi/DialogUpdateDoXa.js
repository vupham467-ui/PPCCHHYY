import { useCallback, useEffect, useState } from "react";
import { fetchData, getLabelTrangThaiThietBi, validateRequiredFields } from "../../../../utils/commonUltil";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { storageHelper } from "../../../../utils/storageUtils";
import { dongBoDuLieuService } from "../../../../services/quanlythietbi/QLTB_Dongbodulieu";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";
import { khoTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import DropdownField from "../../../../components/FormInputs/DropDownField";

const DialogUpdateDoXa = ({
    visible,
    setVisible,
    infoTimKiemDoXa,
    showToast,
    loadData
}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        tbi_kho_id: "",
        dm_phongban_id: "",
        nguoi_sd: ""
    });
    const [danhMucPhongBan, setDanhMucPhongBan] = useState([]);
    const [danhMucKho, setDanhMucKho] = useState([]);
    const [NguoiSDArr, setNguoiSDArr] = useState([]);

    const {ma_dviqly, ma_nhom_tbi, tbi_trangthai_new, sync_status} = infoTimKiemDoXa;

    const isDangSuDung = tbi_trangthai_new == 1; //Kiểm tra chọn trạng thái Thiết bị đang sử dụng không
    const labelHienThiTrangThai = getLabelTrangThaiThietBi(tbi_trangthai_new);
        
    const user = storageHelper.get("user");

    // Lấy phòng ban & kho khi ma_dviqly thay đổi
    useEffect(() => {
        if (!ma_dviqly) return;
        const fetchPhongBan = async () => {
            try {
            const response = await getDM_PHONGBANByMA_DVIQLY(ma_dviqly);
                setDanhMucPhongBan(response);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPhongBan();
        if (!isDangSuDung) {
            fetchData(khoTBService.get, setDanhMucKho, { pageSize: -1, ma_dviqly: ma_dviqly });
        }
        
    }, [ma_dviqly, isDangSuDung]);

    
    // Load người sử dụng:
    useEffect(() => {
        if (!ma_dviqly || !isDangSuDung) {
          setNguoiSDArr([]);
          return;
        }
        const fetchNguoiSD = async () => {
          try {
            const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
                ma_dviqly: ma_dviqly,
                db_maphongban: formData?.dm_phongban_id || "",
            });
      
            setNguoiSDArr(res || []);
          } catch (e) {
            console.log(e);
          }
        };
        fetchNguoiSD();
    }, [ma_dviqly, formData?.dm_phongban_id, isDangSuDung]);

    const validateFields = () => {
        const requiredFields = isDangSuDung ? {
            dm_phongban_id: "Phòng ban sử dụng"
        } : {
            tbi_kho_id: "Kho đơn vị",
        };
        const newErrors = validateRequiredFields(formData, requiredFields);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        if (name === "dm_phongban_id") {
            setFormData(prev => ({
                ...prev,
                dm_phongban_id: value,
                nguoi_sd: "",
            }));
            setNguoiSDArr([]);
            return;
        } 
    
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (!validateFields()) {
            showToast("error", "Vui lòng điền đủ thông tin!");
            setIsSubmitting(false);
            return;
        }
        try {
            const payload = {
                ma_dviqly: ma_dviqly,
                dm_phongban_id_new: formData?.dm_phongban_id || "",
                tbi_kho_id_new: (formData?.tbi_kho_id || "").toString(),
                tbi_trangthai_new: (tbi_trangthai_new || "").toString(),
                nguoi_sd_new: formData?.nguoi_sd || "",
                updated_by: user.ten_dang_nhap,
            };

            //Update:
            const result = await dongBoDuLieuService.update_doxa_multi(payload);
            console.log(result);
            

            showToast("success", result );
            setVisible(false);
        
            loadData();
        } catch (err) {
            let message = "Lỗi khi gửi dữ liệu";
            const error = err?.response?.data;
            message = (error && typeof error === "string"
            ? error
            : typeof error === "object"
            ? JSON.stringify(error)
            : message);
            showToast("error", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            header="Cập nhật thông tin thiết bị đo xa"
            visible={visible}
            className="w-11 md:w-9 lg:w-7 xl:w-5"
            onHide={() => {
                setVisible(false);
                setFormData(
                {        
                    tbi_kho_id: "",
                    dm_phongban_id: "",
                    nguoi_sd: ""
                });
                setErrors({});
            }}
        >
            <p className="text-red-500">
                <strong>** Lưu ý:</strong> Chức năng này áp dụng cho các thiết bị đo xa ở trạng thái: <strong>{labelHienThiTrangThai}</strong> và trạng thái đồng bộ: <strong>Chưa cập nhật</strong>
            </p>
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="grid">

                    {!isDangSuDung &&
                        <DropdownField
                            label="Kho mới"
                            name="tbi_kho_id"
                            value={formData?.tbi_kho_id}
                            options={danhMucKho}
                            optionLabel="ten_kho"
                            optionValue="id"
                            onChange={handleInputChange}
                            required
                            error={errors?.tbi_kho_id}
                            divClassName="col-12"
                        />
                    }

                    {isDangSuDung &&
                        <>
                            <DropdownField
                                label="Phòng ban mới"
                                name="dm_phongban_id"
                                value={formData?.dm_phongban_id}
                                options={danhMucPhongBan}
                                optionLabel="ten"
                                optionValue="id"
                                onChange={handleInputChange}
                                required
                                error={errors?.dm_phongban_id}
                                divClassName="col-12 md:col-6"
                            />


                            <DropdownField
                                label="Người SD mới"
                                name="nguoi_sd"
                                value={formData?.nguoi_sd}
                                options={NguoiSDArr}
                                optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
                                optionValue="teN_DANG_NHAP"
                                onChange={handleInputChange}
                                // required
                                // error={errors?.nguoi_sd}
                                divClassName="col-12 md:col-6"
                            />
                        </>
                    }

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
    )
};

export default DialogUpdateDoXa;