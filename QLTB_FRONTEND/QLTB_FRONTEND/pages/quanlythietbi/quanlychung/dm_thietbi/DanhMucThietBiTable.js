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
import { thietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import ExportExcelButton from "../../../../components/ExportExcelButton";
import SelectMenu from "../../../../components/SelectMenu";
import { headerStyleColumn, MADV_CTY, scrollTableHeight } from "../../../../constants/propGlobal";
import { storageHelper } from "../../../../utils/storageUtils";
import LichSuGiaoNhanThietBi from "./LichSuGiaoNhanThietBi";

const columnMapping = {
    stt: "STT",
    khoa_tbi: "TT",
    dm_donvi_ten: "Đơn vị",
    ten_thietbi: "Tên thiết bị",
    ma_thietbi: "Mã thiết bị",
    no_thietbi: "Serial",
    dm_donvitinh_ten: "ĐVT",
    namsx: "Năm SX",
    tbi_dm_chungloai_ten: "Chủng loại",
    tbi_dm_hangsx_ten: "Hãng SX",
    tbi_nuocsx_ten: "Nước SX",
    tbi_trangthai_ten: "Trạng thái SD",
    nguoi_sd: "Người sử dụng",
    dm_phongban_ten: "Phòng ban SD",
    tbi_kho_ten: "Kho",
    ngay_vanhanh: "Ngày vận hành",
    thong_tin_khac: "Thông tin khác",
    nguoi_tao: "Người tạo",
    ngay_tao: "Ngày tạo",
    nguoi_duyet: "Người duyệt",
    ngay_duyet: "Ngày duyệt",
    qr_code: "QR code"
};

const DanhMucThietBiTable = ({
  setVisible,
  setIsUpdate,
  setIsView,
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
  handleOnClickViewBtn,
  handleCloseModal,
  selectedRecords,
  setSelectedRecords,
  options,
  handlePrintQR,
  setIsImportDialogVisible
}) => {
  const [isShow, setIsShow] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedRecord, setSelectedRecord] = useState();
  const [showHistory, setShowHistory] = useState(false);

  const user = storageHelper.get("user");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    no_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const confirm = async () => {
    setIsShow(false);
         
    try {
      // const id = selectedRecords?.id;

      // if (!id) showToast("error", "Không tìm thấy bản ghi cần xóa");
      // await thietBiService.delete(id);
      // showToast("success", "Xóa bản ghi thành công!");
      // loadData();
      if (isMultiDelete) {
        if (!selectedRecords || selectedRecords.length === 0) {
          showToast("warn", "Chưa chọn thiết bị nào để xóa");
          return;
        }

        const ids = [
            ...new Set(
                selectedRecords
                    .filter(r => (r.duyet_tbi != "1")) // chỉ lấy những thiết bị chưa duyệt
                    .map(({ id }) => id)
            )
        ];
        
        await thietBiService.deleteMulti(ids);
      } else {
        if (!selectedId) {
          showToast("error", "Không tìm thấy bản ghi cần xóa");
          return;
        }
        await thietBiService.delete(selectedId);
      }
      showToast("success", "Xóa thành công!");
      loadData();
    } catch (err) {
      let message = "Xóa không thành công!";
      const error = err?.response?.data;
      message = (error && typeof error === "string"
      ? error
      : typeof error === "object"
        ? JSON.stringify(error)
        : message);
      showToast("error", message);
    }
  };

  const cancel = () => {
    setIsShow(false);
  };

  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;
    
    //Chỉ Admin hoặc người quản lý TB tại P10 hoặc đơn vị cấp 4 mới có quyền thêm, xóa thiết bị:
    const dsQuyen = user?.ds_quyen || "";
    const dsQuyenArr = dsQuyen.split(',');
    const checkQuyenTaoTB = ['ADMIN', 'QLTB_QLP10', 'QLTB_QLC4'];
    const hasQuyenTaoTB = dsQuyenArr.some(q => checkQuyenTaoTB.includes(q));

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
          {hasQuyenTaoTB && selectedRecords.length > 0 && 
            <Button 
              label="Xóa nhiều" 
              className="p-button-danger dim-on-disable"
              onClick={() => {
                  setIsShow(true);
                  setIsMultiDelete(true);
                } 
              }
            />
          }
          {hasQuyenTaoTB && 
            <>
              <Button
                label="Thêm mới"
                style={{ backgroundColor: "#1445a7" }}
                onClick={() => {
                  setVisible(true);
                  setIsUpdate(false);
                  setIsView(false);
                }}
              />
              <Button
                label="Import Excel"
                icon="pi pi-file-excel"
                className="p-button-info"
                onClick={() => setIsImportDialogVisible(true)}
              />
            </>
          }

          <ExportExcelButton
            fetchData={getDataExportExcel}
            fileName={"Danh sách thiết bị"}
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
  
  const handleOnClickDeleteBtn = (rowData) => {
    setIsShow(true);
    setIsMultiDelete(false);
    setSelectedId(rowData?.id);
  };

  const handleOnClickHistoryBtn = (rowData) => {
    setSelectedRecord(rowData);
    setShowHistory(true);
  }


  const { isReloading, reload } = useReload(loadData);

  const getBtnGroup = (rowData) => {
    const trangThaiMoKhoa = rowData?.khoa_tbi;
    const trangThaiDuyet = rowData?.duyet_tbi;
    // const trangThaiSuDung  = rowData?.tbi_trangthai_id;

    //Nếu đang đăng ký mở khóa, đang khóa hoặc đã được duyệt thì không cho phép cập nhật:
    //const disableUpdate =  trangThaiMoKhoa == "1" ||  trangThaiMoKhoa == "3" || (!trangThaiMoKhoa && trangThaiDuyet == "1");
    const isDangKyMoKhoa = trangThaiMoKhoa == "1";
    const isDangKhoa = trangThaiMoKhoa == "3";
    const isDaDuyet = !trangThaiMoKhoa && trangThaiDuyet == "1";
    const isAdmin = user?.is_admin == "Y" && user?.ma_dviqly === MADV_CTY;

    const disableUpdate = !isAdmin && (isDangKyMoKhoa || isDangKhoa || isDaDuyet);

    //Nếu đã được duyệt thì không thể xóa:
    const disableDelete = trangThaiDuyet == "1";
    //Nếu chưa duyệt thì không thể in QR:
    const disableQR = trangThaiDuyet == "0";
    //Có lịch sử giao nhận thì hiện:
    const hasHistory = rowData?.co_ls_giaonhan == "Y";

    const items = [
      {
        label: "Xem chi tiết",
        icon: <i className="pi pi-info-circle" style={{ color: "#1445a7", marginRight: "0.5rem" }}></i>,
        command: () => handleOnClickViewBtn(rowData)
      },
      hasHistory &&{
        label: "Lịch sử giao nhận",
        icon: <i className="pi pi-history" style={{ color: "#1445a7", marginRight: "0.5rem" }}></i>,
        command: () => handleOnClickHistoryBtn(rowData)
      },
      !disableUpdate && {
        label: "Sửa",
        icon: <i className="pi pi-pencil" style={{ color: "green", marginRight: "0.5rem" }}></i>,
        command: () => handleOnClickUpdateBtn(rowData)
      },
      !disableDelete && {
        label: "Xóa",
        icon: <i className="pi pi-trash" style={{ color: "red", marginRight: "0.5rem" }}></i>,
        command: () => handleOnClickDeleteBtn(rowData)
      },
      !disableQR && {
        label: "In mã QR code",
        icon: <i className="pi pi-qrcode" style={{ color: "#1445a7", marginRight: "0.5rem" }}></i>,
        items: [
          {
            label: "In mã QR code (bộ 1 mã)",
            icon: <i className="pi pi-print" style={{ color: "#1445a7", marginRight: "0.5rem" }}></i>,
            command: () => handlePrintQR(rowData, "single")
          },
          {
            label: "In mã QR code (bộ 3 mã)",
            icon: <i className="pi pi-print" style={{ color: "#1445a7", marginRight: "0.5rem" }}></i>,
            command: () => handlePrintQR(rowData, "small")
          }
        ]
      },
    ].filter(Boolean);

    return (
      <SelectMenu items={items} backgroundColor="#fff" color={headerStyleColumn.backgroundColor} icon= "pi pi-ellipsis-v"/>
    );
  }

  const getDataExportExcel = async () => {
    setIsLoadingExport(true);
    try {
      const params = {
        ...options,
        pageIndex: 1,
        pageSize: -1,
      };

      const response = await thietBiService.get(params);
      const dataBC = response?.data|| [];    
      
      const filteredData = dataBC.map(item => {
        return Object.keys(columnMapping).reduce((acc, key) => {
          if (item.hasOwnProperty(key)) {
            // Nếu là khoa_tbi, chuyển giá trị
            if (key === "khoa_tbi") {
              acc[key] = item[key] == 3 ? "Đã khóa" : (item[key] == 1 ? "Đã đăng ký" : "Đang mở");
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
              const trangThaiDuyet = rowData?.duyet_tbi;
              // const trangThaiSuDung  = rowData?.tbi_trangthai_id;
              const isDisabled = trangThaiDuyet == '1';
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
              const selectable = dataTable.filter(r => (r.duyet_tbi != "1"));
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
                      setSelectedRecords(prev => prev.filter(r => (r.duyet_tbi == '1')));
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
            // {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="khoa_tbi"
            header={columnMapping.khoa_tbi}
            body={(rowData) => {
              const trangThaiMoKhoa = rowData?.khoa_tbi;
              const trangThaiDuyet = rowData?.duyet_tbi;
              let className = "", color = "", title = "";
              if (trangThaiMoKhoa == "1") {
                className = "pi pi-external-link";
                color = "blue";
                title = "Đăng ký mở, chưa duyệt";
              } else if ((!trangThaiMoKhoa && trangThaiDuyet == "0")) {
                className = "pi pi-sparkles";
                color = "green";
                title = "Thiết bị mới, chưa duyệt";
              } else if (trangThaiMoKhoa == "2") {
                className = "pi pi-lock-open";
                color = "green";
                title="Đang mở";
              } else if (trangThaiMoKhoa == "3" || (!trangThaiMoKhoa && trangThaiDuyet == "1")) {
                className = "pi pi pi-lock";
                color = "red";
                title="Đã khóa";
              }

              return (
                <div className="flex flex-column justify-content-center gap-2">
                  <i
                    className={className}
                    style={{ fontSize: "1.2rem", color: color }}
                    title={title}
                  ></i>
                  <label style={{color: color}}>{title}</label>
                </div>
                );
            }}
            style={{minWidth: "8rem"}}
            className="text-center"
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
            field="dm_donvitinh_ten"
            header={columnMapping.dm_donvitinh_ten}
            style={{minWidth: "5rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="namsx"
            header={columnMapping.namsx}
            style={{minWidth: "8rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_dm_chungloai_ten"
            header={columnMapping.tbi_dm_chungloai_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_dm_hangsx_ten"
            header={columnMapping.tbi_dm_hangsx_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_nuocsx_ten"
            header={columnMapping.tbi_nuocsx_ten}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_trangthai_ten"
            header={columnMapping.tbi_trangthai_ten}
            style={{minWidth: "10rem", textAlign: "center"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoi_sd"
            header={columnMapping.nguoi_sd}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="dm_phongban_ten"
            header={columnMapping.dm_phongban_ten}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tbi_kho_ten"
            header={columnMapping.tbi_kho_ten}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngay_vanhanh"
            header={columnMapping.ngay_vanhanh}
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
            field="thong_tin_khac"
            header={columnMapping.thong_tin_khac}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoi_tao"
            header={columnMapping.nguoi_tao}
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
            field="nguoi_duyet"
            header={columnMapping.nguoi_duyet}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngay_duyet"
            header={columnMapping.ngay_duyet}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="qr_code"
            header={columnMapping.qr_code}
            style={{minWidth: "30rem"}}
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

      {showHistory && 
        <LichSuGiaoNhanThietBi
          visible={showHistory}
          setVisible={setShowHistory} 
          selectedRecord={selectedRecord}
          showToast={showToast}
        />
      }

      <ConfirmDialog
        visible={isShow}
        onHide={() => setIsShow(false)}
        header="Xác nhận"
        message={() => {
            let message = "Bạn có chắc chắn xóa bản ghi này không?"
            if (isMultiDelete) {
              message = `Bạn có chắc chắn xóa ${selectedRecords?.length} bản ghi đã chọn không?`
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

export default DanhMucThietBiTable;