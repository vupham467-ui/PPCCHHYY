import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import DiaglogForm from "./DiaglogForm";
import { pageSizeSelect } from "../../../../constants/propGlobal";
import { QLTB_DM_CHUNGLOAI } from "../../../../models/quanlythietbi/QLTB_DM_CHUNGLOAI";
import { chungloaiTBService, nhomThietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import DanhMucChungLoaiTable from "./DanhMucChungLoaiTable";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";

const DanhMucChungLoai = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);

  const [options, setOptions] = useState({
    ma_nhom: "",
    ma_chungloai: "",
    ten_chungloai: "",
    can_chon_nsd: "",
    co_thongtin_ct: "" //Tất cả
  });
  const [dataTable, setDataTable] = useState([]);
  const [formData, setFormData] = useState(QLTB_DM_CHUNGLOAI);
  const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const toast = useRef(null);

  useEffect(() => {
        const getNhomThietBiArr = async () => {
          try {
            const params = {
              searchData: "",  
              pageIndex: 1,   
              pageSize: -1,    //Để lấy tất cả
            };
        
          const response = await nhomThietBiService.get(params);
          setNhomThietBiArr(response?.data);

          } catch (err) {
            console.log(err);
          } 
        }
        getNhomThietBiArr();
      },[]);
  
  
  const loadData = async (isSearch = false) => {
    setIsLoading(true);
    if (isSearch) {
      setIsSearching(true);
      setPageIndex(1);
    }
    try {
      const params = {
        pageIndex: isSearch ? 1 : pageIndex,
        pageSize: pageSize,
        ma_nhom: options?.ma_nhom,
        ma_chungloai: options?.ma_chungloai,
        ten_chungloai: options?.ten_chungloai,
        can_chon_nsd: options?.can_chon_nsd,
        co_thongtin_ct: options?.co_thongtin_ct
      };
      
      const items = await chungloaiTBService.get(params);

      setDataTable(items?.data || []);
      setTotalRecords(items?.totalItems);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setDataTable([]);
      setTotalRecords(0);
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
    setVisible(true);
    setFormData(rowData);
  };

  const handleCloseModal = () => {
    setFormData(QLTB_DM_CHUNGLOAI);
  };

  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
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
              <DropdownField
                label="Nhóm thiết bị"
                name="ma_nhom"
                value={options?.ma_nhom}
                options={nhomThietBiArr}
                optionLabel="ten_nhom"
                optionValue="ma_nhom"
                onChange={(e) => setOptions(prev => ({ ...prev, ma_nhom: e.value }))}
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName= "mb-2 block"
              />
              {/* <InputTextField
                label="Mã chủng loại"
                name="ma_chungloai"
                value={options?.ma_chungloai || ""}
                onChange={(e) => setOptions({ ...options, ma_chungloai: e.target.value })} 
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName= "mb-2 block"
              /> */}

              <InputTextField
                label="Tên chủng loại"
                name="ten_chungloai"
                value={options?.ten_chungloai || ""}
                onChange={(e) => setOptions({ ...options, ten_chungloai: e.target.value })} 
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName= "mb-2 block"
              />
              <DropdownField
                label="Gắn với người sử dụng"
                placeholder="-- Vui lòng chọn --"
                name="can_chon_nsd"
                value={options?.can_chon_nsd}
                options={
                  [
                    {label: "Có", value: "Y"},
                    {label: "Không", value: "N"},
                  ]
                }
                optionLabel="label"
                optionValue="value"
                onChange={(e) => setOptions(prev => ({ ...prev, can_chon_nsd: e.value }))}
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName= "mb-2 block"
              />
              <DropdownField
                label="Thông tin chi tiết"
                placeholder="-- Vui lòng chọn --"
                name="co_thongtin_ct"
                value={options?.co_thongtin_ct}
                options={
                  [
                    {label: "Có", value: "Y"},
                    {label: "Không", value: "N"},
                  ]
                }
                optionLabel="label"
                optionValue="value"
                onChange={(e) => setOptions(prev => ({ ...prev, co_thongtin_ct: e.value }))}
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName= "mb-2 block"
              />
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

          <DanhMucChungLoaiTable
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
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
            handleCloseModal={handleCloseModal}
            selectedRecords={selectedRecords}
            setSelectedRecords={setSelectedRecords}

          />

          {visible && (
            <DiaglogForm
              formData={formData}
              setFormData={setFormData}
              isUpdate={isUpdate}
              visible={visible}
              setVisible={setVisible}
              handleCloseModal={handleCloseModal}
              showToast={showToast}
              loadData={loadData}
              nhomThietBiArr={nhomThietBiArr}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhMucChungLoai;
