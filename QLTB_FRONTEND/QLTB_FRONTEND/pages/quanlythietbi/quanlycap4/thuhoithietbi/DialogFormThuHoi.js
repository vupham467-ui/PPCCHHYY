// DialogFormGiaoNhan.jsx
import React, { useState, useEffect, useContext } from "react";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { storageHelper } from "../../../../utils/storageUtils";
import moment from "moment";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import DialogChonThietBi from "./DialogChonThietBi";
import { fetchData, validateRequiredFields } from "../../../../utils/commonUltil";
import { khoTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";
import { giaoNhanTBService } from "../../../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import { MADV_CTY, QLTB_LoaiThuHoiArr } from "../../../../constants/propGlobal";
import { MenuContext } from "../../../../layout/context/menucontext";

const DialogFormThuHoi = ({
  visible,
  setVisible,
  donViTraArr,
  showToast,
  loadData,
  formData,
  setFormData,
  isUpdate,
  setIsUpdate,
}) => {
  const user = storageHelper.get("user");
  const { ten_dang_nhap, dm_phongban_id, ma_dviqly } = user;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [danhMucPhongBan, setDanhMucPhongBan] = useState([]);
  const [danhMucKho, setDanhMucKho] = useState([]);
  const [dsNguoiTra, setDsNguoiTra] = useState([]);
  const [thietBiSelected, setThietBiSelected] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTabs, setActiveTabs] = useState([]);
  const { refreshWaitSign } = useContext(MenuContext);

  // Gom nhóm thiết bị theo tên
  const groupThietBiByTen = (list = []) => {
    return list.reduce((groups, tb) => {
      const key = (tb.ten_thietbi || "").trim() || "Khác";

      if (!groups[key]) groups[key] = [];
      groups[key].push(tb);

      return groups;
    }, {});
  };

  const formGiaoNhan = {
    loai_nghiepvu: "THSD", //thu hồi người sử dụng ở đơn vị cấp 4
    ma_dvi_giao: ma_dviqly,
    phongban_giao_id: dm_phongban_id,
    ma_dvi_nhan: ma_dviqly,
    phongban_nhan_id: "",
    nguoi_giao: ten_dang_nhap,
    kho_nhan_id: null,
    nguoi_nhan: "",
    ngay_lapphieu: moment(new Date()).format("HH:mm DD/MM/YYYY"),
    so_luong: 0,
    noi_dung: ""
  };

  //Lấy danh sách kho thu hồi thuộc Cty:
  useEffect(() => {
    if (!formData.ma_dvi_giao) return;
    fetchData(khoTBService.get, setDanhMucKho, { pageSize: -1, ma_dviqly: formData.ma_dvi_giao });
  }, [formData.ma_dvi_giao]);
  
  useEffect(() => {
    if (!isUpdate) setFormData(formGiaoNhan);
  }, [isUpdate]);

  useEffect(() => {
    // Mở tất cả tab khi ds thiết bị thay đổi
    const allIndexes = Object.keys(groupThietBiByTen(thietBiSelected)).map((_, i) => i);
    setActiveTabs(allIndexes);
  }, [thietBiSelected]);
  
  // Load phòng ban trả:
  useEffect(() => {
    const fetchPhongBanTra = async () => {
      if (!formData?.ma_dvi_nhan) return;
      try {
        const response = await getDM_PHONGBANByMA_DVIQLY(formData.ma_dvi_nhan);
        setDanhMucPhongBan(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPhongBanTra();
  }, [formData?.ma_dvi_nhan]);
  
  // Load người trả:
  useEffect(() => {
    const fetchNguoiTra = async () => {
      if (!formData?.ma_dvi_nhan) return;
      try {
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
          ma_dviqly: formData?.ma_dvi_nhan,
          db_maphongban: formData?.phongban_nhan_id,
        });
        
        setDsNguoiTra(res || []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNguoiTra();
  }, [formData?.ma_dvi_nhan, formData?.phongban_nhan_id]);

  useEffect(() => {
    if (isUpdate && formData?.ds_thietbi) {
      setThietBiSelected(formData.ds_thietbi);
      setFormData(prev => ({ ...prev, so_luong: formData.ds_thietbi.length }));
    }
  }, [isUpdate, formData?.ds_thietbi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // khi thay đổi người trả, reset danh sách thiết bị chọn:
    if (name === "nguoi_nhan") {
      setFormData(prev => ({ ...prev, nguoi_nhan: "", ds_thietbi: [] }));
      setThietBiSelected([]);
      //Không cho người trả trùng người thu hồi
      if (value == user?.ten_dang_nhap) {
        showToast("warn", "Người trả không được trùng với người thu hồi!");
        return;
      }
    }

    // Khi thay đổi phòng ban trả
    if (name === "phongban_nhan_id") {
      setFormData(prev => ({
        ...prev,
        phongban_nhan_id: value,
        nguoi_nhan: "",
        ds_thietbi: []
      }));
      setDsNguoiTra([]);
      setThietBiSelected([]);
      return;
    } 

    // Các field khác
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const requiredFields = {
      kho_nhan_id: "Kho thu hồi",
      phongban_nhan_id: "Phòng ban trả",
      nguoi_giao: "Người thu hồi",
      nguoi_nhan: "Người trả",
      ngay_lapphieu: "Ngày lập phiếu",
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
    const ds_thietbi_chon = formData?.ds_thietbi || [];
    if (ds_thietbi_chon?.length <= 0) {
      showToast("error", "Vui lòng chọn thiết bị!");
      setIsSubmitting(false);
      return;
    }
    try {
      // const dsThietBiIds = ds_thietbi_chon.map(item => item.id);
      const dsThietBiPayload = ds_thietbi_chon.map(tb => ({
        id: tb?.id,
        nguoi_sd: tb?.nguoi_sd ?? null
      }));
      const params = {
        ...formData,
        loai_bban: 1, // Biên bản thu hồi
        // ds_thietbi_id: dsThietBiIds
        ds_thietbi: dsThietBiPayload
      }

      console.log(params);
      
      
      if (!isUpdate) {
        await giaoNhanTBService.insert(params);
        showToast("success", "Thêm biên bản thành công!");
      } else {
        await giaoNhanTBService.update(params);
        showToast("success", "Cập nhật biên bản thành công!");
      }
            
      loadData();
      await refreshWaitSign(ten_dang_nhap);
      setVisible(false);
    } catch (err) {
      console.log(err);
      let message = "Lỗi khi gửi dữ liệu";
      const error = err?.response?.data ;
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

  const handleSelectThietBi = (selectedTBs) => {
    setThietBiSelected(selectedTBs);
    setFormData(prev => ({ ...prev, ds_thietbi: selectedTBs, so_luong: selectedTBs.length }));
  };

  const handleClickChonThietBi = () => {
    
    if (!formData?.phongban_nhan_id || !formData?.nguoi_nhan ) {
      showToast("warn", "Vui lòng điền đủ thông tin phiếu trước khi chọn thiết bị!")
      return;
    }
    setSidebarVisible(true);
  }

  return (
    <>
      <Dialog
        header={isUpdate ? "Sửa biên bản" : "Thêm mới biên bản"}
        visible={visible}
        className="w-11 md:w-9 lg:w-7 xl:w-6"
        style={{
          // transform: sidebarVisible ? "translateX(-22.5vw)" : "translateX(0)",
          transform: sidebarVisible ? (window.innerWidth < 640 ? 'translateX(0)' : 'translateX(-22.5vw)') : 'translateX(0)',
          transition: "transform 0.3s ease-in-out"
        }}
        onHide={() => {
          setVisible(false);
          if (!isUpdate) {
            setFormData(formGiaoNhan);
            setThietBiSelected([]);
          }
        }}
      >
        <TabView>
          <TabPanel header="Thông tin phiếu">
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
              <div className="grid">
                  <DropdownField
                    label="Kho thu hồi"
                    name="kho_nhan_id"
                    value={formData?.kho_nhan_id }
                    options={danhMucKho}
                    optionLabel="ten_kho"
                    optionValue="id"
                    onChange={handleInputChange}
                    required
                    // disabled
                    error={errors?.kho_nhan_id}
                    divClassName="col-12 md:col-6"
                  />
                  <DropdownField
                    label="Phòng ban trả"
                    name="phongban_nhan_id"
                    value={formData?.phongban_nhan_id}
                    options={danhMucPhongBan}
                    optionLabel="ten"
                    optionValue="id"
                    onChange={handleInputChange}
                    required
                    error={errors?.phongban_nhan_id}
                    divClassName="col-12 md:col-6"
                  />
                  <DropdownField
                    label="Người trả"
                    name="nguoi_nhan"
                    value={formData?.nguoi_nhan}
                    options={dsNguoiTra}
                    optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
                    optionValue="teN_DANG_NHAP"
                    onChange={handleInputChange}
                    required
                    error={errors?.nguoi_nhan}
                    divClassName="col-12 md:col-6"
                  />
                  <InputTextField
                    label="Số lượng thiết bị"
                    name="so_luong"
                    value={formData?.so_luong || 0}
                    required
                    disabled
                    divClassName="col-12 md:col-6"
                  />
                  <InputTextField
                    label="Người thu hồi"
                    name="nguoi_giao"
                    value={formData?.nguoi_giao || ""}
                    onChange={handleInputChange}
                    error={errors?.nguoi_giao}
                    disabled
                    required
                    divClassName="col-12 md:col-6"
                  />
                  <InputTextField
                    label="Nội dung"
                    name="noi_dung"
                    textarea
                    rows={1}
                    value={formData?.noi_dung || ""}
                    onChange={handleInputChange}
                    divClassName="col-12"
                  />
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Danh sách thiết bị">
            <div className="flex justify-content-start mt-3">
              <Button
                label="Chọn thiết bị"
                onClick={handleClickChonThietBi}
                icon="pi pi-plus"
                severity="primary"
              />
            </div>

            {thietBiSelected.length > 0 && (
              <div className="mt-4">
                <h5>Danh sách thiết bị đã chọn: ({thietBiSelected.length} thiết bị)</h5>
                <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                  <Accordion 
                    multiple
                    activeIndex={activeTabs}
                    onTabChange={(e) => setActiveTabs(e.index)}
                  >
                    {Object.entries(groupThietBiByTen(thietBiSelected)).map(([ten, items], index) => (
                      <AccordionTab key={ten} header={`${ten} (${items.length})`}>
                        <DataTable
                          value={items}
                          stripedRows
                          showGridlines
                          scrollable
                          dataKey="id"
                          responsiveLayout="scroll"
                        >
                          <Column header="STT" body={(_, options) => options.rowIndex + 1} style={{ width: '3rem' }} />
                          <Column field="ma_thietbi" header="Mã thiết bị" />
                          <Column field="no_thietbi" header="Serial" />
                          <Column field="dm_donvitinh_ten" header="Đơn vị tính" />
                          <Column field="tbi_dm_hangsx_ten" header="Hãng SX" />
                          <Column field="ten_nguoi_sd" header="Người SD cũ" />
                        </DataTable>
                      </AccordionTab>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}
          </TabPanel>
        </TabView>

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

      {sidebarVisible && 
        <DialogChonThietBi
          visible={sidebarVisible}
          setVisible={setSidebarVisible}
          onSelect={handleSelectThietBi}
          initialSelected={thietBiSelected}
          isUpdate={isUpdate}
          formData={formData}
        />
      }
    </>
  );
};

export default DialogFormThuHoi;
