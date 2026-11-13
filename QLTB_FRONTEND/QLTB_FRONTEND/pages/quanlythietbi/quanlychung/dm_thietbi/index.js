import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import DiaglogForm from "./DiaglogForm";
import { MADV_CTY, pageSizeSelect } from "../../../../constants/propGlobal";
import { QLTB_DM_THIETBI } from "../../../../models/quanlythietbi/QLTB_DM_THIETBI";
import { chungloaiTBService, hangSxTBService, nhomThietBiService, nuocSxService, thietBiService, trangThaiTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { storageHelper } from "../../../../utils/storageUtils";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";
import DanhMucThietBiTable from "./DanhMucThietBiTable";
import { fetchData } from "../../../../utils/commonUltil";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DiaglogQR from "./DiaglogQR";
import { genQRService } from "../../../../services/quanlythietbi/QLTB_GenQRService";
import DialogImportExcel from "./DialogImportExcel";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";

const trangThaiKhoaArr = [
  {value: 0, label: "Thiết bị mới, đang chờ duyệt"},
  {value: 1, label: "Đăng ký mở khóa"},
  {value: 2, label: "Mở khóa"},
  {value: 3, label: "Khóa"},
];

const DanhMucThietBi = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
  const [options, setOptions] = useState({
    id: "",
    tbi_dm_chungloai_id: "",
    ma_nhom_tbi: "",
    tbi_dm_hangsx_id: "",
    tbi_nuocsx_id:"",
    tbi_kho_id: "",
    tbi_trangthai_id: "",
    dm_donvitinh_id: "",
    dm_donvi_id: "",
    dm_phongban_id: "",
    qr_code: "",
    // ma_thietbi: "",
    // no_thietbi: "",
    // ten_thietbi: "",
    search_thietbi: "",
    ngay_vanhanh: "",
    ngay_tao: "",
    ngay_duyet: "",
    nguoi_tao: "",
    nguoi_duyet: "",
    khoa_tbi: "",
    duyet_tbi: "",
    ma_dviqly: current_MADVIQLY  == MADV_CTY ? "" : current_MADVIQLY,
    namsx: "",
    thong_so_khac: "",
    trang_thai_khoa: ""
  });
  const [dataTable, setDataTable] = useState([]);
  const [formData, setFormData] = useState(QLTB_DM_THIETBI);
  const [donViArr, setDonViArr] = useState([]);
  const [danhMucPhongBan, setDanhMucPhongBan] = useState([]);
  const [trangThaiThietBiArr, setTrangThaiThietBiArr] = useState([]);
  const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
  const [chungLoaiArr, setChungLoaiArr] = useState([]);
  const [danhMucHangSX, setDanhMucHangX] = useState([]);
  const [nuocSXArr, setNuocSXArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleDialogQR, setVisibleDialogQR] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [dataBase64, setDataBase64] = useState("");

  const [isImportDialogVisible, setIsImportDialogVisible] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    const getDonViArr = async () => {
      try {
    
      const response = await get_DM_DONVI_ROOT(options.ma_dviqly);
      setDonViArr(response?.data);

      } catch (err) {
        console.log(err);
      } 
    }
    getDonViArr();
    fetchData(trangThaiTBService.get, setTrangThaiThietBiArr); //Danh mục trạng thái
    fetchData(nhomThietBiService.get, setNhomThietBiArr); //Danh mục nhóm thiết bị
    // fetchData(chungloaiTBService.get, setChungLoaiArr); //Danh mục chủng loại thiết bị
    fetchData(hangSxTBService.get, setDanhMucHangX);
    fetchData(nuocSxService.get, setNuocSXArr); //Danh mục nước SX thiết bị
  }, []);

  // Khi nhóm thiết bị thay đổi => load lại chủng loại
  useEffect(() => {
      // reset chủng loại đang chọn mỗi khi nhóm thay đổi
      setOptions(prev => ({
          ...prev,
          tbi_dm_chungloai_id: null
      }));

      // nếu CHƯA chọn nhóm => load TẤT CẢ chủng loại
      if (!options.ma_nhom_tbi) {
          fetchData(
              chungloaiTBService.get,
              setChungLoaiArr,
              {}
          );
          return;
      }

      // nếu ĐÃ chọn nhóm => load chủng loại theo nhóm
      fetchData(
          chungloaiTBService.get,
          setChungLoaiArr,
          { ma_nhom: options.ma_nhom_tbi }
      );
  }, [options.ma_nhom_tbi]);

  //reset phòng ban không chọn đơn vị nhận:
    useEffect(() => {
      if (!options?.ma_dviqly) {
          setDanhMucPhongBan([]);
        return;
      }
      const fetchPhongBanNhan = async () => {
        try {
          const response = await getDM_PHONGBANByMA_DVIQLY(options.ma_dviqly);
          
          setDanhMucPhongBan(response);
        } catch (err) {
          console.log(err);
        }
      };
      fetchPhongBanNhan();
  
    }, [options?.ma_dviqly]);

  const loadData = async (isSearch = false) => {
    setIsLoading(true);
    setSelectedRecords([]);
    if (isSearch) {
      setIsSearching(true);
      setPageIndex(1);
    }
    try {
      const params = {
        ...options,
        pageIndex: isSearch ? 1 : pageIndex,
        pageSize: pageSize,
      };

      const items = await thietBiService.get(params);
      console.log(items?.data);

      setDataTable(items?.data || []);
      setTotalRecords(items?.totalItems);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setDataTable([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageIndex, pageSize]);


  const onClinkSearchBtn = (e) => {
    loadData(true);
  };


  const handleOnClickUpdateBtn = (rowData) => {
    setIsUpdate(true);
    setIsView(false);
    setVisible(true);
    setFormData(rowData);
  };

  const handleOnClickViewBtn = (rowData) => {
    setIsUpdate(false);
    setIsView(true);
    setVisible(true);
    setFormData(rowData);
  }

  const handleCloseModal = () => {
    setFormData(QLTB_DM_THIETBI);
  };

  //InQR:
  const handlePrintQR = async (rowData, type) => {
      
      try {
        const params = {
          ma_tbi_qr: rowData?.qr_code,
          serialnum: rowData?.no_thietbi,
          type: type
        }
        const result = await genQRService.genQR(params);
        if (result?.success) {
          const dataBase64 = result?.qr_code;
          setDataBase64(dataBase64);
          setVisibleDialogQR(true);
        }
      } catch (err) {
        console.log(err);
        showToast("error", "Có lỗi xảy ra!");
      }
    };

  const showToast = (type, message, life = 3000) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
      life: life, 
    });
  };


  const getHeaderTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-start justify-content-between font-bold`;
    return (
      <div className={className}>
        <span className="w-full md:w-auto">{currentMenu}</span>
      </div>
    );
  }
  
  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <Panel 
            headerTemplate={getHeaderTemplate({ className: "p-panel-header panel-padding" })} 
            className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

          <div className="grid">
            {/* Đơn vị quản lý */}
            <DropdownField
              label="Đơn vị quản lý"
              name="ma_dviqly"
              value={options?.ma_dviqly}
              options={donViArr}
              optionLabel="ten"
              optionValue="ma_dviqly"
              onChange={(e) => {
                setOptions({ ...options, dm_phongban_id: "", ma_dviqly: e.value })
              }}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
              disabled={current_MADVIQLY !== MADV_CTY}
            />

            <DropdownField
              label="Phòng ban sử dụng"
              name="dm_phongban_id"
              value={options?.dm_phongban_id}
              options={danhMucPhongBan}
              optionLabel="ten"
              optionValue="id"
              onChange={(e) => setOptions({ ...options, dm_phongban_id: e.value })}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Tên thiết bị */}
            <InputTextField
              label="Tên, serial hoặc mã thiết bị"
              name="search_thietbi"
              type="search"
              value={options.search_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, search_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Trạng thái thiết bị */}
            <DropdownField
              label="Trạng thái"
              name="tbi_trangthai_id"
              value={options.tbi_trangthai_id}
              options={trangThaiThietBiArr}
              optionLabel={(option) => `${option.ten}`}
              optionValue="id"
              onChange={(e) =>
                  setOptions({ ...options, tbi_trangthai_id: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* <InputTextField
              label="Serial thiết bị"
              name="no_thietbi"
              type="search"
              value={options.no_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, no_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            <InputTextField
              label="Mã thiết bị"
              name="ma_thietbi"
              type="search"
              value={options.ma_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, ma_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            /> */}
          </div>

          <div className="grid">

            {/* Nhóm thiết bị */}
            <DropdownField
              label="Nhóm thiết bị"
              name="ma_nhom_tbi"
              value={options.ma_nhom_tbi}
              options={nhomThietBiArr}
              optionLabel={(option) => `${option.ma_nhom} - ${option.ten_nhom}`}
              optionValue="ma_nhom"
              onChange={(e) =>
                  setOptions({ ...options, ma_nhom_tbi: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Chủng loại thiết bị */}
            <DropdownField
              label="Chủng loại thiết bị"
              name="tbi_dm_chungloai_id"
              value={options.tbi_dm_chungloai_id}
              options={chungLoaiArr}
              optionLabel={(option) => `${option.ma_chungloai} - ${option.ten_chungloai}`}
              optionValue="id"
              onChange={(e) =>
                  setOptions({ ...options, tbi_dm_chungloai_id: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            <DropdownField
              label="Hãng sản xuất"
              name="tbi_dm_hangsx_id"
              value={options?.tbi_dm_hangsx_id}
              options={danhMucHangSX}
              optionLabel={(o) => `${o.ma_hang_sx} - ${o.ten_hang_sx}`}
              optionValue="id"
              onChange={(e) => setOptions(prev => ({ ...prev, tbi_dm_hangsx_id: e.value }))}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            <DropdownField
              label="Trạng thái khóa"
              name="trang_thai_khoa"
              value={options?.trang_thai_khoa}
              options={trangThaiKhoaArr}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => setOptions(prev => ({ ...prev, trang_thai_khoa: e.value }))}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Nước sản xuất */}
            {/* <DropdownField
              label="Nước sản xuất"
              name="tbi_nuocsx_id"
              value={options.tbi_nuocsx_id}
              options={nuocSXArr}
              optionLabel={(option) => `${option.ma_nuoc_sx} - ${option.ten_nuoc_sx}`}
              optionValue="id"
              onChange={(e) =>
                  setOptions({ ...options, tbi_nuocsx_id: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            /> */}
          </div>

            <div className="flex justify-content-center mt-4">
              <Button
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                label="Tìm kiếm"
                onClick={onClinkSearchBtn}
                severity="info"
                loading={isSearching}
              />
            </div>
          </Panel>

          <DanhMucThietBiTable
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setIsView={setIsView}
            dataTable={dataTable}
            totalRecords={totalRecords}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            loadData={loadData}
            showToast={showToast}
            isLoading={isLoading}
            handleOnClickUpdateBtn={handleOnClickUpdateBtn}
            handleOnClickViewBtn={handleOnClickViewBtn}
            handleCloseModal={handleCloseModal}
            selectedRecords={selectedRecords}
            setSelectedRecords={setSelectedRecords}
            options={options}
            handlePrintQR={handlePrintQR}
            setIsImportDialogVisible={setIsImportDialogVisible}
          />

          {visible && (
            <DiaglogForm
              formData={formData}
              setFormData={setFormData}
              isUpdate={isUpdate}
              isView={isView}
              visible={visible}
              setVisible={setVisible}
              handleCloseModal={handleCloseModal}
              showToast={showToast}
              loadData={loadData}
              donViArr={donViArr}
              current_MADVIQLY={current_MADVIQLY}
              chungLoaiArr={chungLoaiArr}
              nuocSXArr={nuocSXArr}
              trangThaiThietBiArr={trangThaiThietBiArr}
              handlePrintQR={handlePrintQR}
              visibleDialogQR={visibleDialogQR}
            />
          )}

          {visibleDialogQR && (
            <DiaglogQR
              visible={visibleDialogQR}
              setVisible={setVisibleDialogQR}
              dataBase64={dataBase64}
            />
          )}
          {isImportDialogVisible && (
            <DialogImportExcel
              visible={isImportDialogVisible}
              setVisible={setIsImportDialogVisible}
              showToast={showToast}
              loadData={loadData}
              current_MADVIQLY={current_MADVIQLY}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhMucThietBi;
