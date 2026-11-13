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
import { storageHelper } from "../../../../utils/storageUtils";
import { headerStyleColumn, scrollTableHeight, trangThaiDongBoArr } from "../../../../constants/propGlobal";
import { ConfirmDialog } from "primereact/confirmdialog";
import { dongBoDuLieuService } from "../../../../services/quanlythietbi/QLTB_Dongbodulieu";

const columnMapping = {
    stt: "STT",
    dm_donvi_ten: "Đơn vị",
    ten_thietbi: "Tên thiết bị",
    ma_thietbi: "Mã thiết bị",
    no_thietbi: "Serial",
    tbi_dm_chungloai_ten: "Chủng loại",
    duyet_tbi: "Trạng thái duyệt",
    tbi_trangthai_ten: "Trạng thái SD",
    tbi_kho_ten: "Kho",
    dm_phongban_ten_old: "Phòng ban SD cũ",
    dm_phongban_ten: "Phòng ban SD mới",
    nguoi_sd_old: "Người SD cũ",
    nguoi_sd: "Người SD mới",
    thong_tin_khac: "Thông tin khác",
    thongtin_chitiet_json: "Thông tin chi tiết",
    sync_status: "TT đồng bộ",
    updated_by: "Người cập nhật",
    updated_date: "Ngày cập nhật",
    sync_by: "Người đồng bộ",
    sync_date: "Ngày đồng bộ",
    sync_error: "Lỗi đồng bộ",
    
};

const DanhMucThietBiCuTable = ({
  setVisible,
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
  selectedRecords,
  setSelectedRecords,
  options,
  showBtnUpdateDoXa,
  setShowUpdateDoXaDialog,
  showBtnRollBack,
  setShowRollBackDoXaDialog,
}) => {
  const [isShow, setIsShow] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [areInSync, setAreInSync] = useState(false);
  const [isMultiSync, setIsMultiSync] = useState(false);


  const user = storageHelper.get("user");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    no_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  

  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    const dsQuyen = user?.ds_quyen || "";
    const dsQuyenArr = dsQuyen.split(',');
    const checkQuyenRollBack = ['ADMIN', 'QLTB_QLP10'];
    const hasQuyenRollBack = dsQuyenArr.some(q => checkQuyenRollBack.includes(q));
    
    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
            {hasQuyenRollBack && showBtnRollBack && <Button 
                  label="Rollback cập nhật TB đo xa" 
                  icon="pi pi-replay"
                  className="dim-on-disable"
                  style={{backgroundColor: headerStyleColumn.backgroundColor}}
                  onClick={() => {
                      setShowRollBackDoXaDialog(true);
                    } 
                  }
                  disabled={totalRecords== 0}
              />
            }
            {showBtnUpdateDoXa && <Button 
                label="Cập nhật thiết bị đo xa" 
                icon="pi pi-plus-circle"
                className="dim-on-disable"
                style={{backgroundColor: headerStyleColumn.backgroundColor}}
                onClick={() => {
                    setShowUpdateDoXaDialog(true);
                  } 
                }
                disabled = {totalRecords == 0}
            />
            }
            
            <Button 
                label="Đồng bộ dữ liệu" 
                icon="pi pi-plus-circle"
                className="dim-on-disable"
                style={{backgroundColor: headerStyleColumn.backgroundColor}}
                onClick={() => {
                    setIsShow(true);
                    setIsMultiSync(true);
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

  const handleOnClickSyncBtn = (rowData) => {
    if(!rowData?.id) {
      showToast("error", "Không tìm thấy thiết bị!");
      return;
    }
    setSelectedId(rowData.id);
    setIsShow(true);
  }

  const confirm = async () => {
    setAreInSync(true);
    try {    
      let message = "Đồng bộ thành công!"; 
      if (isMultiSync) {
        if (!selectedRecords || selectedRecords.length === 0) {
          showToast("warn", "Chưa chọn thiết bị nào để đồng bộ");
          return;
        }

        const ids = [
            ...new Set(
                selectedRecords
                    .filter(r => r.sync_status == 1) // chỉ lấy những thiết bị đã cập nhật dữ liệu
                    .map(({ id }) => id)
            )
        ];
        const payload = {
          list_id: ids,
          sync_by: user.ten_dang_nhap
        }
        
        const result = await dongBoDuLieuService.sync_multi(payload);
        message = result;

      } else {
        if (!selectedId) {
          showToast("error", "Không tìm thấy bản ghi cần đồng bộ");
          return;
        }
        const payload = {
          stg_id: selectedId,
          sync_by: user.ten_dang_nhap
        }
        await dongBoDuLieuService.sync(payload);
      }
      showToast("success", message);
      setIsShow(false);
      loadData();
    } catch (err) {
      console.log(err);
      let message = "Đồng bộ không thành công!";
      const error = err?.response?.data;
      message = (error && typeof error === "string"
      ? error
      : typeof error === "object"
        ? JSON.stringify(error)
        : message);
      showToast("error", message);
    } finally {
      setAreInSync(false);
    }
  };

  const cancel = () => {
    setIsShow(false);
  };


  const { isReloading, reload } = useReload(loadData);

  const getBtnGroup = (rowData) => {

    //Được cập nhật khi trạng thái đồng bộ khác đã đồng bộ:
    const canUpdate = rowData?.sync_status !== 2;

    //Được đồng bộ khi trạng thái đồng bộ đã cập nhật DL:
    const canSync = rowData?.sync_status == 1;

    return (
      <div className="flex gap-2">
        {canUpdate && 
          <Button
            icon="pi pi-pencil"
            tooltip="Cập nhật dữ liệu"
            onClick={async () => {
              handleOnClickUpdateBtn(rowData)
            }}
            style={{ backgroundColor: "#1445a7", color: "#fff", border:"none" }}
          />
        }
        <Button
          icon="pi pi-sync"
          tooltip={
            canSync
              ? "Đồng bộ"
              : "Cập nhật dữ liệu trước khi đồng bộ"
          }
          className="dim-on-disable"
          disabled={!canSync}
          onClick={() => handleOnClickSyncBtn(rowData)}
          style={
            { backgroundColor: "#fff", 
              color: canSync ? "#1445a7" : "#fff", 
              borderColor: "#1445a7" 
            }}
        />
      </div>
    )
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
            body={(rowData) => {
              const trangThaiDongBo = rowData?.sync_status;
              const isLocked = rowData?.is_locked == 1;
              const isDisabled = trangThaiDongBo != 1 || isLocked;
              const isChecked = selectedRecords.some(r => r.id === rowData?.id);

              return (
                <input
                  type="checkbox"
                  disabled={isDisabled}
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRecords([...selectedRecords, rowData]);
                    } else {
                      setSelectedRecords(prev =>
                        prev.filter(
                          r => !(r.sync_status == 1 && r.is_locked == 0)
                        )
                      );
                    }
                  }}
                  style={{ 
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transform:"scale(1.2)"
                  }}
                />
              );
            }}

            header={() => {
              
              // Lấy danh sách record được phép chọn (không disabled)
              const selectable = dataTable.filter(r => (r.sync_status == 1 && r.is_locked == 0));
              // Kiểm tra xem tất cả record cho phép đã được chọn chưa
              const allSelected = selectable.length > 0 &&
                selectable.every(r => selectedRecords.some(s => s.id === r.id));

              return (
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Chọn tất cả record có thể chọn
                      setSelectedRecords(prev => {
                        const ids = new Set(prev.map(r => r.id));
                        const newOnes = selectable.filter(r => !ids.has(r.id));
                        return [...prev, ...newOnes];
                      });
                    } else {
                      // Bỏ chọn tất cả record có thể chọn
                      setSelectedRecords(prev => prev.filter(r => (r.sync_status != 1)));
                    }
                  }}
                  style={{ transform: "scale(1.2)", cursor: "pointer" }}
                />
              );
            }}
          />

        <Column
          header="Thao tác"
          body={(rowData) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",    
                justifyContent: "center", 
                height: "100%",           
                gap: "0.25rem"           
              }}
            >
              {getBtnGroup(rowData)}
            </div>
          )}
          headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
          style={{ minWidth: "7rem" }}
        />
        <Column
          headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
          header="STT"
          body={(_, options) => (pageIndex - 1) * pageSize + options.rowIndex + 1}
          style={{minWidth: "3rem"}}
        />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="dm_donvi_ten"
            header={columnMapping.dm_donvi_ten}
            style={{minWidth: "18rem"}}
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
            field="tbi_dm_chungloai_ten"
            header={columnMapping.tbi_dm_chungloai_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="duyet_tbi"
            header={columnMapping.duyet_tbi}
            style={{minWidth: "10rem", textAlign: "center"}}
            body={(rowData) => (
              rowData.duyet_tbi == 1 ? "Đã duyệt" : "Chưa duyệt"
            )}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_trangthai_ten"
            header={columnMapping.tbi_trangthai_ten}
            style={{minWidth: "10rem", textAlign: "center"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_kho_ten"
            header={columnMapping.tbi_kho_ten}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="dm_phongban_ten_old"
            header={columnMapping.dm_phongban_ten_old}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="dm_phongban_ten"
            header={columnMapping.dm_phongban_ten}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoi_sd_old"
            header={columnMapping.nguoi_sd_old}
            style={{minWidth: "12rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoi_sd"
            header={columnMapping.nguoi_sd}
            style={{minWidth: "12rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="thong_tin_khac"
            header={columnMapping.thong_tin_khac}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            header="Thông tin chi tiết"
            body={(rowData) => {
              let detailData = {};
              let detailConfig = [];

              try {
                detailData = rowData?.thongtin_chitiet_json ? JSON.parse(rowData.thongtin_chitiet_json) : {};
                detailConfig = rowData?.ct_cauhinh_json ? JSON.parse(rowData.ct_cauhinh_json) : [];
              } catch (error) {
                console.error("Lỗi parse JSON:", error);
              }

              if (!detailConfig.length) return null;

              return (
                <div className="flex flex-column gap-1">
                  {detailConfig.map((item) => {
                    const value = detailData[item.name];

                    // Nếu detailData không có value → bỏ qua luôn
                    if (value === undefined || value === null || value === "") return null;

                    return (
                      <div key={item.name}>
                        <strong>{item.label}:</strong> {value}
                      </div>
                    );
                  })}
                </div>
              );
            }}
            style={{ minWidth: "15rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sync_status"
            header={columnMapping.sync_status}
            style={{minWidth: "12rem"}}
            body={(rowData) => {
              const getTrangThaiDongBo = (value) => trangThaiDongBoArr.find(x => x.value === value);
              const status = getTrangThaiDongBo(rowData?.sync_status)
              
              return (
                  <div
                      style={{
                          backgroundColor: status?.bg || "#e6f0ff",
                          color: status?.color || "#000",
                          borderRadius: "2rem",
                          padding: "4px 10px",
                          textAlign: "center",
                          fontWeight: 500
                      }}
                  >
                      {status?.label || "Chưa xác định"}
                  </div>
              );
            }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="updated_by"
            header={columnMapping.updated_by}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="updated_date"
            header={columnMapping.updated_date}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sync_by"
            header={columnMapping.sync_by}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sync_date"
            header={columnMapping.sync_date}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sync_error"
            header={columnMapping.sync_error}
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

      <ConfirmDialog
        visible={isShow}
        onHide={() => setIsShow(false)}
        header="Xác nhận"
        message={() => {
            let message = "Bạn có chắc chắn đồng bộ bản ghi này không?"
            if (isMultiSync) {
              message = `Bạn có chắc chắn đồng ${selectedRecords?.length} bản ghi đã chọn không?`
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
              disabled={areInSync}
              onClick={cancel}
            />

            <Button
              severity="success"
              label="Đồng ý"
              icon="pi pi-check"
              loading={areInSync}
              onClick={confirm}
            />
          </div>
        }
      >
      </ConfirmDialog>
    </>
  );
};

export default DanhMucThietBiCuTable;