import React, { useState, useRef, useEffect } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import useReload from "../../../../hooks/useReload";
import Pagination from "../../../../components/Pagination";
import ReloadButton from "../../../../components/ReloadButton";
import LabelStatus from "../../../../components/LabelStatus";
import { headerStyleColumn, scrollTableHeight } from "../../../../constants/propGlobal";
import { storageHelper } from "../../../../utils/storageUtils";
import ConfirmDialogCommon from "../../../../components/ConfirmDialogCommon";
import { thietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";

const columnMapping = {
    stt: "STT",
    ma_dviqly: "Mã ĐVQL",
    ten_thietbi: "Tên thiết bị",
    ma_thietbi: "Mã thiết bị",
    no_thietbi: "Serial",
    tbi_trangthai_ten: "Trạng thái",
    ket_qua: "Kết quả",
    ten_kho: "Kho",
    donvi_kiemtra: "Đơn vị KT",
    nguoi_kiemtra: "Người KT",
    ngay_kiemtra: "Ngày KT",
    ghi_chu: "Ghi chú",
};


const KiemTraThietBiTable = ({
  dataTable,
  totalRecords,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  loadData,
  showToast,
  isLoading,
  selectedRecords,
  setSelectedRecords,
  selectedId,
  setSelectedId,
  isMulti,
  setIsMulti,
  setIsShowDialog,
  setIsShowHis
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isShow, setIsShow] = useState(false); //hiện dialog xóa
  const user = storageHelper.get("user");

  //Tìm kiếm local tại trang:
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
            <Button 
                label="Kiểm tra thiết bị" 
                icon="pi pi-plus-circle"
                className="dim-on-disable"
                style={{backgroundColor: headerStyleColumn.backgroundColor}}
                onClick={() => {
                    const invalidDevices = selectedRecords
                      .filter((item) => item?.co_the_kiemtra != "Y")
                      .map((item) => item?.no_thietbi || item?.ma_thietbi); 

                    if (invalidDevices.length > 0) {
                      showToast(
                        "warn",
                        `${invalidDevices.length} thiết bị không hợp lệ (đang sử dụng, đã thanh lý hoặc đang bàn giao) không thể kiểm tra: ${invalidDevices.join("; ")}`
                      );
                      return;
                    }
                    setIsShowDialog(true);
                    setIsMulti(true);
                  } 
                }
                disabled = {selectedRecords.length == 0}
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
  

  const handleDelete = async () => {
    try {

      await thietBiService.delete(selectedId);
      showToast("success", "Xóa thành công!");
      loadData();
    } catch (err) {
      console.log(err);
      
      const message = err?.message || "Có lỗi xảy ra!";
      showToast("error", message);
    }
  }

  const cancel = () => {
    setIsShow(false);
  };

  const getBtnGroup = (rowData) => {
    
    const handleClickKiemTraBtn = () => {
      setSelectedId(rowData?.tbi_id);
      setIsMulti(false);
      setIsShowDialog(true);
    };

    const handleClickLichSuBtn = () => {
      setSelectedId(rowData?.tbi_id);
      setIsShowHis(true);
    };

    const handleClickDeleteBtn = () => {
      setIsShow(true);
      setSelectedId(rowData?.tbi_id);
    }

    //Không cho kiểm tra nếu thiết bị không thuộc kho CNTT, ở trạng thái đang sử dụng, đã thanh lý hoặc đang bàn giao:
    const disableCheck = rowData?.co_the_kiemtra != "Y";
    
    //Hiển thị nút xóa khi là admin, kết quả kiểm tra không đạt và chưa bàn giao lần nào:
    const canDelete = user.is_admin == "Y" && rowData?.can_xu_ly == "Y";
    
    return (
      <div className="flex gap-2">
        <Button
          className="dim-on-disable"
          icon="pi pi-search-plus"
          tooltip="Kiểm tra"
          onClick={handleClickKiemTraBtn}
          style={{transform:"scale(0.9)", backgroundColor: headerStyleColumn.backgroundColor}}
          disabled={disableCheck}
        />
        <Button
          className="dim-on-disable"
          icon="pi pi-history"
          tooltip="Lịch sử kiểm tra"
          onClick={handleClickLichSuBtn}
          style={{transform:"scale(0.9)", backgroundColor:"#fff", color: headerStyleColumn.backgroundColor}}
        />
        {canDelete && 
          <Button
            className="dim-on-disable"
            icon="pi pi-trash"
            severity="danger"
            tooltip="Xóa thiết bị"
            onClick={handleClickDeleteBtn}
            style={{transform:"scale(0.9)"}}
          />
        }
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
          className={`mt-3 ${isReloading ? "reloading" : ""}`}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          selection={selectedRecords}
          onSelectionChange={(e) => setSelectedRecords(e.value)}
          responsiveLayout="scroll"
        >
          <Column 
            headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} 
            selectionMode="multiple"
          />

          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            header={columnMapping.stt}
            body={(_, options) => (pageIndex - 1) * pageSize + options.rowIndex + 1}
            style={{minWidth: "3rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={ getBtnGroup}
            header="Thao tác"
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ma_dviqly"
            header={columnMapping.ma_dviqly}
            style={{minWidth: "8rem"}}
          />

          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_thietbi"
            header={columnMapping.ten_thietbi}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ma_thietbi"
            header={columnMapping.ma_thietbi}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="no_thietbi"
            header={columnMapping.no_thietbi}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_trangthai_ten"
            header={columnMapping.tbi_trangthai_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ket_qua"
            header={columnMapping.ket_qua}
            body={(rowData) => {
              const ketQua = rowData?.ket_qua || "";
              const trang_thai = ketQua == "Y" ? 1 : ((ketQua == "N") ? 2 : 0);
              const label = ketQua == "Y" ? "Đạt" : ((ketQua == "N") ? "Không đạt" : "Chưa kiểm tra");

              return (
                <LabelStatus trang_thai={trang_thai} label={label}/>
              );
            }}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_kho"
            header={columnMapping.ten_kho}
            style={{minWidth: "18rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="donvi_kiemtra"
            header={columnMapping.donvi_kiemtra}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoi_kiemtra"
            header={columnMapping.nguoi_kiemtra}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngay_kiemtra"
            header={columnMapping.ngay_kiemtra}
            style={{minWidth: "10rem"}}
          />

          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ghi_chu"
            header={columnMapping.ghi_chu}
            style={{minWidth: "15rem"}}
          />
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

      <ConfirmDialogCommon
        visible={isShow}
        setVisible={setIsShow}
        header="Xóa dữ liệu"
        message="Bạn có chắc chắn xóa bản ghi này không?"
        multiInfo={{
          isMulti: false,
          count: 0
        }}
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={cancel}
      />
    </>
  );
};

export default KiemTraThietBiTable;