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
import { dangKyMoKhoaTBService } from "../../../../services/quanlythietbi/QLTB_DangKyMoKhoaTBService";
import { scrollTableHeight } from "../../../../constants/propGlobal";

const columnMapping = {
    stt: "STT",
    // khoa_tbi: "TT",
    mk_trang_thai: "Trạng thái ĐK",
    ten_thietbi: "Tên thiết bị",
    ma_thietbi: "Mã thiết bị",
    no_thietbi: "Serial",
    ma_dviqly: "Mã ĐV",
    tbi_trangthai_ten: "TT thiết bị",
    mk_nguoi_tao: "Ngày ĐK",
    mk_ngay_tao: "Người ĐK",
    mk_ly_do: "Lý do",
    mk_noi_dung: "Nội dung",
    mk_nguoi_mo: "Người mở",
    mk_ngay_mo: "Ngày mở",
    mk_nguoi_khoa: "Người khóa",
    mk_ngay_khoa: "Ngày khóa",
};


const DangKyMoKhoaTBTable = ({
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
  setIsShowDialog
}) => {
  const [isShow, setIsShow] = useState(false); //Hiện hộp thoại xác nhận hủy
  const [globalFilterValue, setGlobalFilterValue] = useState("");


  //Tìm kiếm local tại trang:
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });


  const confirm = async () => {
    try {
      //Nếu hủy nhiều:
      if (isMulti) {
        if (!selectedRecords || selectedRecords.length === 0) {
          showToast("warn", "Chưa chọn thiết bị nào hủy đăng ký");
          return;
        }

        const ids = [
            ...new Set(
                selectedRecords
                    .filter(r => r.mk_trang_thai == 1) // chỉ lấy những thiết bị đã đăng ký vào danh sách hủy
                    .map(({ id }) => id)
            )
        ];

        const res = await dangKyMoKhoaTBService.deletemulti(ids);
        const successMessage =  typeof res == "string" ? res : "Hủy đăng ký thành công!";
        showToast("success", successMessage);
      } else {
        if (!selectedId) {
          showToast("error", "Không tìm thấy bản ghi cần hủy đăng ký");
          return;
        }
        
        const res = await dangKyMoKhoaTBService.delete(selectedId);
        const successMessage =  typeof res == "string" ? res : "Hủy đăng ký thành công!";
        showToast("success", successMessage);
      }
      
      loadData();
    } catch (err) {
      let message = "Hủy đăng ký không thành công!";
      const error = err?.response?.data;
      console.log(err);
      
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


  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
          <Button 
              label="Đăng ký mở khóa" 
              icon="pi pi-plus-circle"
              className="p-button-primary dim-on-disable"
              onClick={() => {
                  // Lọc ra danh sách thiết bị không ở trạng thái 0 - chưa đăng ký và không ở trạng thái 3 - đang khóa
                  const invalidRecords = selectedRecords.filter(r => (r.mk_trang_thai != "0" && r.mk_trang_thai != "3"));
                  
                  // Nếu có thiết bị không hợp lệ thì cảnh báo
                  if (invalidRecords.length > 0) {
                      const invalidList = invalidRecords
                          .map(r => r.no_thietbi || r.ten_thietbi || r.id) // ưu tiên no_thietbi, fallback sang tên hoặc id
                          .join(", ");

                      showToast(
                          "warn",
                          `Danh sách lựa chọn có ${invalidRecords.length} thiết bị không ở trạng thái "Chưa đăng ký" hoặc "Đang khóa": ${invalidList}`
                      );
                      return;
                  }
                  setIsShowDialog(true);
                  setIsMulti(true);
                } 
              }
              disabled = {selectedRecords.length == 0}
          />
          <Button 
              label="Hủy đăng ký" 
              icon="pi pi-trash"
              className="p-button-danger dim-on-disable"
              onClick={() => {
                  // Lọc ra danh sách thiết bị không ở trạng thái 1 - đã đăng ký
                  const invalidRecords = selectedRecords.filter(r => r.mk_trang_thai != 1);

                  // Nếu có thiết bị không hợp lệ thì cảnh báo
                  if (invalidRecords.length > 0) {
                      const invalidList = invalidRecords
                          .map(r => r.no_thietbi || r.ten_thietbi || r.id) // ưu tiên no_thietbi, fallback sang tên hoặc id
                          .join(", ");

                      showToast(
                          "warn",
                          `Danh sách lựa chọn có ${invalidRecords.length} thiết bị không ở trạng thái "Đã đăng ký": ${invalidList}`
                      );
                      return;
                  }
                  setIsShow(true);
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

  const getBtnGroup = (rowData) => {
    
    //Nếu đã đăng ký hoặc đã duyệt mở khóa thì ẩn nút đăng ký:
    const lockDK = rowData?.mk_trang_thai == "1" || rowData?.mk_trang_thai == "2";
    //Nếu đã đăng ký thì có thể hủy:
    const canDestroy = rowData?.mk_trang_thai == "1";

    const handleClickDKMoKhoaBtn = () => {
      setSelectedId(rowData?.id);
      setIsMulti(false);
      setIsShowDialog(true);
    };

    const handleClickHuyDKBtn = () => {
      setSelectedId(rowData?.id);
      setIsMulti(false);
      setIsShow(true);
    };


    return (
      <div className="flex gap-2">
        <Button
          className="dim-on-disable"
          icon="pi pi-send"
          tooltip="ĐK mở khóa"
          disabled={lockDK}
          onClick={handleClickDKMoKhoaBtn}
          style={{transform:"scale(0.9)", backgroundColor: "#1445a7"}}
        />
        <Button
          className="dim-on-disable"
          severity="danger"
          icon="pi pi-trash"
          tooltip="Hủy đăng ký"
          disabled={!canDestroy}
          onClick={handleClickHuyDKBtn}
          style={{transform:"scale(0.9)"}}
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
                    style={{ fontSize: "1.5rem", color: "green" }}
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
            body={ getBtnGroup}
            header="Thao tác"
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_trang_thai"
            header={columnMapping.mk_trang_thai}
            body={(rowData) => {
              const trangThaiMoKhoa = rowData?.mk_trang_thai || "";
              const tenTrangThaiMoKhoa = rowData?.mk_trang_thai_ten || "";

              let icon = "", color = "";
              if (trangThaiMoKhoa == "1") {
                icon = "pi pi-external-link";
                color = "blue";
              } else if (trangThaiMoKhoa == "2") {
                icon = "pi pi-check-square";
                color = "green";
              } else if (trangThaiMoKhoa == "3") {
                icon = "pi pi-lock";
                color = "red";
              } else {
                icon = "pi pi-expand";
                color = "black";
              }

              return (
                <div className="flex align-items-center gap-2" style={{color}}>
                  <i className={icon} style={{ fontSize: "1.2rem" }}></i>
                  <span>{tenTrangThaiMoKhoa}</span>
                </div>
              );
            }}
            style={{ minWidth: "15rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ma_dviqly"
            header={columnMapping.ma_dviqly}
            style={{minWidth: "10rem"}}
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

          {/* <Column
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
            field="ngay_van_hanh"
            header={columnMapping?.ngay_van_hanh}
            style={{minWidth: "10rem"}}
          /> */}
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="mk_ngay_tao"
            header={columnMapping.mk_ngay_tao}
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
          <Column
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

      <ConfirmDialog
        visible={isShow}
        onHide={() => setIsShow(false)}
        header="Xác nhận"
        message={() => {
            let message = "Bạn có chắc chắn hủy đăng ký mở khóa thiết bị này không?"
            if (isMulti) {
              message = `Bạn có chắc chắn hủy đăng ký mở khóa ${selectedRecords?.length} thiết bị đã chọn không?`
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

export default DangKyMoKhoaTBTable;