import React, { useState, useRef, useEffect } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import useReload from "../../../../hooks/useReload";
import Pagination from "../../../../components/Pagination";
import ReloadButton from "../../../../components/ReloadButton";
import { duyetMoKhoaService } from "../../../../services/quanlythietbi/QLTB_DuyetMoKhoaTBService";
import { storageHelper } from "../../../../utils/storageUtils";
import ExportExcelButton from "../../../../components/ExportExcelButton";
import { headerStyleColumn, scrollTableHeight } from "../../../../constants/propGlobal";

const columnMapping = {
    stt: "STT",
    // khoa_tbi: "Trạng thái",
    ma_dviqly: "Mã đơn vị",
    ten_thietbi: "Tên thiết bị",
    ma_thietbi: "Mã thiết bị",
    no_thietbi: "Serial (NO)",
    namsx: "Năm SX",
    tbi_dm_hangsx_ten: "Hãng SX",
    ngay_vanhanh: "Ngày vận hành",
    mk_ngay_tao: "Ngày ĐK",
    mk_nguoi_tao: "Người ĐK",
    mk_ly_do: "Lý do",
    mk_noi_dung: "Nội dung",
    // mk_ngay_mo: "Ngày mở",
    // mk_nguoi_mo: "Người mở",
    // mk_ngay_khoa: "Ngày khóa",
    // mk_nguoi_khoa: "Người khóa",
};


const DanhMucThietBiDKMoKhoaTable = ({
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
  options
}) => {
  const [isShow, setIsShow] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [isMulti, setIsMulti] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const user = storageHelper.get("user");
  const { ho_ten, ten_dang_nhap, dm_donvi_id } = user;

  //Tìm kiếm local tại trang:
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });


  const confirm = async () => {
    try {
      //Nếu duyệt mở khóa nhiều:
      if (isMulti) {
        if (!selectedRecords || selectedRecords.length === 0) {
          showToast("warn", "Chưa chọn thiết bị nào để mở khóa");
          return;
        }

        const ids = [
            ...new Set(
                selectedRecords
                    .filter(r => r.khoa_tbi == 1) // chỉ lấy những được đăng ký
                    .map(({ id }) => id)
            )
        ];

        await duyetMoKhoaService.updatemulti({
          ids,
          nguoi_duyet: ten_dang_nhap
        });
      } else {
        if (!selectedId) {
          showToast("error", "Không tìm thấy bản ghi cần mở khóa");
          return;
        }
        await duyetMoKhoaService.update({id: selectedId, nguoi_duyet: ten_dang_nhap});
      }
      showToast("success", "Mở khóa thành công!");
      loadData();
    } catch (err) {
      let message = "Mở khóa không thành công!";
      const error = err?.response?.data;
      message = (error && typeof error === "string"
      ? error
      : typeof error === "object"
        ? JSON.stringify(error)
        : message);
      showToast("error", message);
    }
    setIsShow(false);
  };

  const cancel = () => {
    setIsShow(false);
  };

  const getDataExportExcel = async () => {
    setIsLoadingExport(true);
    try {
      const params = {
        ...options,
        pageIndex: 1,
        pageSize: -1,
      };

      const response = await duyetMoKhoaService.get(params);
      const dataBC = response?.data|| [];    
      const filteredData = dataBC.map(item => {
        return Object.keys(columnMapping).reduce((acc, key) => {
          if (item.hasOwnProperty(key)) {
            acc[key] = item[key];
          }
          
          return acc;
        }, {});
      });
      return filteredData;

    } catch (error) {
        console.error("Lỗi khi xuất Excel:", error);
    } finally {
        setIsLoadingExport(false);
    }
  }


  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
          <Button 
              icon="pi pi-key"
              label="Duyệt mở khóa" 
              className="p-button-primary dim-on-disable"
              onClick={() => {
                  setIsShow(true);
                  setIsMulti(true);
                } 
              }
              disabled = {selectedRecords.length == 0}
          />
          <ExportExcelButton
            fetchData={getDataExportExcel}
            fileName={`Danh sách thiết bị đăng ký mở khóa`}
            sheetName="Sheet1"
            mapKeys={columnMapping}
            isLoading={isLoadingExport}
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
    
    const khongDuyet = rowData?.khoa_tbi != 1; //Không cho phép duyệt
    const handleClickDuyetBtn = () => {
        setIsMulti(false);
        setSelectedId(rowData?.id);
        setIsShow(true);
    };

    return (
      <div className="text-center">
        <Button
          icon="pi pi-key"
          style={{backgroundColor: headerStyleColumn.backgroundColor}}
          tooltip="Mở khóa"
          disabled={khongDuyet}
          onClick={handleClickDuyetBtn}
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
            style={{minWidth: "10rem"}}
          />
          {/* <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="khoa_tbi"
            header={columnMapping.khoa_tbi}
            body={(rowData) => {
              const trangThaiMoKhoa = rowData?.khoa_tbi;
              const trangThaiDuyet = rowData?.duyet_tbi;
              
              if (trangThaiMoKhoa == "1") {
                return (
                  <i
                    className="pi pi-external-link"
                    style={{ fontSize: "1.5rem", color: "blue" }}
                    title="Đăng ký mở"
                  ></i>
                );
              } else if (trangThaiMoKhoa == "2" || (!trangThaiMoKhoa && trangThaiDuyet == "0")) {
                return (
                  <i
                    className="pi pi-lock-open"
                    style={{ fontSize: "1.5rem", color: "#1445a7" }}
                    title="Đang mở"
                  ></i>
                );
              } else if (trangThaiMoKhoa == "3" || (!trangThaiMoKhoa && trangThaiDuyet == "1")) {
                return (
                  <i
                    className="pi pi-lock"
                    style={{ fontSize: "1.5rem", color: "red" }}
                    title="Đã khóa"
                  ></i>
                );
              }

              return null;
            }}
            style={{minWidth: "3rem"}}
          /> */}
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
            field="namsx"
            header={columnMapping.namsx}
            style={{minWidth: "8rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_dm_hangsx_ten"
            header={columnMapping.tbi_dm_hangsx_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngay_vanhanh"
            header={columnMapping.ngay_vanhanh}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_nguoi_tao"
            header={columnMapping.mk_nguoi_tao}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_ngay_tao"
            header={columnMapping.mk_ngay_tao}
            style={{minWidth: "10rem"}}
          />

          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_ly_do"
            header={columnMapping.mk_ly_do}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_noi_dung"
            header={columnMapping.mk_noi_dung}
            style={{minWidth: "15rem"}}
          />          
          {/* <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_nguoi_mo"
            header={columnMapping.mk_nguoi_mo}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_ngay_mo"
            header={columnMapping.mk_ngay_mo}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_nguoi_khoa"
            header={columnMapping.mk_nguoi_khoa}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_ngay_khoa"
            header={columnMapping.mk_ngay_khoa}
            style={{minWidth: "10rem"}}
          /> */}
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
        visible={isShow}
        onHide={() => setIsShow(false)}
        header="Xác nhận"
        message={() => {
            let message = "Bạn có chắc chắn mở khóa thiết bị này không?"
            if (isMulti) {
              message = `Bạn có chắc chắn mở khóa ${selectedRecords?.length} thiết bị đã chọn không?`
            }
            return message;
          }
        }
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
              severity="primary"
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

export default DanhMucThietBiDKMoKhoaTable;