import { FilterMatchMode, PrimeIcons } from "primereact/api";
import React, { useState } from "react";
import { delete_HT_NHOMQUYEN } from "../../../services/quantrihethong/HT_NHOMQUYENService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";

import { propSortAndFilter, rowsPerPages, scrollTableHeight } from "../../../constants/propGlobal";
import useReload from "../../../hooks/useReload";
import ReloadButton from "../../../components/ReloadButton";
import { ProgressSpinner } from "primereact/progressspinner";
import Pagination from "../../../components/Pagination";

const TableVaiTro = ({
  setVisible,
  setIsUpdate,
  setVaiTro,
  data,
  setMenuDialogVisible,
  totalRecords,
  setPage,
  setPageSize,
  page,
  pageSize,
  loadData,
  isLoading,
  loadDataMenu,
  toast,
  setSelectedVaiTro,
}) => {
  const [isHide, setIsHide] = useState(false);
  const [id, setId] = useState();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_nhom: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ten_dviqly: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const confirmDelete = async () => {
    setIsHide(false);
    try {
      const res = await delete_HT_NHOMQUYEN(id);
      const isSuccess = res.status == 200;
      const severity = isSuccess ? "success" : "error";
      const detailsMessage = isSuccess ? "Xóa vai trò thành công" : "Đã xảy ra lỗi!";
      toast.current.show({
        severity: severity,
        summary: "Thông báo",
        detail: detailsMessage,
        life: 3000,
      });
      loadData();
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Xóa vai trò không thành công",
        life: 3000,
      });
    }
  };

  const confirmDeleteSelected = async () => {
    setIsHide(false);
    try {
      const res = await Promise.all(selectedRows.map(row => delete_HT_NHOMQUYEN(row.id)));
      const isSuccess = res.every(res => res.status == 200);
      const severity = isSuccess ? "success" : "error";
      const errors = res.filter(item => item.status !== 200).map(item => item.role).join(", ");
      const detailsMessage = isSuccess ? "Xóa các vai trò đã chọn thành công" : `Các vai trò xóa không thành công: ${errors}`;
      
      toast.current.show({
        severity: severity,
        summary: 'Thành công',
        detail: detailsMessage,
        life: 3000
      });
      if (!isSuccess) return;
      setSelectedRows([]);
      loadData();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xóa các vai trò đã chọn',
        life: 3000
      });
    }
  };

  const cancel = () => {
    setIsHide(false);
  };

  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`
    return (
      <div className={className} >
        <span className='text-xl font-bold'>Danh sách</span>
        <div className="flex align-items-center gap-2">
          {selectedRows.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              onClick={() => {
                setIsHide(true);
              }}
            />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setVaiTro(HT_NHOMQUYEN)
              setVisible(true);
              setIsUpdate(false);
            }}
          />
        </div>
      </div>
    )
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onReload = () => {
    loadData();
  };

  const { isReloading, reload } = useReload(onReload);

  return (
    <div >
      <Panel headerTemplate={headerTemplate} className="mt-4">
        <div className="flex flex-column md:flex-row justify-content-between align-items-center mb-1">
        <ReloadButton onReload={reload} isLoading={isReloading} />
          <span className="p-input-icon-left w-full md:w-3">
            <i className="pi pi-search" />
            <InputText
              className="w-full"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Tìm kiếm"
            />
          </span>
        </div>
        <div className="flex flex-column">
          <DataTable
            value={data}
            scrollable
            scrollHeight={scrollTableHeight}
            selection={selectedRows}
            onSelectionChange={e => setSelectedRows(e.value)}
            filters={filters}
            onFilter={(e) => setFilters(e.filters)}
            rows={pageSize}
            // rowkey="id"
            loadingIcon={
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
            }
            loading={isLoading}
            className={`datatable-responsive mt-3 ${isReloading ? "reloading" : ""}`}
            showGridlines
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            responsiveLayout="scroll"
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                width: '3rem'
              }}
            />

            <Column
              {...propSortAndFilter}
              field="ten"
              header="Đơn vị quản lý"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                minWidth: '150px'
              }}

            />
            
            <Column
              {...propSortAndFilter}
              field="ten_nhom"
              header="Tên vai trò"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                minWidth: '150px'
              }}
            />
            <Column
              field="vai_tro_name"
              header="Ghi chú"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                minWidth: '150px'
              }}
            />

            <Column
              header="Thao tác"
              headerStyle={{
                backgroundColor: "#1445a7",
                color: "#fff",
                width: "6rem",
              }}
              body={(rowData) => (
                <div className="flex justify-content-between gap-3">
                  <Button
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "#1445a7" }}
                    onClick={() => {
                      setVaiTro(rowData);
                      setVisible(true);
                      setIsUpdate(true);
                      // console.log(rowData);
                    }}
                  />
                  <Button
                    icon="pi pi-trash"
                    tooltip="Xóa"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "#1445a7" }}
                    onClick={() => {
                      setIsHide(true);
                      setId(rowData.id);
                    }}
                  />

                  <Button
                    icon="pi pi-file-edit"
                    tooltip="Gán menu"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "#1445a7" }}
                    onClick={() => {
                      setMenuDialogVisible(true);
                      setSelectedVaiTro(rowData);
                    }}
                  />
                </div>
              )}
            />
          </DataTable>

          {/* <div className="flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
            <div className="flex align-items-center">
              <Button
                outlined
                text
                icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                severity="secondary"
              />
              <p className="mx-4 mb-0">
                Trang {page} trong tổng số {pageCount} trang
              </p>
              <Button
                outlined
                text
                severity="secondary"
                icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                disabled={page === pageCount}
              />
            </div>
            <Dropdown
              className="w-full md:w-auto"
              value={pageSize}
              options={rowsPerPages}
              onChange={(e) => {
                setPageSize(e.value);
                setPage(1);
              }}
              placeholder="Select rows per page"
            />
          </div> */}
            {totalRecords > 0 &&
                <Pagination
                    pageIndex={page}
                    setPageIndex={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    totalRecords={totalRecords}
                />
            }  
        </div>
      </Panel>

      <Toast ref={toast} />
      <ConfirmDialog
        visible={isHide}
        onHide={() => setIsHide(false)}
        header="Xác nhận"
        message={selectedRows.length > 0 ? "Bạn có chắc chắn xóa các bản ghi đã chọn không?" : "Bạn có chắc chắn xóa bản ghi này không?"}
        icon="pi pi-info-circle"
        footer={
          <div>
            <Button
              severity="secondary"
              outlined
              label="Hủy"
              icon="pi pi-times"
              onClick={cancel}
            />
            <Button
              severity="danger"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={selectedRows.length > 0 ? confirmDeleteSelected : confirmDelete}
              autoFocus
            />
          </div>
        }
      />
    </div>
  );
};

export default TableVaiTro;
