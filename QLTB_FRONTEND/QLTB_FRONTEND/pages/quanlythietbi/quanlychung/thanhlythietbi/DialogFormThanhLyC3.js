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
import { arrTinhTrangThietBi, idP10, MADV_CTY } from "../../../../constants/propGlobal";
import { MenuContext } from "../../../../layout/context/menucontext";
import AutoCompleteCustom from "../../../../components/AutoComplateCustom";
import { InputText } from "primereact/inputtext";

const DialogFormThanhLyC3 = ({
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
  const { ten_dang_nhap, dm_phongban_id, ma_dviqly } = user;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dsNguoiGiao, setDsNguoiGiao] = useState([]);
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
    loai_nghiepvu: "TLC3", //thanh lý
    ma_dvi_giao: ma_dviqly,
    phongban_giao_id: idP10,
    ma_dvi_nhan: MADV_CTY,
    phongban_nhan_id: idP10,  //Phòng CNTT
    nguoi_tao: ten_dang_nhap,
    nguoi_giao: ten_dang_nhap, //nguoi_kiemtra
    nguoi_nhan: "", //Lãnh đạo P10
    ngay_lapphieu: moment(new Date()).format("HH:mm DD/MM/YYYY"),
    so_luong: 0,
    noi_dung: ""
  };

  useEffect(() => {
    if (!isUpdate) setFormData(formGiaoNhan);
  }, [isUpdate]);

  useEffect(() => {
    // Mở tất cả tab khi ds thiết bị thay đổi
    const allIndexes = Object.keys(groupThietBiByTen(thietBiSelected)).map((_, i) => i);
    setActiveTabs(allIndexes);
  }, [thietBiSelected]);
  

  
  // Load lãnh đạo P10:
  useEffect(() => {
    const fetchNguoiNhan = async () => {
      if (!formData?.phongban_nhan_id) return;
      try {
        const params =  {
          ma_dviqly: MADV_CTY,
          db_maphongban: formData?.phongban_nhan_id,
        };
        
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(params);

        const dataTP = filterUsersByRole(res, "teN_CHUCVU", ["trưởng phòng", "phó phòng"]);
        
        setDsNguoiNhan(dataTP || []);
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

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name == "nguoi_nhan" && value == ten_dang_nhap) {
      setFormData(prev => ({ ...prev, nguoi_nhan: "" }));
      showToast("warn", "Người kiểm tra không được trùng với người xác nhận!");
      return;
    }
    // Các field khác
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //Cập nhật thông tin trong chi tiết:
  const handleUpdateThietBiField = (id, field, value) => {
    setThietBiSelected((prev) =>
      prev.map((tb) =>
        tb.id === id ? { ...tb, [field]: value } : tb
      )
    );

    setFormData((prev) => ({
      ...prev,
      ds_thietbi: prev.ds_thietbi.map((tb) =>
        tb.id === id ? { ...tb, [field]: value } : tb
      ),
    }));
  };


  const validateFields = () => {
    const requiredFields = {
      ma_dvi_nhan: "Đơn vị nhận",
      phongban_nhan_id: "Phòng ban nhận",
      nguoi_giao: "Người kiểm tra",
      nguoi_nhan: "Người xác nhận",
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
        nguoi_sd: tb?.nguoi_sd ?? null,
        tinh_trang_tb: tb?.tinh_trang_tb ?? null,
        nguyen_nhan: tb?.nguyen_nhan ?? null,
      }));
      const params = {
        ...formData,
        loai_bban: 3, // Biên bản thanh lý
        // ds_thietbi_id: dsThietBiIds
        ds_thietbi: dsThietBiPayload
      }

      if (!isUpdate) {
        await giaoNhanTBService.insertBienBanKiemTraThanhLy(params);
        showToast("success", "Thêm biên bản thành công!");
      } else {
        await giaoNhanTBService.updateBienBanKiemTraThanhLy(params);
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
    
    if (!formData?.ma_dvi_nhan || !formData?.nguoi_giao || !formData?.nguoi_nhan ) {
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
        className="w-11 md:w-9 lg:w-7 xl:w-7"
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
                      label="Người xác nhận kiểm tra"
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
                          <Column field="dm_donvitinh_ten" header="ĐVT" />
                          <Column field="tbi_dm_hangsx_ten" header="Hãng SX" />
                          {/* <Column field="ten_nguoi_sd" header="Người SD cũ" /> */}
                          <Column
                            header="Tình trạng"
                            body={(rowData) => (
                              <TinhTrangCell
                                rowData={rowData}
                                options={arrTinhTrangThietBi}
                                onChange={handleUpdateThietBiField}
                              />
                            )}
                          />
                          <Column
                            header="Nguyên nhân"
                            body={(rowData) => (
                              <NguyenNhanCell
                                rowData={rowData}
                                onChange={handleUpdateThietBiField}
                              />
                            )}
                          />
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

const TinhTrangCell = React.memo(({ rowData, onChange, options }) => {
    return (
      <AutoCompleteCustom
        items={options}
        placeholder="Chọn hoặc nhập tình trạng"
        value={rowData.tinh_trang_tb}
        onChange={(val) => onChange(rowData.id, "tinh_trang_tb", val)}
      />
    );
  });
TinhTrangCell.displayName = 'TinhTrangCell';

const NguyenNhanCell = React.memo(({ rowData, onChange }) => {
  return (
    <InputText
      style={{ width: "100%" }}
      placeholder="Nhập nguyên nhân"
      value={rowData.nguyen_nhan || ""}
      onChange={(e) =>
        onChange(rowData.id, "nguyen_nhan", e.target.value)
      }
    />
  );
});
NguyenNhanCell.displayName = "NguyenNhanCell";


export default DialogFormThanhLyC3;
