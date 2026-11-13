import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { storageHelper } from "../../../../utils/storageUtils";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import { kiemKeThietBiService } from "../../../../services/quanlythietbi/QLTB_KiemKeThietBiService";
import { MADV_CTY, pageSizeSelect } from "../../../../constants/propGlobal";
import { MenuContext } from "../../../../layout/context/menucontext";
import Pagination from "../../../../components/Pagination";

const emptyForm = {
  loai_kiemke: null, ma_dvi_kiemke: "", dm_donvi_kiemke_id: "", phongban_kiemke_id: "",
  ma_nhom_thietbi: "CNTT", ten_nhom_thietbi: "",
  nguoi_daidien_c3: "", ten_daidien_c3: "", chucvu_daidien_c3: "",
  nguoi_daidien_dvi: "", ten_daidien_dvi: "", chucvu_daidien_dvi: "",
  noi_dung: "Biên bản kiểm kê thực tế thiết bị",
};

const getValue = (item, keys) => {
  for (const key of keys) if (item?.[key] !== undefined && item?.[key] !== null) return String(item[key]);
  return "";
};

const mapUser = (u) => {
  const value = getValue(u, ["teN_DANG_NHAP", "ten_dang_nhap", "username"]);
  const fullName = getValue(u, ["hO_TEN", "ho_ten"]) || value;
  const chucVu = getValue(u, ["teN_CHUCVU", "ten_chucvu"]);
  return { label: `${fullName}${chucVu ? ` - ${chucVu}` : ""} (${value})`, value, fullName, chucVu };
};

const onlyLeaders = (users) => {
  return users.filter((u) => /(TRƯỞNG|PHÓ|GIÁM ĐỐC|PHỤ TRÁCH|PHU TRACH)/i.test(u.chucVu || ""));
};

const DialogFormKiemKe = ({ visible, setVisible, donViArr = [], nhomThietBiArr = [], showToast, loadData }) => {
  const user = storageHelper.get("user") || {};
  const [formData, setFormData] = useState(emptyForm);
  const [phongBanArr, setPhongBanArr] = useState([]);
  const [usersC3Arr, setUsersC3Arr] = useState([]);
  const [usersDviArr, setUsersDviArr] = useState([]);
  const [creator, setCreator] = useState({
    username: user?.ten_dang_nhap || user?.username || "",
    fullName: user?.ho_ten || user?.ten_dang_nhap || user?.username || "",
    chucVu: user?.ten_chucvu || user?.chuc_vu || "",
  });
  const [preview, setPreview] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewPageIndex, setPreviewPageIndex] = useState(1);
  const [previewPageSize, setPreviewPageSize] = useState(pageSizeSelect);
  const { refreshWaitSign } = useContext(MenuContext);

  const phongBanOptions = useMemo(() => phongBanArr.map((p) => ({
    label: getValue(p, ["ten_phongban", "ten", "label"]), value: getValue(p, ["phongban_id", "id", "value"]),
  })), [phongBanArr]);
  const donViOptions = useMemo(() => donViArr
    .map((d) => ({
      label: getValue(d, ["ten_dviqly", "ten", "label"]), value: getValue(d, ["ma_dviqly", "value"]),
      dmDonViId: getValue(d, ["dm_donvi_id", "id"]),
    }))
    .filter((d) => d.value && d.value !== MADV_CTY), [donViArr]);
  const nhomThietBiOptions = useMemo(() => nhomThietBiArr.map((n) => ({
    label: `${getValue(n, ["ten_nhom"])} (${getValue(n, ["ma_nhom"])})`,
    value: getValue(n, ["ma_nhom"]),
    tenNhom: getValue(n, ["ten_nhom"]),
  })).filter((n) => n.value), [nhomThietBiArr]);
  const previewPageData = useMemo(() => preview.slice(
    (previewPageIndex - 1) * previewPageSize,
    previewPageIndex * previewPageSize,
  ), [preview, previewPageIndex, previewPageSize]);

  useEffect(() => {
    if (visible) { setFormData({ ...emptyForm }); setPreview([]); setPreviewPageIndex(1); }
  }, [visible]);

  useEffect(() => {
    const loadCreator = async () => {
      const username = user?.ten_dang_nhap || user?.username || "";
      if (!visible || !username) return;
      try {
        const response = await HT_NGUOIDUNG_Service.getByUsername(username);
        const info = Array.isArray(response) ? response[0] : (response?.data || response);
        const mapped = mapUser(info || {});
        setCreator({ username, fullName: mapped.fullName || user?.ho_ten || username, chucVu: mapped.chucVu || user?.ten_chucvu || user?.chuc_vu || "" });
      } catch (err) {
        setCreator({ username, fullName: user?.ho_ten || username, chucVu: user?.ten_chucvu || user?.chuc_vu || "" });
      }
    };
    loadCreator();
  }, [visible, user?.ten_dang_nhap, user?.username, user?.ho_ten, user?.ten_chucvu, user?.chuc_vu]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
          ma_dviqly: MADV_CTY, db_maphongban: user?.dm_phongban_id || "",
        });
        setUsersC3Arr(onlyLeaders((data || []).map(mapUser).filter((x) => x.value)));
      } catch (err) { console.error("Lỗi lấy lãnh đạo phòng CNTTCĐS:", err); }
    };
    load();
  }, [user?.dm_phongban_id]);

  useEffect(() => {
    const load = async () => {
      if (formData.loai_kiemke !== 3) return setPhongBanArr([]);
      try { setPhongBanArr((await getDM_PHONGBANByMA_DVIQLY(MADV_CTY)) || []); }
      catch (err) { console.error("Lỗi lấy phòng ban Công ty:", err); }
    };
    load();
  }, [formData.loai_kiemke]);

  useEffect(() => {
    const load = async () => {
      const ready = (formData.loai_kiemke === 3 && formData.phongban_kiemke_id)
        || (formData.loai_kiemke === 4 && formData.ma_dvi_kiemke);
      if (!ready) return setUsersDviArr([]);
      try {
        const data = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
          ma_dviqly: formData.loai_kiemke === 3 ? MADV_CTY : formData.ma_dvi_kiemke,
          db_maphongban: formData.loai_kiemke === 3 ? formData.phongban_kiemke_id : "",
        });
        setUsersDviArr(onlyLeaders((data || []).map(mapUser).filter((x) => x.value)));
      } catch (err) { console.error("Lỗi lấy lãnh đạo đơn vị kiểm kê:", err); }
    };
    load();
  }, [formData.loai_kiemke, formData.ma_dvi_kiemke, formData.phongban_kiemke_id]);

  useEffect(() => {
    const load = async () => {
      const ready = formData.loai_kiemke === 3 ? formData.phongban_kiemke_id : formData.loai_kiemke === 4 && formData.ma_dvi_kiemke;
      if (!visible || !ready) return setPreview([]);
      try {
        setLoadingPreview(true);
        setPreviewPageIndex(1);
        setPreview((await kiemKeThietBiService.preview_thietbi({
          loai_kiemke: formData.loai_kiemke,
          ma_dviqly: formData.loai_kiemke === 3 ? MADV_CTY : formData.ma_dvi_kiemke,
          phongban_id: formData.loai_kiemke === 3 ? formData.phongban_kiemke_id : "",
          ma_nhom_thietbi: formData.ma_nhom_thietbi,
        })) || []);
      } catch (err) { setPreview([]); showToast("error", "Không lấy được danh sách thiết bị xem trước"); }
      finally { setLoadingPreview(false); }
    };
    load();
    // Chỉ tải lại preview khi đối tượng kiểm kê thay đổi; showToast không tham gia điều kiện truy vấn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, formData.loai_kiemke, formData.ma_dvi_kiemke, formData.phongban_kiemke_id, formData.ma_nhom_thietbi]);

  const chooseSigner = (field, value, source) => {
    const selected = source.find((x) => x.value === value);
    const suffix = field === "nguoi_daidien_c3" ? "daidien_c3" : "daidien_dvi";
    setFormData((p) => ({ ...p, [field]: value, [`ten_${suffix}`]: selected?.fullName || "", [`chucvu_${suffix}`]: selected?.chucVu || "" }));
  };

  const changeType = (value) => setFormData((p) => ({ ...p, loai_kiemke: value,
    ma_dvi_kiemke: value === 3 ? MADV_CTY : "", dm_donvi_kiemke_id: "", phongban_kiemke_id: "",
    nguoi_daidien_dvi: "", ten_daidien_dvi: "", chucvu_daidien_dvi: "",
  }));

  const submit = async () => {
    if (!formData.loai_kiemke) return showToast("error", "Vui lòng chọn loại kiểm kê");
    if (!formData.ma_nhom_thietbi) return showToast("error", "Vui lòng chọn nhóm thiết bị");
    if (formData.loai_kiemke === 3 && !formData.phongban_kiemke_id) return showToast("error", "Vui lòng chọn phòng ban được kiểm kê");
    if (formData.loai_kiemke === 4 && !formData.ma_dvi_kiemke) return showToast("error", "Vui lòng chọn đơn vị cấp 4 được kiểm kê");
    if (!formData.nguoi_daidien_c3 || !formData.nguoi_daidien_dvi) return showToast("error", "Vui lòng chọn đủ người ký C1 và C2");
    if (!preview.length) return showToast("error", "Đối tượng đã chọn không có thiết bị đang sử dụng để kiểm kê");
    const pb = phongBanOptions.find((x) => x.value === formData.phongban_kiemke_id);
    const dvi = donViOptions.find((x) => x.value === formData.ma_dvi_kiemke);
    const nhom = nhomThietBiOptions.find((x) => x.value === formData.ma_nhom_thietbi);
    const username = creator.username;
    try {
      setSubmitting(true);
      const tenDonViSuDung = formData.loai_kiemke === 3
        ? (pb?.label || "")
        : (dvi?.label || formData.ma_dvi_kiemke);
      const result = await kiemKeThietBiService.insert({ ...formData,
        ten_nhom_thietbi: nhom?.tenNhom || nhom?.label || formData.ma_nhom_thietbi,
        ten_dvi_kiemke: tenDonViSuDung,
        ten_phongban_kiemke: formData.loai_kiemke === 3 ? (pb?.label || "") : "",
        nguoi_tao: username, ten_nguoi_tao: creator.fullName,
        chucvu_nguoi_tao: creator.chucVu || "Cán bộ quản lý thiết bị",
      });
      showToast("success", result || "Tạo biên bản kiểm kê thành công");
      if (refreshWaitSign) await refreshWaitSign(username);
      if (loadData) loadData();
      setVisible(false);
    } catch (err) { showToast("error", err?.response?.data || err?.message || "Lỗi tạo biên bản kiểm kê"); }
    finally { setSubmitting(false); }
  };

  return <Dialog header="Tạo biên bản kiểm kê thiết bị" visible={visible} style={{ width: "98vw", maxWidth: "1850px" }} onHide={() => setVisible(false)}>
    <div className="grid p-fluid">
      <div className="col-12 lg:col-6 xl:col-3 mb-3"><DropdownField label="Loại kiểm kê" required value={formData.loai_kiemke} options={[{ label: "Phòng ban Công ty", value: 3 }, { label: "Đơn vị cấp 4", value: 4 }]} onChange={(e) => changeType(e.value)} placeholder="-- Chọn loại kiểm kê --" /></div>
      <div className="col-12 lg:col-6 xl:col-3 mb-3"><DropdownField label="Nhóm thiết bị" required value={formData.ma_nhom_thietbi} options={nhomThietBiOptions} onChange={(e) => setFormData((p) => ({ ...p, ma_nhom_thietbi: e.value }))} filter placeholder="-- Chọn nhóm thiết bị --" /></div>
      <div className="col-12 lg:col-6 xl:col-3 mb-3"><InputTextField label="Người tạo" value={`${creator.username} - ${creator.fullName}`} disabled /></div>
      <div className="col-12 lg:col-6 xl:col-3 mb-3"><DropdownField label="Đại diện Ban kiểm kê / Người ký C1" required value={formData.nguoi_daidien_c3} options={usersC3Arr} onChange={(e) => chooseSigner("nguoi_daidien_c3", e.value, usersC3Arr)} filter placeholder="-- Chọn lãnh đạo CNTTCĐS --" /></div>
      {formData.loai_kiemke === 3 && <div className="col-12 lg:col-3 mb-3"><DropdownField label="Đơn vị sử dụng" required value={formData.phongban_kiemke_id} options={phongBanOptions} onChange={(e) => setFormData((p) => ({ ...p, phongban_kiemke_id: e.value, nguoi_daidien_dvi: "", ten_daidien_dvi: "", chucvu_daidien_dvi: "" }))} filter placeholder="-- Chọn phòng ban Công ty --" /></div>}
      {formData.loai_kiemke === 4 && <div className="col-12 lg:col-3 mb-3"><DropdownField label="Đơn vị sử dụng" required value={formData.ma_dvi_kiemke} options={donViOptions} onChange={(e) => { const d = donViOptions.find((x) => x.value === e.value); setFormData((p) => ({ ...p, ma_dvi_kiemke: e.value, dm_donvi_kiemke_id: d?.dmDonViId || "", nguoi_daidien_dvi: "", ten_daidien_dvi: "", chucvu_daidien_dvi: "" })); }} filter placeholder="-- Chọn đơn vị cấp 4 --" /></div>}
      {formData.loai_kiemke && <div className="col-12 lg:col-3 mb-3"><DropdownField label="Đại diện ĐV sử dụng / Người ký C2" required value={formData.nguoi_daidien_dvi} options={usersDviArr} onChange={(e) => chooseSigner("nguoi_daidien_dvi", e.value, usersDviArr)} filter placeholder="-- Chọn lãnh đạo đơn vị --" /></div>}
      <div className="col-12 lg:col-6 mb-3"><InputTextField label="Nội dung kiểm kê" value={formData.noi_dung} onChange={(e) => setFormData((p) => ({ ...p, noi_dung: e.target.value }))} /></div>
    </div>
    <div className="surface-100 border-round p-3 mb-3 text-sm">
      <div className="font-bold mb-1">Kết quả kiểm kê được khởi tạo cùng lúc tạo phiếu</div>
      <div>Tất cả thiết bị được mặc định Có thực tế = Y, Tình trạng = Tốt; người sử dụng và Computer Name thực tế lấy theo dữ liệu hệ thống. Sau khi tạo phiếu, chỉ cần cập nhật các trường hợp ngoại lệ.</div>
    </div>
    <h5 className="mb-2">Danh sách thiết bị và kết quả khởi tạo ({preview.length})</h5>
    <DataTable value={previewPageData} loading={loadingPreview} stripedRows showGridlines scrollable scrollHeight="450px" emptyMessage="Chọn đối tượng kiểm kê để xem trước thiết bị">
      <Column header="STT" body={(_, o) => (previewPageIndex - 1) * previewPageSize + o.rowIndex + 1} style={{ width: "5rem" }} /><Column field="ten_thietbi" header="Tên thiết bị" style={{ minWidth: "16rem" }} /><Column field="no_thietbi" header="Số hiệu" style={{ minWidth: "10rem" }} />
      <Column field="ten_chungloai" header="Chủng loại" style={{ minWidth: "14rem" }} /><Column field="nam_su_dung" header="Năm SD" style={{ minWidth: "7rem" }} /><Column field="phongban_he_thong" header="Phòng ban hệ thống" style={{ minWidth: "14rem" }} />
      <Column field="nguoi_sd_he_thong" header="Người SD hệ thống" /><Column field="computer_name_he_thong" header="Computer Name hệ thống" />
      <Column header="Có thực tế" body={() => <Tag severity="success" value="Có (Y)" />} style={{ minWidth: "7rem", textAlign: "center" }} />
      <Column header="Tình trạng thực tế" body={() => "Tốt"} style={{ minWidth: "9rem" }} />
      <Column field="nguoi_sd_thucte" header="Người SD thực tế" style={{ minWidth: "10rem" }} />
      <Column field="computer_name_thucte" header="Computer Name thực tế" style={{ minWidth: "11rem" }} />
    </DataTable>
    {preview.length > 0 && <Pagination pageIndex={previewPageIndex} setPageIndex={setPreviewPageIndex} pageSize={previewPageSize} setPageSize={setPreviewPageSize} totalRecords={preview.length} />}
    <div className="flex justify-content-end gap-2 mt-4"><Button label="Tạo biên bản" icon="pi pi-check" loading={submitting} onClick={submit} /><Button label="Đóng" icon="pi pi-times" severity="secondary" onClick={() => setVisible(false)} /></div>
  </Dialog>;
};

export default DialogFormKiemKe;
