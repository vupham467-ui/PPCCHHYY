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
import { idP10, MADV_CTY } from "../../../../constants/propGlobal";
import { MenuContext } from "../../../../layout/context/menucontext";

const DialogFormTraLai = ({
  visible,
  setVisible,
  showToast,
  loadData,
  formData,
  setFormData,
  isUpdate,
  setIsUpdate,
}) => {
  const user = storageHelper.get("user");
  const { ten_dang_nhap, dm_phongban_id, ma_dviqly } = user; //user QL ĐVC4

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [danhMucPhongBan, setDanhMucPhongBan] = useState([]);
  const [danhMucKho, setDanhMucKho] = useState([]);
  const [dsNguoiNhan, setDsNguoiNhan] = useState([]);
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
    loai_nghiepvu: "THC4",
    ma_dvi_giao: ma_dviqly,
    phongban_giao_id: dm_phongban_id,
    ma_dvi_nhan: MADV_CTY,
    phongban_nhan_id: idP10,  //Phòng  CNTT
    nguoi_giao: ten_dang_nhap,
    kho_nhan_id: 1, //Mặc định khi thu hồi về kho CNTT
    nguoi_nhan: "",
    ngay_lapphieu: moment(new Date()).format("HH:mm DD/MM/YYYY"),
    so_luong: 0,
    noi_dung: ""
  };

  //Lấy danh sách kho thu hồi thuộc Cty:
  useEffect(() => {
    if (!formData.ma_dvi_nhan) return;
    fetchData(khoTBService.get, setDanhMucKho, { pageSize: -1, ma_dviqly: formData.ma_dvi_nhan });
  }, [formData.ma_dvi_nhan]);

  useEffect(() => {
    if (!isUpdate) setFormData(formGiaoNhan);
  }, [isUpdate]);

  useEffect(() => {
    // Mở tất cả tab khi ds thiết bị thay đổi
    const allIndexes = Object.keys(groupThietBiByTen(thietBiSelected)).map((_, i) => i);
    setActiveTabs(allIndexes);
  }, [thietBiSelected]);
  
  // Load phòng ban nhận lại:
  useEffect(() => {
    const fetchPhongBanNhan = async () => {
      if (!formData?.ma_dvi_nhan) return;
      try {
        const response = await getDM_PHONGBANByMA_DVIQLY(formData.ma_dvi_nhan);
        setDanhMucPhongBan(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPhongBanNhan();
  }, [formData?.ma_dvi_nhan]);
  
  // Load người nhận:
  useEffect(() => {
    const fetchNguoiNhan = async () => {
      if (!formData?.phongban_nhan_id) return;
      try {
        const params =  {
          ma_dviqly: MADV_CTY,
          db_maphongban: formData?.phongban_nhan_id,
          vai_tro: "ADMIN, QLTB_QLP10"
        };
        
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(params);
        
        setDsNguoiNhan(res || []);
      } catch (e) {
        console.log(e);
        setDsNguoiNhan([]);
      }
    };
    fetchNguoiNhan();
  }, [formData?.phongban_nhan_id]);

  useEffect(() => {
    if (isUpdate && formData?.ds_thietbi) {
      setThietBiSelected(formData.ds_thietbi);
      setFormData(prev => ({ ...prev, so_luong: formData.ds_thietbi.length }));
    }
  }, [isUpdate, formData?.ds_thietbi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // khi thay đổi người nhận
    if (name === "nguoi_nhan") {
      if (value == user?.ten_dang_nhap) {
        showToast("warn", "Người trả không được trùng với người nhận!");
        return;
      }
    }

    // Các field khác
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const requiredFields = {
      ma_dvi_nhan: "Đơn vị nhận",
      phongban_nhan_id: "Phòng ban nhận",
      nguoi_giao: "Người trả",
      nguoi_nhan: "Người nhận",
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
        loai_bban: 2, // Biên bản trả lại
        // ds_thietbi_id: dsThietBiIds
        ds_thietbi: dsThietBiPayload
      }
     
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
    
    if (!formData?.ma_dvi_nhan || !formData?.phongban_nhan_id || !formData?.nguoi_nhan ) {
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
                      label="Người nhận"
                      name="nguoi_nhan"
                      value={formData?.nguoi_nhan}
                      options={dsNguoiNhan}
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

export default DialogFormTraLai;
