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
import { QLTB_DM_KHO } from "../../../../models/quanlythietbi/QLTB_DM_KHO";
import { khoTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import DanhMucKhoTable from "./DanhMucKhoTable";
import { storageHelper } from "../../../../utils/storageUtils";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";


const DanhMucKho = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
  const [options, setOptions] = useState({
    ma_dviqly: current_MADVIQLY  == MADV_CTY ? "" : current_MADVIQLY,
    ma_kho: "",
    ten_kho: "",
  });
  const [dataTable, setDataTable] = useState([]);
  const [formData, setFormData] = useState(QLTB_DM_KHO);
  const [donViArr, setDonViArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const toast = useRef(null);

  //Lấy danh sách đơn vị gốc:
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
        ma_dviqly: options?.ma_dviqly,
        ma_kho: options?.ma_kho,
        ten_kho: options?.ten_kho,
      };
      
      const items = await khoTBService.get(params);
      
      
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
    setVisible(true);
    setFormData(rowData);
  };

  const handleCloseModal = () => {
    setFormData(QLTB_DM_KHO);
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

            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="ma_dviqly" className="mb-2 block">
                  Đơn vị quản lý
                </label>

                <Dropdown
                  id="ma_dviqly"
                  className="w-full"
                  placeholder="Chọn đơn vị quản lý"
                  value={options.ma_dviqly}
                  optionLabel="ten"
                  optionValue="ma_dviqly"
                  disabled={current_MADVIQLY !== MADV_CTY}
                  filter
                  options={donViArr}
                  onChange={(e) =>
                    setOptions({ ...options, ma_dviqly: e.value })
                  }
                  showClear
                />
              </div>
              <div className="flex-auto">
                <label htmlFor="ma_kho" className="mb-2 block">
                  Mã kho
                </label>
                <InputText className="w-full" value={options.ma_kho} 
                  onChange={(e) => setOptions({ ...options, ma_kho: e.target.value })} 
                  placeholder='Nhập mã kho' type='search' 
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="ten_kho" className="mb-2 block">
                  Tên kho
                </label>
                <InputText className="w-full" value={options.ten_kho} 
                  onChange={(e) => setOptions({ ...options, ten_kho: e.target.value })} 
                  placeholder='Nhập tên kho' type='search' 
                />
              </div>
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

          <DanhMucKhoTable
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
              donViArr={donViArr}
              current_MADVIQLY={current_MADVIQLY}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhMucKho;
