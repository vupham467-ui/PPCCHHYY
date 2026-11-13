import React, { useState, useRef, useEffect } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import useReload from "../../../../hooks/useReload";
import Pagination from "../../../../components/Pagination";
import ReloadButton from "../../../../components/ReloadButton";
import { khoTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { scrollTableHeight } from "../../../../constants/propGlobal";

const DanhMucKhoTable = ({
  setVisible,
  setIsUpdate,
  dataTable,
  totalRecords,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  loadData,
  showToast,
  isLoading,
  handleOnClickUpdateBtn,
  handleCloseModal,
  selectedRecords,
  setSelectedRecords,
}) => {
  const [isHide, setIsHide] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");




  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_kho: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_kho: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });


  const confirm = async () => {
    setIsHide(false);
    try {
      const id = selectedRecords?.id;
      if (!id) showToast("error", "Không tìm thấy bản ghi cần xóa");
      await khoTBService.delete(id);
      showToast("success", "Xóa bản ghi thành công!");
      loadData();

    } catch (err) {
      showToast("error", "Xóa bản ghi không thành công!");
    }
  };

  const cancel = () => {
    setIsHide(false);
  };




  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">

          <Button
          label="Thêm mới"
          style={{ backgroundColor: "#1445a7" }}
          onClick={() => {
            setVisible(true);
            setIsUpdate(false);
          }}
          />
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };


  const { isReloading, reload } = useReload(loadData);

  const getBtnGroup = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          tooltip="Sửa"
          onClick={() => {
            handleOnClickUpdateBtn(rowData)
          }}
          style={{ backgroundColor: "#1445a7", color: "#fff", border:"none" }}
        />
        <Button
          icon="pi pi-trash"
          tooltip="Xóa"
          onClick={() => {
            setIsHide(true);
            setSelectedRecords(rowData);
          }}
          style={{backgroundColor: "#dc3545", color: "#fff", border:"none" }}
        />
      </div>
      
    );
  }

  return (
    <>
      <Panel headerTemplate={headerTemplate({className: "p-panel-header panel-padding"})}>
        <div className="flex justify-content-between mb-3 gap-2">
          <ReloadButton onReload={reload} isLoading={isReloading} />
          <span className="p-input-icon-left w-full md:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Tìm kiếm"
              className="w-full md:w-auto"
            />
          </span>
        </div>

        <DataTable
          value={dataTable}
          scrollable
          scrollHeight={scrollTableHeight}
          showGridlines
          stripedRows
          loadingIcon={
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
          }
          loading={isLoading}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          rows={pageSize}
          className={`datatable-responsive mt-3 ${isReloading ? "reloading" : ""}`}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          selection={selectedRecords}
          onSelectionChange={(e) => setSelectedRecords(e.value)}
          responsiveLayout="scroll"
        >
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            header="STT"
            body={(_, options) => (pageIndex - 1) * pageSize + options.rowIndex + 1}
            style={{ width: "3%", minWidth: "3rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_don_vi"
            header="Đơn vị quản lý"
            style={{ width: "27%", minWidth: "20rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ma_kho"
            header="Mã kho"
            style={{ width: "10%", minWidth: "10rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_kho"
            header="Tên kho"
            style={{ width: "50%", minWidth: "25rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={ getBtnGroup}
            header="Thao tác"
            style={{ width: "10%", minWidth: "10rem" }}
          ></Column>
        </DataTable>

        {totalRecords > 0 &&
          <Pagination
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalRecords={totalRecords}
          />
        }  
      </Panel>

      <ConfirmDialog
        visible={isHide}
        onHide={() => setIsHide(false)}
        header="Xác nhận"
        message={"Bạn có chắc chắn xóa bản ghi này không?"}
        icon="pi pi-info-circle"
        footer={
          <div className="flex justify-content-center gap-3">
            <Button
              severity="secondary"
              label="Hủy"
              icon="pi pi-times"
              onClick={cancel}
            />

            <Button
              severity="danger"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={confirm}
            />
          </div>
        }
      >
      </ConfirmDialog>
    </>
  );
};

export default DanhMucKhoTable;