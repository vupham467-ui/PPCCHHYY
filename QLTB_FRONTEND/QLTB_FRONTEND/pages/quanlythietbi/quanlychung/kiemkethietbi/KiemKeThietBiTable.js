import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { FilterMatchMode } from "primereact/api";
import { useKiemKePermissions } from "../../../../hooks/useKiemKePermissions";
import { btnActionColors, scrollTableHeight } from "../../../../constants/propGlobal";
import Pagination from "../../../../components/Pagination";
import ReloadButton from "../../../../components/ReloadButton";
import useReload from "../../../../hooks/useReload";
import RenderSignStatus from "../../../../components/SignStatus";
import { kiemKeThietBiService } from "../../../../services/quanlythietbi/QLTB_KiemKeThietBiService";
import { storageHelper } from "../../../../utils/storageUtils";
import DialogChiTietKiemKe from "./DialogChiTietKiemKe";

const headerStyle = { backgroundColor: "#1445a7", color: "#fff" };
const actionButtonStyle = {
  border: "none",
  color: "#fff",
  height: "37px",
  width: "37px",
};

const KiemKeThietBiTable = ({
  dataTable = [],
  isLoading = false,
  totalRecords = 0,
  pageIndex = 1,
  pageSize = 10,
  setPageIndex,
  setPageSize,
  loadData,
  showToast,
  onCreate,
  onViewPdf,
  onSignPdf,
  onEditResult,
  onCancel,
  onDelete,
}) => {
  const permissions = useKiemKePermissions();
  const user = storageHelper.get("user") || {};
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const { isReloading, reload } = useReload(loadData);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [detailDevices, setDetailDevices] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters((current) => ({ ...current, global: { ...current.global, value } }));
    setGlobalFilterValue(value);
  };

  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;
    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        {permissions.canCreate && (
          <Button label="Thêm mới" icon="pi pi-plus-circle" className="p-button-primary dim-on-disable" onClick={onCreate} />
        )}
      </div>
    );
  };

  const getStatusTag = (trang_thai) => {
    switch (trang_thai) {
      case 0:
        return <Tag severity="warning" value="Chờ ký C1" />;
      case 1:
        return <Tag severity="info" value="Chờ ký C2" />;
      case 2:
        return <Tag severity="success" value="Hoàn thành" />;
      case 3:
        return <Tag severity="danger" value="Đã hủy" />;
      default:
        return <Tag severity="secondary" value="Không xác định" />;
    }
  };

  const handleViewDetail = async (rowData) => {
    try {
      setShowDetailDialog(true);
      setIsLoadingDetail(true);
      setDetailDevices((await kiemKeThietBiService.getthietbi(rowData.id)) || []);
    } catch (error) {
      console.error("Lỗi lấy chi tiết thiết bị kiểm kê:", error);
      setDetailDevices([]);
      if (showToast) showToast("error", "Không tải được chi tiết thiết bị kiểm kê!");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const signerBody = (rowData, isC1) => {
    const targetUnit = rowData.ten_phongban_kiemke || rowData.ten_dvi_kiemke || "";
    return (
      <RenderSignStatus
        isSend={isC1}
        rowData={{
          trang_thai: rowData.trang_thai,
          ngay_giao: rowData.ngay_giao,
          ngay_nhan: rowData.ngay_nhan,
          ten_nguoi_giao: rowData.ten_daidien_c3,
          ten_nguoi_nhan: rowData.ten_daidien_dvi,
          ten_phongban_giao: "Phòng CNTTCĐS",
          ten_phongban_nhan: targetUnit,
        }}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    const currentUser = String(user?.ten_dang_nhap || user?.username || "").trim().toLowerCase();
    const c1Signer = String(rowData?.nguoi_daidien_c3 || "").trim().toLowerCase();
    const c2Signer = String(rowData?.nguoi_daidien_dvi || "").trim().toLowerCase();
    const status = Number(rowData?.trang_thai);
    const canSignC1 = status === 0 && currentUser && currentUser === c1Signer;
    const canSignC2 = status === 1 && currentUser && currentUser === c2Signer;
    const canSign = canSignC1 || canSignC2;

    return (
      <div className="flex gap-2 justify-content-center flex-nowrap">
        {permissions.canEdit(rowData) && (
          <Button
            icon="pi pi-pencil"
            tooltip="Cập nhật kết quả kiểm kê"
            tooltipOptions={{ position: "top" }}
            style={{ ...actionButtonStyle, backgroundColor: btnActionColors.edit }}
            onClick={() => onEditResult(rowData)}
          />
        )}

        {canSign ? (
          <Button
            icon="pi pi-user-edit"
            tooltip={canSignC1 ? "Ký số C1" : "Ký số C2"}
            tooltipOptions={{ position: "top" }}
            style={{ ...actionButtonStyle, backgroundColor: btnActionColors.sign }}
            onClick={() => onSignPdf(rowData)}
          />
        ) : (
          <Button
            icon="pi pi-eye"
            tooltip="Xem PDF"
            tooltipOptions={{ position: "top" }}
            style={{ ...actionButtonStyle, backgroundColor: btnActionColors.view }}
            onClick={() => onViewPdf(rowData)}
          />
        )}

        {permissions.canDelete(rowData) && (
          <Button
            icon="pi pi-trash"
            tooltip="Xóa biên bản"
            tooltipOptions={{ position: "top" }}
            style={{ ...actionButtonStyle, backgroundColor: btnActionColors.delete }}
            onClick={() => onDelete(rowData)}
          />
        )}

        {permissions.canCancel(rowData) && (
          <Button
            icon="pi pi-ban"
            tooltip="Hủy biên bản"
            tooltipOptions={{ position: "top" }}
            style={{ ...actionButtonStyle, backgroundColor: btnActionColors.destroy }}
            onClick={() => onCancel(rowData)}
          />
        )}
      </div>
    );
  };

  return (
    <Panel headerTemplate={headerTemplate({ className: "p-panel-header panel-padding" })}>
      <div className="flex justify-content-between mb-3 gap-2">
        <ReloadButton onReload={reload} isLoading={isReloading} />
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" className="w-full md:w-auto" />
        </span>
      </div>
      <DataTable
      value={dataTable}
      loading={isLoading}
      rows={pageSize}
      filters={filters}
      onFilter={(e) => setFilters(e.filters)}
      globalFilterFields={["id", "ma_nhom_thietbi", "ten_nhom_thietbi", "ten_dvi_kiemke", "ten_phongban_kiemke", "ten_daidien_c3", "ten_daidien_dvi", "noi_dung"]}
      stripedRows
      showGridlines
      scrollable
      scrollHeight={scrollTableHeight}
      responsiveLayout="scroll"
      className={`mt-3 ${isReloading ? "reloading" : ""}`}
      loadingIcon={<ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="none" animationDuration=".5s" />}
      emptyMessage="Không tìm thấy biên bản kiểm kê nào"
    >
      <Column
        header="STT"
        headerStyle={headerStyle}
        body={(r, opt) => (pageIndex - 1) * pageSize + opt.rowIndex + 1}
        style={{ width: "60px", textAlign: "center" }}
      />
      <Column
        header="Thao tác"
        headerStyle={headerStyle}
        body={actionBodyTemplate}
        style={{ minWidth: "13rem", textAlign: "center" }}
      />
      <Column field="id" header="ID" headerStyle={headerStyle} style={{ minWidth: "5rem", textAlign: "center" }} />
      <Column
        field="loai_kiemke"
        header="Loại kiểm kê"
        headerStyle={headerStyle}
        body={(r) => r.loai_kiemke === 3 ? "Phòng ban Công ty" : "Đơn vị cấp 4"}
        style={{ minWidth: "10rem" }}
      />
      <Column
        field="ten_dvi_kiemke"
        header="Đơn vị sử dụng"
        headerStyle={headerStyle}
        body={(r) => r.loai_kiemke === 3
          ? (r.ten_phongban_kiemke || r.ten_dvi_kiemke || "—")
          : (r.ten_dvi_kiemke || "—")}
        style={{ minWidth: "15rem" }}
      />
      <Column
        field="ten_nhom_thietbi"
        header="Nhóm thiết bị"
        headerStyle={headerStyle}
        body={(r) => r.ten_nhom_thietbi
          ? `${r.ten_nhom_thietbi}${r.ma_nhom_thietbi ? ` (${r.ma_nhom_thietbi})` : ""}`
          : (r.ma_nhom_thietbi || "—")}
        style={{ minWidth: "14rem" }}
      />
      <Column field="ngay_kiemke" header="Ngày kiểm kê" headerStyle={headerStyle} style={{ minWidth: "12rem", textAlign: "center" }} />
      <Column
        field="ten_daidien_c3"
        header="Đại diện Ban kiểm kê (Ký C1)"
        headerStyle={headerStyle}
        body={(r) => signerBody(r, true)}
        style={{ minWidth: "18rem" }}
      />
      <Column
        field="ten_daidien_dvi"
        header="Đại diện ĐV sử dụng (Ký C2)"
        headerStyle={headerStyle}
        body={(r) => signerBody(r, false)}
        style={{ minWidth: "18rem" }}
      />
      <Column
        field="so_luong"
        header="Số lượng"
        headerStyle={headerStyle}
        body={(r) => (
          <Button
            label={`${r.so_luong || 0} thiết bị`}
            className="p-button-text p-2 text-primary"
            onClick={() => handleViewDetail(r)}
          />
        )}
        style={{ minWidth: "8rem", textAlign: "center" }}
      />
      {/* <Column
        field="trang_thai"
        header="Trạng thái"
        headerStyle={headerStyle}
        body={(r) => getStatusTag(r.trang_thai)}
        style={{ width: "180px", textAlign: "center" }}
      /> */}

      </DataTable>
      {totalRecords > 0 && (
        <Pagination pageIndex={pageIndex} setPageIndex={setPageIndex} pageSize={pageSize} setPageSize={setPageSize} totalRecords={totalRecords} />
      )}
      <DialogChiTietKiemKe
        visible={showDetailDialog}
        onHide={() => setShowDetailDialog(false)}
        devices={detailDevices}
        isLoading={isLoadingDetail}
      />
    </Panel>
  );
};

export default KiemKeThietBiTable;
