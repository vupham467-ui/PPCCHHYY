import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { fetchData, validateRequiredFields } from "../../../../utils/commonUltil";
import { QLTB_DM_THIETBI } from "../../../../models/quanlythietbi/QLTB_DM_THIETBI";
import { MADV_CTY } from "../../../../constants/propGlobal";
import { donViTinhService, hangSxTBService, khoTBService, thietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";
import moment from "moment";
import { storageHelper } from "../../../../utils/storageUtils";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import { TabPanel, TabView } from "primereact/tabview";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import { QLTB_DATA_THIETBICU } from "../../../../models/quanlythietbi/QLTB_DONGBODULIEU";
import { dongBoDuLieuService } from "../../../../services/quanlythietbi/QLTB_Dongbodulieu";

const DiaglogForm = ({
  formData,
  setFormData,
  visible,
  setVisible,
  showToast,
  loadData,
  donViArr,
  chungLoaiArr,
  nuocSXArr,
  trangThaiThietBiArr
}) => {
  const [localFormData, setLocalFormData] = useState(formData || QLTB_DATA_THIETBICU);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [danhMucPhongBan, setDanhMucPhongBan] = useState([]);
  const [danhMucKho, setDanhMucKho] = useState([]);
  const [danhMucDVTinh, setDanhMucDVTinh] = useState([]);
  const [danhMucHangSX, setDanhMucHangX] = useState([]);
  const [NguoiSDArr, setNguoiSDArr] = useState([]);
  const [hasDetail, setHasDetail] = useState(false);
  const [configDetails, setConfigDetails] = useState([]); // mảng cấu hình chi tiết
  const [detailValues, setDetailValues] = useState({});   // giá trị nhập của từng trường

  const user = storageHelper.get("user");
  const { ho_ten, ten_dang_nhap, dm_donvi_id, ma_dviqly, dm_phongban_id } = user;

  // Khi modal mở, khởi tạo localFormData
  useEffect(() => {
    if (visible) {
      setLocalFormData(formData);

      fetchData(donViTinhService.get, setDanhMucDVTinh);
      fetchData(hangSxTBService.get, setDanhMucHangX);
    }
  }, [visible, formData]);

  // Lấy phòng ban & kho khi ma_dviqly thay đổi
  useEffect(() => {
    if (!localFormData?.ma_dviqly) return;
    const fetchPhongBan = async () => {
      try {
        const response = await getDM_PHONGBANByMA_DVIQLY(localFormData.ma_dviqly);
        setDanhMucPhongBan(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPhongBan();
    fetchData(khoTBService.get, setDanhMucKho, { pageSize: -1, ma_dviqly: localFormData?.ma_dviqly });
  }, [localFormData?.ma_dviqly]);


  // Load người sử dụng:
  useEffect(() => {
    if (!localFormData?.ma_dviqly) {
      setNguoiSDArr([]);
      return;
    }
    const fetchNguoiSD = async () => {
      try {
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
          ma_dviqly: localFormData?.ma_dviqly,
          db_maphongban: localFormData?.dm_phongban_id || "",
        });

        
        setNguoiSDArr(res || []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNguoiSD();
  }, [localFormData?.ma_dviqly, localFormData?.dm_phongban_id]);

  useEffect(() => {
    const selectedChungLoai = chungLoaiArr.find(c => c.id === localFormData?.tbi_dm_chungloai_id);

    const hasDetailValue = selectedChungLoai?.co_thongtin_ct == "Y" && selectedChungLoai?.ct_cauhinh_json;

    setHasDetail(hasDetailValue);

    if (hasDetailValue) {
      try {
        const parsed = JSON.parse(selectedChungLoai?.ct_cauhinh_json);
        setConfigDetails(Array.isArray(parsed) ? parsed : []);
        // Nếu là cập nhật hoặc xem, điền giá trị cũ vào
        if (localFormData?.thongtin_chitiet_json) {
          const values = JSON.parse(localFormData?.thongtin_chitiet_json);
          setDetailValues(values);
        } else {
          const initValues = {};
          parsed.forEach(f => initValues[f.name] = ""); // mặc định rỗng
          setDetailValues(initValues);
        }
      } catch {
        setConfigDetails([]);
        setDetailValues({});
      }
    } else {
      setConfigDetails([]);
      setDetailValues({});
    }
  }, [localFormData.tbi_dm_chungloai_id]);

  const validateFields = () => {
    const requiredFields = {
      // dm_donvi_id_new: "Đơn vị quản lý",
    };
    const newErrors = validateRequiredFields(localFormData, requiredFields);
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

    setLocalFormData(prev => ({ ...prev, [name]: value }));
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
        id: localFormData.id,
        dm_phongban_id_new: localFormData?.dm_phongban_id || "",
        tbi_kho_id_new: (localFormData?.tbi_kho_id || "").toString(),
        tbi_trangthai_new: (localFormData?.tbi_trangthai_id || "").toString(),
        nguoi_sd_new: localFormData?.nguoi_sd || "",
        updated_by: user.ten_dang_nhap,
        thongtin_chitiet_json: JSON.stringify(detailValues)
      };

      //Update:
      await dongBoDuLieuService.update(payload);

      showToast("success", "Cập nhật thành công!" );
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
      header="Cập nhật thông tin thiết bị cũ"
      visible={visible}
      className="w-11 md:w-10 lg:w-9"
      onHide={() => setVisible(false)}
    >
      <TabView>
        <TabPanel header="Thông tin chung">
          <p className="text-red-500">
            <strong>** Lưu ý khi cập nhật:</strong><br />
            - Trường hợp thiết bị <strong>chưa được duyệt</strong>: thiết bị phải ở trạng thái
            <strong> &quot;Chờ duyệt&quot;</strong>, kho là <strong>Kho CNTT</strong>, chưa gán
            phòng ban và người SD.<br />
            - Trường hợp thiết bị <strong>đã được duyệt</strong> và ở trạng thái
            <strong> trong kho / chờ thanh lý / đã thanh lý</strong>: thiết bị phải thuộc kho
            tương ứng của đơn vị, chưa gán phòng ban và người SD.<br />
            - Trường hợp thiết bị <strong>đã được duyệt</strong> và ở trạng thái <strong>đang sử dụng</strong>: thiết bị không gán vào kho và
            bắt buộc chọn phòng ban SD (nếu thiết bị thuộc loại thiết bị cần gán người SD (laptop, máy tính, ...) bắt buộc chọn người SD).
          </p>
          <div className="p-fluid p-2" style={{ minHeight: '350px' }}>
            <div className="grid">
              {/* Đơn vị quản lý */}
              <DropdownField
                label="Đơn vị quản lý"
                name="ma_dviqly"
                value={localFormData?.ma_dviqly}
                options={donViArr}
                optionLabel="ten"
                optionValue="ma_dviqly"
                showClear={false}
                error={errors?.ma_dviqly}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />
              {/* Mã & Tên & Serial */}
              <InputTextField
                label="Tên thiết bị"
                name="ten_thietbi"
                value={localFormData?.ten_thietbi || ""}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />
              <InputTextField
                label="Mã thiết bị"
                name="ma_thietbi"
                value={localFormData?.ma_thietbi || ""}
                divClassName="col-6 md:col-3 lg:col-2"
                disabled
              />
              <InputTextField
                label="Serial"
                name="no_thietbi"
                value={localFormData?.no_thietbi || ""}
                divClassName="col-6 md:col-3 lg:col-2"
                disabled
              />

              {/* Chủng loại, Hãng SX, Nước SX, Trạng thái */}
              <DropdownField
                label="Chủng loại"
                name="tbi_dm_chungloai_id"
                value={localFormData?.tbi_dm_chungloai_id}
                options={chungLoaiArr}
                optionLabel={(o) => `${o.ma_chungloai} - ${o.ten_chungloai}`}
                optionValue="id"
                showClear={false}
                error={errors?.tbi_dm_chungloai_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />
              <DropdownField
                label="Hãng SX"
                name="tbi_dm_hangsx_id"
                value={localFormData?.tbi_dm_hangsx_id}
                options={danhMucHangSX}
                optionLabel={(o) => `${o.ma_hang_sx} - ${o.ten_hang_sx}`}
                optionValue="id"
                showClear={false}
                error={errors?.tbi_dm_hangsx_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />

              {/* Đơn vị tính */}
              <DropdownField
                label="ĐV tính"
                name="dm_donvitinh_id"
                value={localFormData?.dm_donvitinh_id}
                options={danhMucDVTinh}
                optionLabel="ten_donvitinh"
                optionValue="id"
                showClear={false}
                error={errors?.dm_donvitinh_id}
                divClassName="col-6 md:col-3 lg:col-2"
                disabled
              />

              {/* Năm SX */}
              <CalendarField
                label="Năm SX"
                name="namsx"
                value={localFormData?.namsx}
                error={errors?.namsx}
                view="year"
                dateFormat="yy"
                dateStringFormat="YYYY"
                divClassName="col-6 md:col-3 lg:col-2"
                disabled
              />

              <DropdownField
                label="Nước SX"
                name="tbi_nuocsx_id"
                value={localFormData?.tbi_nuocsx_id}
                options={nuocSXArr}
                optionLabel={(o) => `${o.ma_nuoc_sx} - ${o.ten_nuoc_sx}`}
                optionValue="id"
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />
              <CalendarField
                label="Ngày vận hành"
                name="ngay_vanhanh"
                value={localFormData?.ngay_vanhanh}
                dateStringFormat="DD/MM/YYYY"
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />
              {/* Trạng thái */}
              <DropdownField
                label="Trạng thái"
                name="tbi_trangthai_id"
                value={localFormData?.tbi_trangthai_id}
                options={trangThaiThietBiArr}
                optionLabel={(o) => `${o.ma} - ${o.ten}`}
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_trangthai_id: e.value }))}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />

              {/* <InputTextField
                label="Thông tin khác"
                name="thong_tin_khac"
                value={localFormData?.thong_tin_khac || ""}
                divClassName="col-12 md:col-6 lg:col-8"
                disabled
              /> */}

              {/* Kho */}
              <InputTextField
                label="Kho cũ"
                name="tbi_kho_ten_old"
                value={localFormData?.tbi_kho_ten_old || ""}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />
              {/* Phòng ban sử dụng */}
              <InputTextField
                label="Phòng ban cũ"
                name="dm_phongban_ten_old"
                value={localFormData?.dm_phongban_ten_old || ""}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />


              {/* Người sử dụng & Thông tin khác */}
              <InputTextField
                label="Người SD cũ"
                name="nguoi_sd_old"
                value={localFormData?.nguoi_sd_old || ""}
                onChange={handleInputChange}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled
              />

              {/* Kho */}
              <DropdownField
                label="Kho mới"
                name="tbi_kho_id"
                value={localFormData?.tbi_kho_id}
                options={danhMucKho}
                optionLabel="ten_kho"
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_kho_id: e.value }))}
                error={errors?.tbi_kho_id}
                divClassName="col-12 md:col-6 lg:col-4"
              />
              {/* Phòng ban sử dụng */}
              <DropdownField
                label="Phòng ban mới"
                name="dm_phongban_id"
                value={localFormData?.dm_phongban_id}
                options={danhMucPhongBan}
                optionLabel="ten"
                optionValue="id"
                onChange={handleInputChange}
                divClassName="col-12 md:col-6 lg:col-4"
              />

              {/* Người sử dụng mới */}
                  <DropdownField
                label="Người SD mới"
                name="nguoi_sd"
                value={localFormData?.nguoi_sd}
                options={NguoiSDArr}
                optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
                optionValue="teN_DANG_NHAP"
                onChange={handleInputChange}
                divClassName="col-12 md:col-6 lg:col-4"
              />

            </div>
          </div>
        </TabPanel>
        <TabPanel     
          header={
            <div className="flex align-items-center gap-2">
              Thông tin chi tiết
              {!hasDetail && <i className="pi pi-lock" style={{ fontSize: "0.8rem", color: "red" }} />}
            </div>
          }
          disabled={!hasDetail}
        >
          <div className="p-fluid p-2" style={{ minHeight: '350px' }}>
            <div className="grid">
                <InputTextField
                  label={"Thông tin khác"}
                  name="thong_tin_khac"
                  value={localFormData.thong_tin_khac || ""}
                  disabled
                  divClassName="col-12"
                />
              {configDetails.map((cfg, idx) => (
                <div className="col-12 md:col-6 lg:col-4" key={idx}>
                  {cfg.type === "text" && (
                    <InputTextField
                      label={cfg.label}
                      name={cfg.name}
                      value={detailValues[cfg.name] || ""}
                      onChange={(e) =>
                        setDetailValues(prev => ({ ...prev, [cfg.name]: e.target.value }))
                      }
                    />
                  )}
                  {cfg.type === "number" && (
                    <InputTextField
                      label={cfg.label}
                      name={cfg.name}
                      type="number"
                      value={detailValues[cfg.name] || ""}
                      onChange={(e) =>
                        setDetailValues(prev => ({ ...prev, [cfg.name]: e.target.value }))
                      }
                    />
                  )}
                  {cfg.type === "date" && (
                    <CalendarField
                      label={cfg.label}
                      name={cfg.name}
                      value={detailValues[cfg.name] || null}
                      onChange={(val) =>
                        setDetailValues(prev => ({ ...prev, [cfg.name]: val }))
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
      </TabView>

      {/* Nút hành động */}

      <div className="flex justify-content-center gap-2 mt-2">
        {
          <Button
            label="Xác nhận"
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
  );
};

export default DiaglogForm;
