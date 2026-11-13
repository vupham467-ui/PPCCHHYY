import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import DiaglogForm from "./DiaglogForm";
import DanhMucNuocSXTable from "./DanhMucNuocSXTable";
import { QLTB_DM_NUOCSX } from "../../../../models/quanlythietbi/QLTB_DM_NUOCSX"
import { pageSizeSelect } from "../../../../constants/propGlobal";
import { nuocSxService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";


const DanhMucNuocSX = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);

  const [options, setOptions] = useState({
    ma_nuoc_sx: "",
    ten_nuoc_sx: "",
  });
  const [dataTable, setDataTable] = useState([]);
  const [formData, setFormData] = useState(QLTB_DM_NUOCSX);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const toast = useRef(null);
  
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
        ma_nuoc_sx: options?.ma_nuoc_sx,
        ten_nuoc_sx: options?.ten_nuoc_sx,
      };
      
      const items = await nuocSxService.get(params);
      
      
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
    setFormData(QLTB_DM_NUOCSX);
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
                <label htmlFor="ma_nuoc_sx" className="mb-2 block">
                  Mã nước SX
                </label>
                <InputText className="w-full" value={options.ma_nuoc_sx} 
                  onChange={(e) => setOptions({ ...options, ma_nuoc_sx: e.target.value })} 
                  placeholder='Nhập mã nước SX' type='search' 
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="ten_nuoc_sx" className="mb-2 block">
                  Tên nước SX
                </label>
                <InputText className="w-full" value={options.ten_nuoc_sx} 
                  onChange={(e) => setOptions({ ...options, ten_nuoc_sx: e.target.value })} 
                  placeholder='Nhập tên nước SX' type='search' 
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

          <DanhMucNuocSXTable
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhMucNuocSX;
