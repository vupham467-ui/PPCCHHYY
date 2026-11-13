import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import { kiemKeThietBiService } from "../../../../services/quanlythietbi/QLTB_KiemKeThietBiService";
import Pagination from "../../../../components/Pagination";
import { pageSizeSelect } from "../../../../constants/propGlobal";

const DialogNhapKetQuaKiemKe = ({
  visible,
  setVisible,
  bienBanData,
  showToast,
  loadData,
}) => {
  const [dsThietBi, setDsThietBi] = useState([]);
  const [formData, setFormData] = useState({
    bban_id: null,
    noi_dung: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const pagedDevices = useMemo(() => dsThietBi.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize,
  ), [dsThietBi, pageIndex, pageSize]);

  const coThucTeOptions = [
    { label: "Có (Y)", value: "Y" },
    { label: "Không (N)", value: "N" },
  ];

  const tinhTrangOptions = [
    { label: "Tốt", value: "Tốt" },
    { label: "Cần bảo dưỡng", value: "Cần bảo dưỡng" },
    { label: "Hỏng - Cần sửa chữa", value: "Hỏng - Cần sửa chữa" },
    { label: "Chờ thanh lý", value: "Chờ thanh lý" },
  ];

  useEffect(() => {
    if (visible && bienBanData?.id) {
      setFormData({
        bban_id: parseInt(bienBanData.id),
        noi_dung: bienBanData.noi_dung || "",
      });

      const fetchDetail = async () => {
        try {
          setIsLoading(true);
          const list = await kiemKeThietBiService.getthietbi(bienBanData.id);
          setDsThietBi(list || []);
          setPageIndex(1);
        } catch (err) {
          console.error("Lỗi lấy danh sách chi tiết kiểm kê:", err);
          showToast("error", "Không lấy được chi tiết thiết bị kiểm kê!");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    }
    // Chỉ nạp detail khi đổi biên bản/đóng mở dialog; showToast không phải dữ liệu truy vấn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, bienBanData?.id]);

  const handleRowChange = (row, field, value) => {
    setDsThietBi((prev) => prev.map((item) => (
      String(item.id) === String(row.id)
        ? { ...item, [field]: value }
        : item
    )));
  };

  const handleSave = async () => {
    const invalidIndex = dsThietBi.findIndex((item) => (
      !item.co_thuc_te || !String(item.tinh_trang_thucte ?? "").trim()
    ));
    if (invalidIndex >= 0) {
      showToast("error", `Vui lòng nhập đủ Có thực tế và Tình trạng thực tế tại dòng ${invalidIndex + 1}`);
      return;
    }
    try {
      setIsSubmitting(true);
      const reqBody = {
        bban_id: formData.bban_id,
        nguoi_daidien_c3: bienBanData?.nguoi_daidien_c3 || "",
        ten_daidien_c3: bienBanData?.ten_daidien_c3 || "",
        chucvu_daidien_c3: bienBanData?.chucvu_daidien_c3 || "",
        nguoi_daidien_dvi: bienBanData?.nguoi_daidien_dvi || "",
        ten_daidien_dvi: bienBanData?.ten_daidien_dvi || "",
        chucvu_daidien_dvi: bienBanData?.chucvu_daidien_dvi || "",
        noi_dung: formData.noi_dung,
        ds_thietbi: dsThietBi,
      };

      const res = await kiemKeThietBiService.update(reqBody);
      showToast("success", res || "Cập nhật kết quả kiểm kê thành công!");
      if (loadData) loadData();
      setVisible(false);
    } catch (err) {
      showToast("error", err?.response?.data || err?.message || "Lỗi cập nhật kết quả kiểm kê!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      header={`Cập nhật kết quả kiểm kê thực tế (ID ${bienBanData?.id || ""})`}
      visible={visible}
      style={{ width: "98vw", maxWidth: "1850px" }}
      onHide={() => setVisible(false)}
    >
      <div className="p-grid grid mb-3">
        <div className="col-12">
          <InputTextField
            label="Đơn vị sử dụng"
            value={bienBanData?.loai_kiemke === 3
              ? (bienBanData?.ten_phongban_kiemke || bienBanData?.ten_dvi_kiemke || "")
              : (bienBanData?.ten_dvi_kiemke || "")}
            disabled
          />
        </div>
        <div className="col-12 md:col-6">
          <InputTextField
            label="Đại diện Ban kiểm kê / Người ký C1"
            value={`${bienBanData?.ten_daidien_c3 || ""}${bienBanData?.chucvu_daidien_c3 ? ` - ${bienBanData.chucvu_daidien_c3}` : ""}`}
            disabled
          />
        </div>
        <div className="col-12 md:col-6">
          <InputTextField
            label="Đại diện ĐV sử dụng / Người ký C2"
            value={`${bienBanData?.ten_daidien_dvi || ""}${bienBanData?.chucvu_daidien_dvi ? ` - ${bienBanData.chucvu_daidien_dvi}` : ""}`}
            disabled
          />
        </div>
        <div className="col-12">
          <InputTextField
            label="Nội dung kiểm kê"
            value={formData.noi_dung}
            onChange={(e) => setFormData((p) => ({ ...p, noi_dung: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-2">
        <h5 className="font-bold text-base mb-2">Chi tiết đối soát thực tế từng thiết bị:</h5>
        <DataTable
          value={pagedDevices}
          loading={isLoading}
          rows={pageSize}
          dataKey="id"
          stripedRows
          showGridlines
          scrollable
          scrollHeight="450px"
          className="p-datatable-sm"
          emptyMessage="Chưa có dữ liệu thiết bị kiểm kê"
        >
          <Column header="STT" body={(r, opt) => (pageIndex - 1) * pageSize + opt.rowIndex + 1} style={{ width: "50px", textAlign: "center" }} />
          <Column field="ten_thietbi" header="Tên thiết bị" style={{ minWidth: "150px" }} />
          <Column field="no_thietbi" header="Số hiệu" style={{ minWidth: "120px" }} />
          <Column field="ten_chungloai" header="Chủng loại" style={{ minWidth: "120px" }} />
          <Column field="nam_su_dung" header="Năm SD" style={{ width: "80px", textAlign: "center" }} />

          <Column
            header="Dữ liệu hệ thống"
            body={(r) => (
              <div className="text-xs">
                <div><strong>Phòng:</strong> {r.phongban_he_thong || "Chưa có"}</div>
                <div><strong>Người SD:</strong> {r.nguoi_sd_he_thong || "Chưa có"}</div>
                <div><strong>Computer Name:</strong> {r.computer_name_he_thong || "Không áp dụng"}</div>
              </div>
            )}
            style={{ minWidth: "160px" }}
          />

          <Column
            header={<span>Có thực tế <span className="text-red-500">(*)</span></span>}
            body={(r) => (
              <Dropdown
                value={r.co_thuc_te ?? "Y"}
                options={coThucTeOptions}
                onChange={(e) => handleRowChange(r, "co_thuc_te", e.value)}
                className="w-full p-inputtext-sm"
              />
            )}
            style={{ width: "120px" }}
          />

          <Column
            header={<span>Tình trạng thực tế <span className="text-red-500">(*)</span></span>}
            body={(r) => (
              <InputText
                value={r.tinh_trang_thucte ?? ""}
                onChange={(e) => handleRowChange(r, "tinh_trang_thucte", e.target.value)}
                className="w-full p-inputtext-sm"
              />
            )}
            style={{ minWidth: "140px" }}
          />

          <Column
            header="Người SD thực tế"
            body={(r) => (
              <InputText
                value={r.nguoi_sd_thucte || ""}
                onChange={(e) => handleRowChange(r, "nguoi_sd_thucte", e.target.value)}
                className="w-full p-inputtext-sm"
                placeholder="Nhập tên người SD"
              />
            )}
            style={{ minWidth: "140px" }}
          />

          <Column
            header="Computer Name thực tế"
            body={(r) => (
              <InputText
                value={r.computer_name_thucte || ""}
                onChange={(e) => handleRowChange(r, "computer_name_thucte", e.target.value)}
                className="w-full p-inputtext-sm"
                placeholder={r.computer_name_he_thong ? "Nhập tên máy" : "Không áp dụng"}
                disabled={!r.computer_name_he_thong}
              />
            )}
            style={{ minWidth: "140px" }}
          />

          <Column
            header="Ghi chú"
            body={(r) => (
              <InputText
                value={r.ghi_chu_kiemke || ""}
                onChange={(e) => handleRowChange(r, "ghi_chu_kiemke", e.target.value)}
                className="w-full p-inputtext-sm"
                placeholder="Ghi chú"
              />
            )}
            style={{ minWidth: "150px" }}
          />
        </DataTable>
        {dsThietBi.length > 0 && (
          <Pagination
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalRecords={dsThietBi.length}
          />
        )}
      </div>

      <div className="flex justify-content-end gap-2 mt-4">
        <Button
          label="Lưu kết quả"
          icon="pi pi-save"
          severity="primary"
          loading={isSubmitting}
          onClick={handleSave}
        />
        <Button
          label="Hủy bỏ"
          icon="pi pi-times"
          severity="secondary"
          onClick={() => setVisible(false)}
        />
      </div>
    </Dialog>
  );
};

export default DialogNhapKetQuaKiemKe;
