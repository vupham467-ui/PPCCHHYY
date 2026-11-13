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
import SelectMenu from "../../../../components/SelectMenu";
import { TabPanel, TabView } from "primereact/tabview";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";

const DiaglogForm = ({
  formData,
  setFormData,
  isUpdate,
  isView,
  visible,
  setVisible,
  showToast,
  loadData,
  donViArr,
  current_MADVIQLY,
  chungLoaiArr,
  nuocSXArr,
  trangThaiThietBiArr,
  handlePrintQR,
  visibleDialogQR
}) => {
  const [localFormData, setLocalFormData] = useState(formData || QLTB_DM_THIETBI);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [danhMucPhongBan, setDanhMucPhongBan] = useState([]);
  const [danhMucKho, setDanhMucKho] = useState([]);
  const [danhMucDVTinh, setDanhMucDVTinh] = useState([]);
  const [danhMucHangSX, setDanhMucHangX] = useState([]);
  const [hasDetail, setHasDetail] = useState(false);
  const [configDetails, setConfigDetails] = useState([]); // mảng cấu hình chi tiết
  const [detailValues, setDetailValues] = useState({});   // giá trị nhập của từng trường
  const [users, setUsers] = useState([]);

  const user = storageHelper.get("user");
  const { ho_ten, ten_dang_nhap, dm_donvi_id, ma_dviqly, dm_phongban_id } = user;
  const isAdmin = user?.ma_dviqly == MADV_CTY && user?.is_admin == "Y";
  
  // Khi modal mở, khởi tạo localFormData
  useEffect(() => {
    if (visible) {
      if (!isUpdate && !isView) {
        setLocalFormData({
          ...QLTB_DM_THIETBI,
          tbi_kho_id: ma_dviqly == MADV_CTY ? 1 : null, //Nếu là công ty tạo (P10) để mặc định kho CNTT - thiết bị mới (1)
          ma_dviqly: ma_dviqly,
          dm_donvi_id: dm_donvi_id,
          // dm_phongban_id: ma_dviqly == MADV_CTY ? dm_phongban_id : "",
          dm_phongban_id: "",
          namsx: moment(new Date()).format("YYYY"),
          ngay_vanhanh: moment(new Date()).format("DD/MM/YYYY"),
          ngay_tao: moment(new Date()).format("HH:mm DD/MM/YYYY"),
          nguoi_tao: ten_dang_nhap
        });
      } else {
        setLocalFormData(formData || QLTB_DM_THIETBI);
      }

      fetchData(donViTinhService.get, setDanhMucDVTinh);
      fetchData(hangSxTBService.get, setDanhMucHangX);
    }
  }, [visible, isUpdate, formData]);

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

      // Load người sử dụng
    useEffect(() => {
      const fetchNguoiSD = async () => {
        if (!localFormData?.ma_dviqly) {
          setUsers([]);
          return;
        }
        try {
          const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
            ma_dviqly: localFormData?.ma_dviqly,
            db_maphongban: localFormData?.dm_phongban_id,
          });
          setUsers(res || []);
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
        if ((isUpdate || isView) && localFormData?.thongtin_chitiet_json) {
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
      ma_dviqly: "Đơn vị quản lý",
      dm_donvi_id: "Đơn vị quản lý",
      // dm_phongban_id: "Phòng ban sử dụng",
      // tbi_kho_id: "Kho đơn vị",
      ma_thietbi: "Mã thiết bị",
      ten_thietbi: "Tên thiết bị",
      no_thietbi: "Serial thiết bị",
      dm_donvitinh_id: "ĐV tính",
      namsx: "Năm SX",
      tbi_dm_chungloai_id: "Chủng loại",
      tbi_dm_hangsx_id: "Hãng SX",
      tbi_nuocsx_id: "Nước SX",
      // tbi_trangthai_id: "Trạng thái",
      ngay_vanhanh: "Ngày vận hành",
      nguoi_tao: "Người tạo",
      ngay_tao: "Ngày tạo",
    };
    
    if (!isUpdate) {
      requiredFields.tbi_kho_id = "Kho đơn vị";
    }

    const newErrors = validateRequiredFields(localFormData, requiredFields);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
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
        ...localFormData,
        thongtin_chitiet_json: JSON.stringify(detailValues)
      };


      if (isUpdate) {
        payload.nguoi_sua = user?.ten_dang_nhap;
        await thietBiService.update(payload);
      } else await thietBiService.insert(payload);

      showToast("success", isUpdate ? "Cập nhật thành công!" : "Thêm dữ liệu thành công!");
      if (!isUpdate) {
        // Thêm mới: giữ dialog, chỉ reset mã, serial, ngày tạo
        setLocalFormData(prev => ({
          ...prev,
          ma_thietbi: "",
          no_thietbi: "",
          ngay_tao: moment(new Date()).format("HH:mm DD/MM/YYYY")
        }));
      } else {
        setVisible(false);
      }
    
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
      header={isUpdate ? "Sửa thông tin" : (isView ? "Xem chi tiết" : "Thêm mới")}
      visible={visible}
      className="w-11 md:w-10 lg:w-9"
      onHide={() => setVisible(false)}
    >
      <TabView>
        <TabPanel header="Thông tin chung">
          <div className="p-fluid p-2" style={{ minHeight: '350px' }}>
            <div className="grid">
              {/* Đơn vị quản lý */}
              <DropdownField
                label="Đơn vị quản lý"
                name="ma_dviqly"
                value={localFormData?.ma_dviqly || current_MADVIQLY}
                options={donViArr}
                optionLabel="ten"
                optionValue="ma_dviqly"
                onChange={(e) => {
                  const selected = donViArr.find(d => d.ma_dviqly === e.value);
                  setLocalFormData(prev => ({
                    ...prev,
                    ma_dviqly: e.value,
                    dm_donvi_id: selected ? selected.id : dm_donvi_id,
                    dm_phongban_id: "",
                    tbi_kho_id: e.value == MADV_CTY ? 1 : null // Nếu chọn đơn vị là Cty => kho CNTT - thiết bị mới
                  }));
                }}
                required
                showClear={false}
                error={errors?.ma_dviqly}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={current_MADVIQLY !== MADV_CTY || isView || isUpdate}
              />

              {/* Kho */}
              <DropdownField
                label="Kho đơn vị"
                name="tbi_kho_id"
                value={localFormData?.tbi_kho_id}
                options={danhMucKho}
                optionLabel="ten_kho"
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_kho_id: e.value }))}
                required
                showClear={true}
                error={errors?.tbi_kho_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView || (isUpdate && !isAdmin)}
              />
              {/* Phòng ban sử dụng */}
              <DropdownField
                label="Phòng ban"
                name="dm_phongban_id"
                value={localFormData?.dm_phongban_id}
                options={danhMucPhongBan}
                optionLabel="ten"
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, dm_phongban_id: e.value }))}
                showClear={true}
                // required
                // error={errors?.dm_phongban_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled = {!isAdmin || isView || !isUpdate}
                // disabled={isView || isUpdate}
              />

              {/* Mã & Tên & Serial */}
              <InputTextField
                label="Tên thiết bị"
                name="ten_thietbi"
                value={localFormData?.ten_thietbi || ""}
                onChange={handleInputChange}
                error={errors?.ten_thietbi}
                required
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView}
              />
              <InputTextField
                label="Mã thiết bị"
                name="ma_thietbi"
                value={localFormData?.ma_thietbi || ""}
                onChange={handleInputChange}
                error={errors?.ma_thietbi}
                required
                divClassName="col-6 md:col-3 lg:col-2"
                disabled={isView}
              />
              <InputTextField
                label="Serial"
                name="no_thietbi"
                value={localFormData?.no_thietbi || ""}
                onChange={handleInputChange}
                error={errors?.no_thietbi}
                required
                divClassName="col-6 md:col-3 lg:col-2"
                disabled={isView}
              />

              {/* Đơn vị tính */}
              <DropdownField
                label="ĐV tính"
                name="dm_donvitinh_id"
                value={localFormData?.dm_donvitinh_id}
                options={danhMucDVTinh}
                optionLabel="ten_donvitinh"
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, dm_donvitinh_id: e.value }))}
                required
                showClear={false}
                error={errors?.dm_donvitinh_id}
                divClassName="col-6 md:col-3 lg:col-2"
                disabled={isView}
              />

              {/* Năm SX */}
              <CalendarField
                label="Năm SX"
                name="namsx"
                value={localFormData?.namsx}
                onChange={(val) => setLocalFormData(prev => ({ ...prev, namsx: val }))}
                error={errors?.namsx}
                required
                view="year"
                dateFormat="yy"
                dateStringFormat="YYYY"
                divClassName="col-6 md:col-3 lg:col-2"
                disabled={isView}
              />

              {/* Chủng loại, Hãng SX, Nước SX, Trạng thái */}
              <DropdownField
                label="Chủng loại"
                name="tbi_dm_chungloai_id"
                value={localFormData?.tbi_dm_chungloai_id}
                options={chungLoaiArr}
                optionLabel={(o) => `${o.ma_chungloai} - ${o.ten_chungloai}`}
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_dm_chungloai_id: e.value }))}
                required
                showClear={false}
                error={errors?.tbi_dm_chungloai_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView}
              />
              <DropdownField
                label="Hãng SX"
                name="tbi_dm_hangsx_id"
                value={localFormData?.tbi_dm_hangsx_id}
                options={danhMucHangSX}
                optionLabel={(o) => `${o.ma_hang_sx} - ${o.ten_hang_sx}`}
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_dm_hangsx_id: e.value }))}
                required
                showClear={false}
                error={errors?.tbi_dm_hangsx_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView}
              />
              <DropdownField
                label="Nước SX"
                name="tbi_nuocsx_id"
                value={localFormData?.tbi_nuocsx_id}
                options={nuocSXArr}
                optionLabel={(o) => `${o.ma_nuoc_sx} - ${o.ten_nuoc_sx}`}
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_nuocsx_id: e.value }))}
                required
                showClear={false}
                error={errors?.tbi_nuocsx_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView}
              />
              {isAdmin && isUpdate && <DropdownField
                label="Trạng thái"
                name="tbi_trangthai_id"
                value={localFormData?.tbi_trangthai_id}
                options={trangThaiThietBiArr}
                optionLabel={(o) => `${o.ma} - ${o.ten}`}
                optionValue="id"
                onChange={(e) => setLocalFormData(prev => ({ ...prev, tbi_trangthai_id: e.value }))}
                required
                error={errors?.tbi_trangthai_id}
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView}
              />}

              {/* Ngày vận hành */}
              <CalendarField
                label="Ngày vận hành"
                name="ngay_vanhanh"
                value={localFormData?.ngay_vanhanh}
                onChange={(val) => setLocalFormData(prev => ({ ...prev, ngay_vanhanh: val }))}
                error={errors?.ngay_vanhanh}
                required
                // showTime
                dateStringFormat="DD/MM/YYYY"
                divClassName="col-12 md:col-6 lg:col-4"
                disabled={isView}
              />

              {/* Người tạo & Ngày tạo */}
              <InputTextField
                label="Người tạo"
                name="nguoi_tao"
                value={`${localFormData?.nguoi_tao}`}
                required
                disabled
                divClassName="col-12 md:col-6 lg:col-4"
              />

              <CalendarField
                label="Ngày tạo"
                name="ngay_tao"
                value={localFormData?.ngay_tao}
                required
                disabled
                showTime
                divClassName="col-12 md:col-6 lg:col-4"
              />

              {/* Người sử dụng & Thông tin khác */}
              {!(isAdmin && isUpdate) && 
                <InputTextField
                  label="Người sử dụng"
                  name="nguoi_sd"
                  value={localFormData?.nguoi_sd || ""}
                  // onChange={handleInputChange}
                  divClassName="col-12 md:col-6 lg:col-4"
                  // disabled={isView}
                  disabled
                />
              }

              {/* Người sd */}
              {isAdmin && isUpdate && <DropdownField
                label="Người sử dụng"
                name="nguoi_sd"
                value={localFormData?.nguoi_sd}
                options={users}
                optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
                optionValue="teN_DANG_NHAP"
                onChange={handleInputChange}
                divClassName="col-12 md:col-6 lg:col-4"
                labelClassName="mb-2 block"
              />
              }

              <InputTextField
                label="Thông tin khác"
                name="thong_tin_khac"
                value={localFormData?.thong_tin_khac || ""}
                onChange={handleInputChange}
                // divClassName="col-12 md:col-6 lg:col-8"
                divClassName={`col-12 md:col-6 ${(isAdmin && isUpdate) ? "lg:col-4" : "lg:col-8"}`}
                disabled={isView}
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
                      disabled={isView}
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
                      disabled={isView}
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
                      disabled={isView}
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
        {!isView &&
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
        {
          isView && localFormData?.duyet_tbi == "1" &&
          <SelectMenu
            items={
              [      
                {
                  label: "In mã QR code (bộ 1 mã)",
                  icon: <i className="pi pi-print" style={{ color: "blue", marginRight: "0.5rem" }}></i>,
                  command: () => handlePrintQR(formData, "single")
                },
                {
                  label: "In mã QR code (bộ 3 mã)",
                  icon: <i className="pi pi-print" style={{ color: "blue", marginRight: "0.5rem" }}></i>,
                  command: () => handlePrintQR(formData, "small")
                }
              ]
            } 
            label="In QR"
            icon= "pi pi-qrcode"/>
        }
      </div>

    </Dialog>
  );
};

export default DiaglogForm;
