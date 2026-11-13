import React, { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import DialogForm from "./DialogForm";
import { getMenuCurrent } from "../../../../utils/Function";
import { pageSizeSelect } from "../../../../constants/propGlobal";
import { QLTB_DM_NHOM } from "../../../../models/quanlythietbi/QLTB_DM_NHOM";
import { nhomThietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import DanhMucNhomTable from "./DanhMucNhomTable";

const DanhMucNhomThietBi = () => {
  const toast = useRef(null);
  const [formData, setFormData] = useState(QLTB_DM_NHOM);
  const [showDialog, setShowDialog] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [data, setData] = useState([]);

  const loadData = useCallback(async (searchData = '') => {
    setIsLoading(true);
    
    try {
      const params = {
        searchData,  
        pageIndex,   
        pageSize,    
      };
      
      const response = await nhomThietBiService.get(params);
      
      setData(response?.data || []);
      setTotalRecords(response?.totalItems || 0);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize]);

  // useEffect(() => {
  //   loadData();
  // }, [loadData]);

  const headerList = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center`;

    return (
      <div className={className}>
        <span className="font-bold text-xl">{getMenuCurrent()}</span>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setFormData(QLTB_DM_NHOM);
              setShowDialog(true);
              setIsAdd(true);
            }}
          />
        </div>
      </div>
    );
  };

  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };

  return (
    <div className="border-round-3xl bg-white p-4">
      <Toast ref={toast} />

      <Panel headerTemplate={headerList}>
        <DanhMucNhomTable
          data={data}
          setFormData={setFormData}
          setShowDialog={setShowDialog}
          setIsAdd={setIsAdd}
          showToast={showToast}
          loadData={loadData}
          totalRecords={totalRecords}
          pageSize={pageSize}
          pageIndex={pageIndex}
          setPageSize={setPageSize}
          setPageIndex={setPageIndex}
          isLoading={isLoading}
        />

        <DialogForm
          loadData={loadData}
          showToast={showToast}
          show={showDialog}
          setShowDialog={setShowDialog}
          isAdd={isAdd}
          formData={formData}
          setFormData={setFormData}
        />
      </Panel>
    </div>
  );
};

export default DanhMucNhomThietBi;
