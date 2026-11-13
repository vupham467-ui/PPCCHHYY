//Bật tìm kiếm và sort cho header table
export const propSortAndFilter = {
  filterMatchMode: "contains", // Tìm kiếm gần đúng
  // filter: true,                 // Bật bộ lọc
  filterPlaceholder: "Nhập thông tin", // Placeholder cho bộ lọc
  showFilterMenuOptions: false, // Ẩn các tùy chọn trong menu bộ lọc
  className: "custom-column", // Thêm className tùy chỉnh cho column này
  sortable: true, // Bật tính năng sắp xếp cột
};

export const scrollTableHeight = "500px";
export const headerStyleColumn = { backgroundColor: "#1445a7", color: "#fff" };

export const idP6 = "91dce7ab-1d09-4b3f-aaf2-81be2fef3db9"; //ID P6
export const idP10 = "092ceaa7-a04d-481f-9856-6e3a6de53ce7" //ID P10

export const tinhTrangBanGiaoDefaults = {
  "chi": "Đúng quy cách, đủ số lượng và đảm bảo chất lượng",
  "kim": "Tình trạng sử dụng tốt, chắc chắn và đảm bảo chất lượng",
};

export const arrMaKim = [
  { label: "Kìm 1 pha", value: 1 },
  { label: "Kìm 3 pha", value: 3 },
  { label: "Kìm chung", value: 13 },
  { label: "Kìm chuyên dùng", value: 4 },
  { label: "Kìm công cộng", value: 5 },
];

//Màu cho các nút hàng động:
export const btnActionColors = {
  edit: "#1445a7",
  sign: "#1445a7",
  view: "#485479",
  delete: "#dc3545",
  destroy: "#dc3545",
  return: "#007bff",
  accounting: "#007bff",
};

export const MADV_TND = "PA23TND";
export const MADV_CTY = "PA23";
export const PMIS_DEFAULT_SERVER = "PMIS";

//nhóm biên bản truyền vào để lấy file pdf:
export const nhomBienBanPDF = {
  kimC3: "kimC3",
  temchiC3: "temchiC3",
  kimC4: "kimC4",
  temchiC4: "temchiC4",
  quyettoanC3: "quyettoanC3",
};

//Loại biên bản bàn giao:
export const arrLoaiBienBan = [
  { label: "Bàn giao", value: 0 },
  { label: "Thu hồi", value: 1 },
];

//Các trạng thái và loại của biên bản tem chì C4:
export const mockData = {
  arrTrangThai: [
    { label: "Đang chờ duyệt", value: 0 },
    { label: "Đã ký giao", value: 1 },
    { label: "Đã ký nhận", value: 2 },
    // { label: "Bị hủy", value: 3 },
  ],
  arrTrangThaiQT: [
    { label: "Đang chờ duyệt", value: 0 },
    { label: "Người QT đã ký", value: 1 },
    { label: "Quản lý đã ký", value: 2 },
    { label: "Trưởng DV đã ký", value: 3 },
  ],
  arrLoaiBienBan: [
    { name: "-Chọn loại biên bản-", id: 0 },
    { name: "Phiếu mượn", id: 1 },
    { name: "Phiếu trả", id: 2 },
    // { name: "Phiếu quyết toán", id: 3 },
  ],
  arrLoai: [
    { id: "Chì", name: "Chì" },
    { id: "Tem", name: "Tem" },
  ],

  arrLoaiKim: [
    { label: "Tất cả", value: -1 },
    { label: "Kìm 1 pha", value: 1 },
    { label: "Kìm 3 pha", value: 3 },
    { label: "Kìm chung", value: 13 },
    { label: "Kìm chuyên dùng", value: 4 },
    { label: "Kìm công cộng", value: 5 },
  ],

  baoCaoCTKim: [
    { label: "Tất cả", value: -1 },
    { label: "Đang sử dụng", value: 1 },
    { label: "Trong kho", value: 0 },
  ],

  baoCaoQTChi: [
    { label: "-- Tất cả --", value: -1 },
    { label: "Chưa QT", value: 0 },
    { label: "Đã QT", value: 1 },
    { label: "Chưa ký đủ", value: 2 },
  ],
};

//Thiết lập chọn số lượng bản ghi trong phân trang;
// export const rowsPerPages = [10, 25, 50, 100];
export const rowsPagination = [25, 50, 100, 200, 500, 1000];
export const rowsPerPages = rowsPagination.map((num) => ({
  label: num.toString(),
  value: num,
}));
export const pageSizeSelect = 25;

//SignInfoState:
export const signInfoState = [
  {
    status: "Ký cấp 1",
    user: "",
    date: "",
    avatarUrl: "",
  },
  {
    status: "Ký cấp 2",
    user: "",
    date: "",
    avatarUrl: "",
  },
];

//SignInfoQTState:
export const signInfoQTState = [
  {
    status: "Ký cấp 1",
    user: "",
    date: "",
    avatarUrl: "",
  },
  {
    status: "Ký cấp 2",
    user: "",
    date: "",
    avatarUrl: "",
  },
  {
    status: "Ký cấp 3",
    user: "",
    date: "",
    avatarUrl: "",
  },
];

//Danh mục lý do thay đo đếm niêm phong:
export const arrLyDoThayDo = [
  { id: "Thay định kỳ", name: "Thay định kỳ" },
  { id: "Phát triển mới", name: "Phát triển mới" },
  {
    id: "Thay hòm công tơ, chỉnh trang 5S",
    name: "Thay hòm công tơ, chỉnh trang 5S",
  },
  {
    id: "Thay cháy hỏng (hỏng màn hình, không hoạt động, bị cháy...)",
    name: "Thay cháy hỏng (hỏng màn hình, không hoạt động, bị cháy...)",
  },
  { id: "Thanh lý đo đếm", name: "Thanh lý đo đếm" },
  { id: "Nâng công suất đo đếm", name: "Nâng công suất đo đếm" },
  {
    id: "Niêm phong phương tiện đo sau kiểm định đạt",
    name: "Niêm phong phương tiện đo sau kiểm định đạt",
  },
  { id: "Lý do khác", name: "Lý do khác" },
];

//Danh mục vai trò:
export const arrVaiTroData = [
  { id: "ADMIN", name: "Admin" },
  { id: "ADMIN_DL", name: "Admin đơn vị C4" },
  { id: "LDP6", name: "Lãnh đạo P6" },
  { id: "QLP6", name: "Quản lý kìm, chì P6" },
  { id: "LDC4", name: "Lãnh đạo đơn vị C4" },
  { id: "QLC4", name: "Quản lý kìm, chì đơn vị C4" },
  { id: "NVTT", name: "Nhân viên treo tháo/niêm phong" },
  { id: "QLTB_QLP10", name: "Quản lý thiết bị P10" },
  { id: "QLTB_QLC4", name: "Quản lý thiết bị đơn vị cấp 4" },
  { id: "OTHER", name: "Khác" },
];

//Danh mục lựa chọn loại Phương tiện đo, niêm phong TND:
export const arrLoaiPhuongTienTND = [
  { id: "Công tơ điện tử 1 pha", name: "Công tơ điện tử 1 pha" },
  { id: "Công tơ cơ khí 1 pha", name: "Công tơ cơ khí 1 pha" },
  { id: "Công tơ điện tử 3 pha", name: "Công tơ điện tử 3 pha" },
  {
    id: "Công tơ điện tử 3 pha (DTS27 10(100))",
    name: "Công tơ điện tử 3 pha (DTS27 10(100))",
  },
  { id: "TI hạ thế", name: "TI hạ thế" },
  { id: "TI trung thế; TU trung thế", name: "TI trung thế; TU trung thế" },
];

//QLVH:
export const GhiChuArr = ["Dữ liệu đến ngày", "Đèn vật lý báo lỗi"];

export const trangThaiPhieuTruc = [
  { label: "Khởi tạo", value: 0 },
  { label: "Đã ký", value: 1 },
];

export const CoSoArr = [
  { value: 1, label: "Cơ sở 1" },
  { value: 2, label: "Cơ sở 2" },
];

export const signInfoStateQLVH = [
  {
    status: "Ký số",
    user: "",
    date: "",
    avatarUrl: "",
  },
];

//QLTB:
export const QLTB_LoaiGiaoNhanArr = [
  { loai_nghiepvu: "BGC3", label: "Bàn giao cho phòng ban công ty" },
  { loai_nghiepvu: "BGC4", label: "Bàn giao cho đơn vị cấp 4" },
];

export const QLTB_LoaiThuHoiArr = [
  { loai_nghiepvu: "THC3", label: "Thu hồi từ phòng ban công ty" },
  { loai_nghiepvu: "THC4", label: "Trả lại từ đơn vị cấp 4" },
];

export const trangThaiDongBoArr = [
  { value: 0, label: "Chưa cập nhật", bg: "#e6f0ff", color: "#000" },
  { value: 1, label: "Đã cập nhật", bg: "#1445a7", color: "#fff" },
  { value: 2, label: "Đã đồng bộ", bg: "#00bc2a", color: "#fff" },
  { value: 9, label: "Đồng bộ lỗi", bg: "#ff0000", color: "#fff" }
];

export const arrTinhTrangThietBi = [
  "Hỏng main, hỏng nguồn, bật không lên",
  "Tình trạng khác"
];
