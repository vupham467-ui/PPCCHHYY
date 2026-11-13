import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import { MADV_CTY, pageSizeSelect } from "../../../../constants/propGlobal";
import { storageHelper } from "../../../../utils/storageUtils";
import { get_All_DM_DONVI } from "../../../../services/quantrihethong/DM_DONVIService";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";
import { kiemKeThietBiService } from "../../../../services/quanlythietbi/QLTB_KiemKeThietBiService";
import KiemKeThietBiTable from "./KiemKeThietBiTable";
import DialogFormKiemKe from "./DialogFormKiemKe";
import DialogNhapKetQuaKiemKe from "./DialogNhapKetQuaKiemKe";
import QLTB_BienBanKiemKeViewer from "../../../../components/QLTB/QLTB_BienBanKiemKeViewer";
import { useKiemKePermissions } from "../../../../hooks/useKiemKePermissions";
import { nhomThietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";

const KiemKeThietBiIndex = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY") || MADV_CTY;
  const user = storageHelper.get("user") || {};
  const permissions = useKiemKePermissions();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect || 10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [options, setOptions] = useState({
    id: "",
    loai_kiemke: null,
    ma_dvi_kiemke: "",
    phongban_kiemke_id: "",
    ma_nhom_thietbi: "CNTT",
    trang_thai: null,
    tu_ngay: moment().startOf("month").format("DD/MM/YYYY"),
    den_ngay: moment().format("DD/MM/YYYY"),
  });

  const [dataTable, setDataTable] = useState([]);
  const [donViArr, setDonViArr] = useState([]);
  const [phongBanArr, setPhongBanArr] = useState([]);
  const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Dialog visibility states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditResultDialog, setShowEditResultDialog] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [allowPdfSigning, setAllowPdfSigning] = useState(false);

  // Selected item states
  const [selectedItem, setSelectedItem] = useState(null);

  const toast = useRef(null);

  const showToast = (severity, message) => {
    if (toast.current) {
      const detail = typeof message === "string"
        ? message
        : (message?.message || JSON.stringify(message || "Thao tác không thành công"));
      toast.current.show({ severity, summary: "Thông báo", detail, life: 3000 });
    }
  };

  const trangThaiOptions = [
    { label: "-- Tất cả --", value: null },
    { label: "Chờ ký C1 (Đại diện Ban kiểm kê)", value: 0 },
    { label: "Chờ ký C2 (Đại diện ĐV sử dụng)", value: 1 },
    { label: "Hoàn thành", value: 2 },
  ];

  const loaiKiemKeOptions = [
    { label: "-- Tất cả loại --", value: null },
    { label: "Phòng ban Công ty", value: 3 },
    { label: "Đơn vị cấp 4", value: 4 },
  ];

  const getOptionLabel = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item.ten === "string") return item.ten;
    if (typeof item.ten_dviqly === "string") return item.ten_dviqly;
    if (typeof item.ten_phongban === "string") return item.ten_phongban;
    if (typeof item.label === "string") return item.label;
    return String(item.ma_dviqly || item.value || item.id || "");
  };

  const getOptionValue = (item) => {
    if (!item) return "";
    if (typeof item === "string" || typeof item === "number") return item;
    if (item.phongban_id !== undefined) return String(item.phongban_id);
    if (item.ma_dviqly !== undefined) return String(item.ma_dviqly);
    if (item.id !== undefined) return String(item.id);
    if (item.value !== undefined && typeof item.value !== "object") return String(item.value);
    return "";
  };

  // Lấy toàn bộ đơn vị thuộc phạm vi đơn vị hiện tại, gồm tất cả đơn vị con.
  useEffect(() => {
    const fetchDonVi = async () => {
      try {
        const res = await get_All_DM_DONVI();
        setDonViArr(Array.isArray(res) ? res : (res?.data || []));
      } catch (err) {
        console.error("Lỗi lấy danh sách đơn vị:", err);
        setDonViArr(storageHelper.get("ds_donvi") || []);
      }
    };
    fetchDonVi();
    const fetchNhomThietBi = async () => {
      try {
        const res = await nhomThietBiService.get();
        setNhomThietBiArr(Array.isArray(res) ? res : (res?.data || []));
      } catch (err) {
        console.error("Lỗi lấy danh sách nhóm thiết bị:", err);
      }
    };
    fetchNhomThietBi();
  }, [current_MADVIQLY]);

  // Loại 3 luôn chọn phòng ban Công ty; loại 4 chọn đơn vị cấp 4.
  useEffect(() => {
    const fetchPhongBan = async () => {
      if (options.loai_kiemke !== 3) {
        setPhongBanArr([]);
        return;
      }
      try {
        const res = await getDM_PHONGBANByMA_DVIQLY(MADV_CTY);
        setPhongBanArr(res || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách phòng ban:", err);
      }
    };
    fetchPhongBan();
  }, [options.loai_kiemke]);

  // Load Inventory Table Data
  const loadData = async (isSearch = false) => {
    try {
      setIsLoading(true);
      if (isSearch) {
        setIsSearching(true);
        setPageIndex(1);
      }
      const params = {
        pageIndex: isSearch ? 1 : pageIndex,
        pageSize,
        id: options.id,
        loai_kiemke: options.loai_kiemke,
        ma_dvi_kiemke: options.loai_kiemke === 3 ? MADV_CTY : (options.loai_kiemke === 4 ? options.ma_dvi_kiemke : ""),
        phongban_kiemke_id: options.loai_kiemke === 3 ? options.phongban_kiemke_id : "",
        ma_nhom_thietbi: options.ma_nhom_thietbi,
        trang_thai: options.trang_thai,
        tu_ngay: options.tu_ngay,
        den_ngay: options.den_ngay,
        user: permissions.canViewAll ? "" : (user?.ten_dang_nhap || user?.username),
      };

      const res = await kiemKeThietBiService.get(params);
      setDataTable(res?.data || []);
      setTotalRecords(res?.totalItems || 0);
    } catch (err) {
      console.error("Lỗi lấy danh sách biên bản kiểm kê:", err);
      showToast("error", "Lỗi tải dữ liệu biên bản kiểm kê!");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadData();
    // Bộ lọc chỉ được áp dụng khi bấm Tìm kiếm; phân trang mới tự động tải lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const handleSearch = () => {
    loadData(true);
  };

  const handleViewPdf = (item) => {
    setSelectedItem(item);
    setAllowPdfSigning(false);
    setShowPdfViewer(true);
  };

  const handleSignPdf = (item) => {
    setSelectedItem(item);
    setAllowPdfSigning(true);
    setShowPdfViewer(true);
  };

  const handleEditResult = (item) => {
    setSelectedItem(item);
    setShowEditResultDialog(true);
  };

  const handleDelete = (item) => {
    confirmDialog({
      message: `Bạn có chắc chắn muốn xóa Biên bản kiểm kê #${item.id}?`,
      header: "Xác nhận xóa biên bản",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Xóa",
      rejectLabel: "Hủy",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await kiemKeThietBiService.delete(item.id);
          showToast("success", res || "Xóa biên bản kiểm kê thành công!");
          loadData();
        } catch (err) {
          showToast("error", err?.response?.data || err?.message || "Lỗi xóa biên bản!");
        }
      },
    });
  };

  const handleCancel = (item) => {
    confirmDialog({
      message: `Bạn có chắc chắn muốn hủy Biên bản kiểm kê #${item.id}?`,
      header: "Xác nhận hủy biên bản",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Đồng ý hủy",
      rejectLabel: "Bỏ qua",
      acceptClassName: "p-button-warning",
      accept: async () => {
        try {
          const req = {
            id: parseInt(item.id),
            nguoi_huy: user?.ten_dang_nhap || user?.username,
          };
          const res = await kiemKeThietBiService.cancel(req);
          showToast("success", res || "Hủy biên bản kiểm kê thành công!");
          loadData();
        } catch (err) {
          showToast("error", err?.response?.data || err?.message || "Lỗi hủy biên bản!");
        }
      },
    });
  };

  const getHeaderTemplate = (panelOptions) => {
    const className = `${panelOptions.className} flex flex-wrap align-items-start justify-content-between font-bold`;
    return <div className={className}><span className="w-full md:w-auto">{currentMenu}</span></div>;
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="col-12">
        <div className="card">
          <Panel headerTemplate={getHeaderTemplate({ className: "p-panel-header panel-padding" })} className="card mb-4">
            <div className="grid">
          <div className="col-12 md:col-6 xl:col-4 p-field mb-2">
            <DropdownField
              label="Loại kiểm kê"
              value={options.loai_kiemke}
              options={loaiKiemKeOptions}
              onChange={(e) => setOptions((p) => ({
                ...p,
                loai_kiemke: e.value,
                ma_dvi_kiemke: "",
                phongban_kiemke_id: "",
              }))}
            />
          </div>

          <div className="col-12 md:col-6 xl:col-4 p-field mb-2">
            <DropdownField
              label="Nhóm thiết bị"
              value={options.ma_nhom_thietbi}
              options={nhomThietBiArr}
              optionLabel={(option) => `${option.ten_nhom} (${option.ma_nhom})`}
              optionValue="ma_nhom"
              onChange={(e) => setOptions((p) => ({ ...p, ma_nhom_thietbi: e.value }))}
              filter
              showClear
              placeholder="-- Chọn nhóm thiết bị --"
            />
          </div>

          <div className="col-12 md:col-6 xl:col-4 p-field mb-2">
            <DropdownField
              label="Đơn vị sử dụng"
              value={options.loai_kiemke === 3 ? options.phongban_kiemke_id : options.ma_dvi_kiemke}
              options={options.loai_kiemke === 3
                ? (phongBanArr || []).map((pb) => ({ label: getOptionLabel(pb), value: getOptionValue(pb) }))
                : options.loai_kiemke === 4
                  ? (donViArr || [])
                    .filter((d) => getOptionValue(d) !== MADV_CTY)
                    .map((d) => ({ label: getOptionLabel(d), value: getOptionValue(d) }))
                  : []}
              onChange={(e) => setOptions((p) => options.loai_kiemke === 3
                ? { ...p, phongban_kiemke_id: e.value, ma_dvi_kiemke: "" }
                : { ...p, ma_dvi_kiemke: e.value, phongban_kiemke_id: "" })}
              filter
              showClear
              disabled={!options.loai_kiemke}
              placeholder={options.loai_kiemke === 3
                ? "-- Chọn phòng ban Công ty --"
                : options.loai_kiemke === 4
                  ? "-- Chọn đơn vị cấp 4 --"
                  : "-- Chọn loại kiểm kê trước --"}
            />
          </div>

          <div className="col-12 md:col-6 xl:col-4 p-field mb-2">
            <DropdownField
              label="Trạng thái"
              value={options.trang_thai}
              options={trangThaiOptions}
              onChange={(e) => setOptions((p) => ({ ...p, trang_thai: e.value }))}
            />
          </div>

          <div className="col-12 md:col-4 p-field mb-2">
            <CalendarField
              label="Từ ngày"
              value={options.tu_ngay}
              onChange={(value) => setOptions((p) => ({ ...p, tu_ngay: value }))}
              dateStringFormat="DD/MM/YYYY"
            />
          </div>

          <div className="col-12 md:col-4 p-field mb-2">
            <CalendarField
              label="Đến ngày"
              value={options.den_ngay}
              onChange={(value) => setOptions((p) => ({ ...p, den_ngay: value }))}
              dateStringFormat="DD/MM/YYYY"
            />
          </div>

          <div className="col-12 flex justify-content-center mt-2">
            <Button
              label="Tìm kiếm"
              severity="info"
              loading={isSearching}
              style={{ backgroundColor: "#1445a7", color: "#fff" }}
              onClick={handleSearch}
            />
          </div>
        </div>
      </Panel>

      <KiemKeThietBiTable
        dataTable={dataTable}
        isLoading={isLoading}
        totalRecords={totalRecords}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        loadData={loadData}
        showToast={showToast}
        onCreate={() => setShowCreateDialog(true)}
        onViewPdf={handleViewPdf}
        onSignPdf={handleSignPdf}
        onEditResult={handleEditResult}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      {showCreateDialog && (
        <DialogFormKiemKe
          visible={showCreateDialog}
          setVisible={setShowCreateDialog}
          donViArr={donViArr}
          nhomThietBiArr={nhomThietBiArr}
          showToast={showToast}
          loadData={loadData}
        />
      )}

      {showEditResultDialog && selectedItem && (
        <DialogNhapKetQuaKiemKe
          visible={showEditResultDialog}
          setVisible={setShowEditResultDialog}
          bienBanData={selectedItem}
          showToast={showToast}
          loadData={loadData}
        />
      )}

      {showPdfViewer && selectedItem && (
        <QLTB_BienBanKiemKeViewer
          visible={showPdfViewer}
          dataBienBan={selectedItem}
          handleCloseModalViewer={() => {
            setShowPdfViewer(false);
            setAllowPdfSigning(false);
          }}
          showToast={showToast}
          loadData={loadData}
          showSignBtn={allowPdfSigning}
        />
      )}
        </div>
      </div>
    </div>
  );
};

export default KiemKeThietBiIndex;
