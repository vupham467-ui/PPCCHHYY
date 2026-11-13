import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import Pagination from "../../../../components/Pagination";

const headerStyle = { backgroundColor: "#1445a7", color: "#fff" };

const DialogChiTietKiemKe = ({ visible, onHide, devices = [], isLoading = false }) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const paginatedDevices = useMemo(() => {
    const first = (pageIndex - 1) * pageSize;
    return devices.slice(first, first + pageSize);
  }, [devices, pageIndex, pageSize]);

  useEffect(() => {
    if (visible) setPageIndex(1);
  }, [visible]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(devices.length / pageSize));
    if (pageIndex > totalPages) setPageIndex(totalPages);
  }, [devices.length, pageIndex, pageSize]);

  return (
    <Dialog
      header="Chi tiết kết quả kiểm kê thiết bị"
      visible={visible}
      style={{ width: "95vw", maxWidth: "1500px" }}
      modal
      onHide={onHide}
    >
      <DataTable
        value={paginatedDevices}
        loading={isLoading}
        stripedRows
        showGridlines
        scrollable
        scrollHeight="700px"
        className="p-datatable-sm"
        emptyMessage="Chưa có dữ liệu thiết bị kiểm kê"
      >
        <Column header="STT" headerStyle={headerStyle} body={(_, option) => (pageIndex - 1) * pageSize + option.rowIndex + 1} style={{ width: "60px", textAlign: "center" }} />
        <Column field="ten_thietbi" header="Tên thiết bị" headerStyle={headerStyle} style={{ minWidth: "160px" }} />
        <Column field="no_thietbi" header="Số hiệu" headerStyle={headerStyle} style={{ minWidth: "120px" }} />
        <Column field="ten_chungloai" header="Chủng loại" headerStyle={headerStyle} style={{ minWidth: "130px" }} />
        <Column field="nam_su_dung" header="Năm SD" headerStyle={headerStyle} style={{ width: "90px", textAlign: "center" }} />
        <Column
          header="Dữ liệu hệ thống"
          headerStyle={headerStyle}
          body={(row) => (
            <div className="text-sm">
              <div><strong>Phòng ban:</strong> {row.phongban_he_thong || "Chưa có"}</div>
              <div><strong>Người sử dụng:</strong> {row.nguoi_sd_he_thong || "Chưa có"}</div>
              <div><strong>Computer Name:</strong> {row.computer_name_he_thong || "Không áp dụng"}</div>
            </div>
          )}
          style={{ minWidth: "220px" }}
        />
        <Column
          header="Có thực tế"
          headerStyle={headerStyle}
          body={(row) => <Tag severity={row.co_thuc_te === "Y" ? "success" : "danger"} value={row.co_thuc_te === "Y" ? "Có" : "Không"} />}
          style={{ width: "105px", textAlign: "center" }}
        />
        <Column field="tinh_trang_thucte" header="Tình trạng thực tế" headerStyle={headerStyle} style={{ minWidth: "145px" }} />
        <Column field="nguoi_sd_thucte" header="Người SD thực tế" headerStyle={headerStyle} style={{ minWidth: "160px" }} />
        <Column field="computer_name_thucte" header="Computer Name thực tế" headerStyle={headerStyle} style={{ minWidth: "170px" }} />
        <Column field="ghi_chu_kiemke" header="Ghi chú" headerStyle={headerStyle} style={{ minWidth: "150px" }} />
      </DataTable>
      <Pagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalRecords={devices.length}
        dropdownAppendTo="body"
      />
    </Dialog>
  );
};

export default DialogChiTietKiemKe;
