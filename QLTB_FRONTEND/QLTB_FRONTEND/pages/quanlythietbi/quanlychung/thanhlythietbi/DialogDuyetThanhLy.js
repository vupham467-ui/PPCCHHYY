// DialogFormGiaoNhan.jsx
import React, { useState, useEffect, useContext } from "react";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { storageHelper } from "../../../../utils/storageUtils";
import moment from "moment";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import DialogChonThietBi from "./DialogChonThietBi";
import { fetchData, filterUsersByRole, validateRequiredFields } from "../../../../utils/commonUltil";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";
import { giaoNhanTBService } from "../../../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import { arrTinhTrangThietBi, MADV_CTY } from "../../../../constants/propGlobal";
import AutoCompleteCustom from "../../../../components/AutoComplateCustom";
import { InputText } from "primereact/inputtext";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import InputFileField from "../../../../components/FormInputs/InputFileField";
import UploadFileService from "../../../../services/UploadFileService";

const DialogDuyetThanhLy = ({
  visible,
  setVisible,
  formData,
  setFormData,
  loadData,
  showToast = () => {},
  action,
  setAction
}) => {
  const user = storageHelper.get("user");
  const { ten_dang_nhap, dm_phongban_id, ma_dviqly } = user; //user QL ĐVC4

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dsNguoiKiemSoat, setDsNguoiKiemSoat] = useState([]);

  const [mode, setMode] = useState(action); 
  const isViewMode = mode === "VIEW";
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [loadingDuyetThanhLy, setLoadingDuyetThanhLy] = useState(false);

  
  const formThanhLyData = {
    id: "",
    bienban_id: "",
    so_vanban: "",
    file_vanban: "",
    file_vanban_file: null,
    file_vanban_url: null,
    nguoi_kiemsoat: "",
    thoigian_xacnhan: "",
    ngay_tao: "",
    nguoi_tao: ten_dang_nhap,
    trang_thai_thanh_ly: null
  };

  // Load người kiểm soát P10
  useEffect(() => {
    const fetchNguoiKiemSoat = async () => {
      try {
        const params =  {
          ma_dviqly: MADV_CTY,
          vai_tro: "ADMIN, QLTB_QLP10"
        };

        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(params);

        setDsNguoiKiemSoat(res || []);
      } catch (e) {
        console.log(e);
        setDsNguoiKiemSoat([]);
      }
    };
    fetchNguoiKiemSoat();
  }, []);


  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    // Các field khác
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const requiredFields = mode == "CREATE" ? {
      nguoi_kiemsoat: "Người kiểm soát",
      so_vanban: "Số văn bản",
      file_vanban_file: "File thanh lý",
    } :
    {
      nguoi_kiemsoat: "Người kiểm soát",
      so_vanban: "Số văn bản",
      file_vanban_url: "File thanh lý"
    };

    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!validateFields()) {
      showToast("error", "Vui lòng điền đủ thông tin!");
      setIsSubmitting(false);
      return;
    }

    const dateTimeString = moment().format("YYYYMMDDHHmmss");
    const fileDirectory = "fileQLTB_ThuHoi";
    const fileName = `${formData?.bienban_id}_TLC4_${dateTimeString}`;

    let payload = { ...formData, nguoi_tao: user?.ten_dang_nhap };

    try {
      //Lưu file lên hệ thống:
      if (payload.file_vanban_file) {
        const fd = new FormData();
        fd.append("file", payload.file_vanban_file);
        let resUpload = await UploadFileService.signfile(fd, fileName, fileDirectory)
        payload.file_vanban = resUpload?.filePath
        
      } else {
        payload.file_vanban = payload.file_vanban_url;
      }

      delete payload.file_vanban_file;
      delete payload.file_vanban_url;
      
      if (mode == "UPDATE") {
        // fd.append("id", formData.id);
        await giaoNhanTBService.updateThongTinDuyetThanhLy(payload);
        showToast("success", "Cập nhật thông tin duyệt thanh lý thành công!");
      } else if (mode == "CREATE") {
        await giaoNhanTBService.insertThongTinDuyetThanhLy(payload);
        showToast("success", "Thêm duyệt thanh lý thành công!");
      }

      loadData();
      setVisible(false);
      setFormData(formThanhLyData);
    } catch (err) {
      console.log(err);
      showToast("error", "Lỗi khi gửi dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveThanhLy = async () => {
    setLoadingDuyetThanhLy(true);
    try {
      await giaoNhanTBService.duyetThanhLy({
        bienban_id: formData?.bienban_id,
        nguoi_kiemsoat: user?.ten_dang_nhap
      });

      showToast("success", "Đã duyệt thanh lý");
      loadData();
      setShowConfirmApprove(false);
      setVisible(false);
    } catch (e) {
      console.log(e);
      showToast("error", "Không thể duyệt thanh lý");
    } finally {
      setLoadingDuyetThanhLy(false);
    }
  };

  const canUpdate = formData?.nguoi_tao === user?.ten_dang_nhap && formData?.trang_thai_thanh_ly == 0;
  const canApprove = formData?.nguoi_kiemsoat === user?.ten_dang_nhap && formData?.trang_thai_thanh_ly == 0;


  return (
    <>
      <Dialog
        header={
          "Thông tin thanh lý"
        }
        visible={visible}
        className="w-11 md:w-9 lg:w-7 xl:w-5"
        onHide={() => {
          setVisible(false);
          setFormData(formThanhLyData); // Reset dữ liệu khi đóng modal
        }}
      >
          <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
              <div className="grid">
                  <DropdownField
                      label="Người kiểm soát"
                      name="nguoi_kiemsoat"
                      value={formData?.nguoi_kiemsoat}
                      options={dsNguoiKiemSoat}
                      optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
                      optionValue="teN_DANG_NHAP"
                      onChange={handleInputChange}
                      required
                      disabled={isViewMode}
                      error={errors?.nguoi_kiemsoat}
                      divClassName="col-12 md:col-6"
                    />
                    
                  <InputTextField
                      label="Số văn bản"
                      name="so_vanban"
                      value={formData?.so_vanban || ""}
                      onChange={handleInputChange}
                      error={errors?.so_vanban}
                      required
                      disabled={isViewMode}
                      divClassName="col-12 md:col-6"
                  />

                  <InputFileField
                    label="File thanh lý"
                    name="file_vanban_file"
                    value={formData?.file_vanban_file}
                    fileUrl={formData.file_vanban_url}
                    required
                    disabled={isViewMode}
                    error={mode == "CREATE" ?  errors?.file_vanban_file : errors?.file_vanban_url}
                    showPreview
                    showToast={showToast}
                    accept=".pdf"
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        [e.target.name]: e.target.value, // value là File
                      }))
                    }
                  />
                                    
              </div>
          </div>
          {/* Nút hành động */}
          <div className="flex justify-content-center gap-2 mt-4">

              {mode === "VIEW" && canUpdate && (
                <Button
                  label="Cập nhật"
                  icon="pi pi-pencil"
                  onClick={() => setMode("UPDATE")}
                  style={{ backgroundColor: "#1445a7", border: "none" }}
                />
              )}

              {mode === "VIEW" && canApprove && (
                <Button
                  label="Duyệt thanh lý"
                  icon="pi pi-check"
                  severity="success"
                  onClick={() => setShowConfirmApprove(true)}
                />
              )}
              {
                (mode == "CREATE" || mode == "UPDATE") &&
                <Button
                  label="Lưu"
                  onClick={handleSubmit}
                  severity="success"
                  style={{ backgroundColor: "#1445a7", border: "none" }}
                  loading={isSubmitting}
                  disabled={isSubmitting}
              />
              }
              <Button
                  label="Đóng"
                  outlined
                  severity="secondary"
                  onClick={() => setVisible(false)}
              />
          </div>
      </Dialog>

      <Dialog
        header="Xác nhận duyệt thanh lý"
        visible={showConfirmApprove}
        style={{ width: "400px" }}
        onHide={() => setShowConfirmApprove(false)}
      >
        <p>Bạn có chắc chắn muốn duyệt thanh lý cho các thiết bị trong biên bản này không?</p>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            label="Hủy"
            outlined
            onClick={() => setShowConfirmApprove(false)}
          />
          <Button
            label="Xác nhận"
            severity="success"
            loading={loadingDuyetThanhLy}
            onClick={handleApproveThanhLy}
          />
        </div>
      </Dialog>
    </>
  );
};

export default DialogDuyetThanhLy;
