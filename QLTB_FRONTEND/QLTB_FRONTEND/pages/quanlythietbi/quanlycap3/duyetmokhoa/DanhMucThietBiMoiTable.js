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
import LabelStatus from "../../../../components/LabelStatus";
import { duyetThietBiMoiService } from "../../../../services/quanlythietbi/QLTB_DuyetMoKhoaTBService";
import { storageHelper } from "../../../../utils/storageUtils";
import ExportExcelButton from "../../../../components/ExportExcelButton";
import DialogChiTietThietBi from "./DialogChiTietTB";
import { scrollTableHeight } from "../../../../constants/propGlobal";

const columnMapping = {
    stt: "STT",
    ma_dviqly: "Mã đơn vị",
    duyet_tbi: "Trạng thái duyệt",
    tbi_dm_chungloai_ten: "Chủng loại",
    ten_thietbi: "Tên thiết bị",
    ma_thietbi: "Mã thiết bị",
    no_thietbi: "Serial (NO)",
    namsx: "Năm SX",
    tbi_dm_hangsx_ten: "Hãng SX",
    tbi_trangthai_ten: "Trạng thái",
    ngay_tao: "Ngày tạo",
    nguoi_tao: "Người tạo",
};


const DanhMucThietBiMoiTable = ({
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const user = storageHelper.get("user");
  const { ho_ten, ten_dang_nhap, dm_donvi_id } = user;

  //Tìm kiếm local tại trang:
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });


  const confirm = async () => {
    setIsPending(true);
    try {
      //Nếu duyệt nhiều:
      if (isMulti) {
        if (!selectedRecords || selectedRecords.length === 0) {
          showToast("warn", "Chưa chọn thiết bị nào để duyệt");
          return;
        }

        const ids = [
            ...new Set(
                selectedRecords
                    .filter(r => r.duyet_tbi != 1) // chỉ lấy những thiết bị chưa duyệt
                    .map(({ id }) => id)
            )
        ];

        await duyetThietBiMoiService.updatemulti({
          ids,
          nguoi_duyet: ten_dang_nhap
        });
      } else {
        if (!selectedId) {
          showToast("error", "Không tìm thấy bản ghi cần duyệt");
          return;
        }
        await duyetThietBiMoiService.update({id: selectedId, nguoi_duyet: ten_dang_nhap});
      }
      showToast("success", "Duyệt thành công!");
      setIsDetailOpen(false);
      loadData();
    } catch (err) {
      let message = "Duyệt không thành công!";
      const error = err?.response?.data;
      message = (error && typeof error === "string"
      ? error
      : typeof error === "object"
        ? JSON.stringify(error)
        : message);
      showToast("error", message);
    } finally {
      setIsPending(false);
      setIsShow(false);
    }
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

      const response = await duyetThietBiMoiService.get(params);
      const dataBC = response?.data|| [];    
      const filteredData = dataBC.map(item => {
        return Object.keys(columnMapping).reduce((acc, key) => {
          if (item.hasOwnProperty(key)) {
            // Nếu là duyet_tbi, chuyển giá trị
            if (key === "duyet_tbi") {
              acc[key] = item[key] == 1 ? "Đã được duyệt" : "Chưa được duyệt";
            } else {
              acc[key] = item[key];
            }
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
              label="Duyệt nhiều thiết bị" 
              icon="pi pi-check-circle"
              className="p-button-primary dim-on-disable"
              onClick={() => {
                  setIsShow(true);
                  setIsMulti(true);
                } 
              }
              disabled = {selectedRecords.length == 0 || isPending}
          />
          <ExportExcelButton
            fetchData={getDataExportExcel}
            fileName={"Danh sách thiết bị duyệt mới"}
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
    
    const da_duyet = rowData?.duyet_tbi == 1;

      //Xem và duyệt:
    const handleViewAndApprove = () => {
      setSelectedId(rowData?.id);
      setIsDetailOpen(true);
    };

    // const handleClickDuyetBtn = () => {
    //     setIsMulti(false);
    //      setSelectedId(rowData?.id);
    //     setIsShow(true);
    // };

    return (
      <div className="text-center">
        <Button
          icon="pi pi-check-circle"
          tooltip="Xem và duyệt"
          disabled={da_duyet}
          onClick={handleViewAndApprove}
          label="Xem và duyệt"
          style={{
            backgroundColor: da_duyet ? '#f0f0f0' : '#fff',
            color: da_duyet ? '#999' : '#1445a7',
            border: `1px solid ${da_duyet ? '#999' : '#1445a7'}`,
            boxShadow: da_duyet ? 'none' : '0 2px 6px rgba(0,0,0,0.1)',
            cursor: da_duyet ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          className={da_duyet ? '' : 'hover:shadow-lg hover:-translate-y-0.5'}
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
          {/* <Column 
            headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} 
            selectionMode="multiple"
          /> */}
            <Column
              headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
              body={(rowData) => {
                const isDisabled = rowData?.duyet_tbi == 1;
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
                        setSelectedRecords(selectedRecords.filter(r => r.id !== rowData?.id));
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
                const selectable = dataTable.filter(r => r.duyet_tbi != 1);
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
                        setSelectedRecords(prev => prev.filter(r => r.duyet_tbi == 1));
                      }
                    }}
                    style={{ transform: "scale(1.2)", cursor: "pointer" }}
                  />
                );
              }}
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
            style={{minWidth: "14rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ma_dviqly"
            header={columnMapping.ma_dviqly}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={(rowData) => {
              const trang_thai_duyet = rowData?.duyet_tbi;
              const trang_thai_num = typeof(trang_thai_duyet) == "string" ? (+trang_thai_duyet) : trang_thai_duyet;
              return (
                <LabelStatus 
                  trang_thai={trang_thai_num}
                  label = {trang_thai_num == 1 ? "Đã được duyệt": "Chưa được duyệt"}
                />
            )}}
            header="Trạng thái duyệt"
            style={{minWidth: "12rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_dm_chungloai_ten"
            header={columnMapping.tbi_dm_chungloai_ten}
            style={{minWidth: "15rem"}}
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
            field="tbi_trangthai_ten"
            header={columnMapping.tbi_trangthai_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngay_tao"
            header={columnMapping.ngay_tao}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoi_tao"
            header={columnMapping.nguoi_tao}
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
      {
        isDetailOpen && 
        <DialogChiTietThietBi
          visible={isDetailOpen}
          setVisible={setIsDetailOpen}
          selectedId={selectedId}
          setIsMulti={setIsMulti}
          setIsShow={setIsShow}
        />
      }
      <ConfirmDialog
        visible={isShow}
        onHide={() => setIsShow(false)}
        header="Xác nhận"
        message={() => {
            let message = "Bạn có chắc chắn duyệt bản ghi này không?"
            if (isMulti) {
              message = `Bạn có chắc chắn duyệt ${selectedRecords?.length} bản ghi đã chọn không?`
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
              disabled={isPending}
              onClick={cancel}
            />

            <Button
              severity="primary"
              label="Đồng ý"
              icon="pi pi-check"
              loading={isPending}
              onClick={confirm}
            />
          </div>
        }
      >
      </ConfirmDialog>
    </>
  );
};

export default DanhMucThietBiMoiTable;