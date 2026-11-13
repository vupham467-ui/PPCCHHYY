# Báo cáo Phân tích Kỹ thuật Chi tiết Module Quản lý Thiết bị (QLTB)

> [!NOTE]
> Báo cáo được lập dựa trên việc đối chiếu và xác minh trực tiếp 100% từ source code Frontend (`PCHY_QLTB_FRONTEND`), Backend (`QLTB_API`), và PL/SQL Package (`sql_quanlythietbi/spec_PKG_HIEUCT.sql`, `body_PKG_HIEUCT.sql`).

---

## 1. Mapping chi tiết Frontend → Backend → Oracle PL/SQL

| Nghiệp vụ | Page / Component | Service JS | API Endpoint | Controller / Method | Manager / Method | Procedure PL/SQL | Bảng tác động chính |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Danh mục thiết bị (Search/Paging)** | `quanlychung/dm_thietbi` | `QLTB_DANH_MUC_Service.get_TBI_DM_THIETBI_CNTT_V2` | `GET /APIPCHY/QLTB_DANH_MUC/thietbi_cntt/get_v2` | `QLTB_DANH_MUCController.get_TBI_DM_THIETBI_CNTT_V2` | `QLTB_DANH_MUC_Manager.get_TBI_DM_THIETBI_CNTT_V2` | `get_TBI_DM_THIETBI_CNTT_V2` | `TBI_DM_THIETBI_CNTT` |
| **Tạo mới thiết bị** | `DialogForm.js` | `QLTB_DANH_MUC_Service.insert_TBI_DM_THIETBI_CNTT` | `POST /APIPCHY/QLTB_DANH_MUC/thietbi_cntt/insert` | `QLTB_DANH_MUCController.insert_TBI_DM_THIETBI_CNTT` | `QLTB_DANH_MUC_Manager.insert_TBI_DM_THIETBI_CNTT` | `insert_TBI_DM_THIETBI_CNTT` | `TBI_DM_THIETBI_CNTT` |
| **Duyệt thiết bị mới** | `quanlycap3/duyetmokhoa` | `QLTB_DuyetMoKhoaTBService.update_DUYET_TBIMOI_MULTI` | `POST /APIPCHY/QLTB_DuyetMoKhoaTB/duyet_tbmoi_multi` | `QLTB_DuyetMoKhoaTBController.update_DUYET_TBIMOI_MULTI` | `QLTB_DuyetMoKhoaTB_Manager.update_DUYET_TBIMOI_MULTI` | `update_DUYET_TBIMOI_MULTI` | `TBI_DM_THIETBI_CNTT`, `TBI_KIEMTRA_CNTT` |
| **Đăng ký mở khóa** | `quanlycap4/dangkymokhoa` | `QLTB_DangKyMoKhoaTBService.INSERT_DKMOKHOA_MULTI` | `POST /APIPCHY/QLTB_DangKyMoKhoaTB/insert_multi` | `QLTB_DangKyMoKhoaTBController.INSERT_DKMOKHOA_MULTI` | `QLTB_DangKyMoKhoaTB_Manager.INSERT_DKMOKHOA_MULTI` | `INSERT_DKMOKHOA_MULTI` | `TBI_TB_CNTT_MOKHOA` |
| **Duyệt mở khóa** | `quanlycap3/duyetmokhoa` | `QLTB_DuyetMoKhoaTBService.UPDATE_MOKHOA_MULTI` | `POST /APIPCHY/QLTB_DuyetMoKhoaTB/update_multi` | `QLTB_DuyetMoKhoaTBController.UPDATE_MOKHOA_MULTI` | `QLTB_DuyetMoKhoaTB_Manager.UPDATE_MOKHOA_MULTI` | `UPDATE_MOKHOA_MULTI` | `TBI_TB_CNTT_MOKHOA` |
| **Kiểm tra thiết bị** | `quanlycap3/kiemtrathietbi` | `QLTB_KiemTraTBService.INSERT_KIEMTRATB_CNTT_MULTI` | `POST /APIPCHY/QLTB_KiemTraTB/insert_multi` | `QLTB_KiemTraTBController.INSERT_KIEMTRATB_CNTT_MULTI` | `QLTB_KiemTraTB_Manager.INSERT_KIEMTRATB_CNTT_MULTI` | `INSERT_KIEMTRATB_CNTT_MULTI` | `TBI_KIEMTRA_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Bàn giao C3 (`BGC3`)** | `quanlychung/giaonhanthietbi` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | `INSERT_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Bàn giao C4 (`BGC4`)** | `quanlychung/giaonhanthietbi` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | `INSERT_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **BG người dùng (`BGSD`)** | `quanlycap4/giaonhanthietbi` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | `INSERT_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Thu hồi C3 (`THC3`)** | `quanlychung/thuhoithietbi` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | `INSERT_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Thu hồi C4/NSD (`THSD`)** | `quanlycap4/thuhoithietbi` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | `INSERT_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Trả lại C4 (`THC4`)** | `quanlychung/tralaithietbiC4` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | `INSERT_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Đề nghị thanh lý (`TLC3/TLC4`)** | `quanlychung/thanhlythietbi` | `QLTB_GiaoNhanThietBi.INSERT_BBAN_KIEMTRA_TBI_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert_bbkiemtrathanhly` | `QLTB_GiaoNhanThietBiController.INSERT_BBAN_KIEMTRA_TBI_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_KIEMTRA_TBI_CNTT` | `INSERT_BBAN_KIEMTRA_TBI_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Ký C1** | `SignaturePDFViewer.js` | `pdfService.js` | `POST /APIPCHY/API_PDF/KyPhieu` | `API_PDFController.SignPdf` | `PdfSignService.SignPdf` | `ky_so_C1_GIAONHAN_THIETBI` | `TBI_BBAN_GIAONHAN_CNTT` |
| **Ký C2** | `SignaturePDFViewer.js` | `pdfService.js` | `POST /APIPCHY/API_PDF/KyPhieu` | `API_PDFController.SignPdf` | `PdfSignService.SignPdf` | `ky_so_C2_GIAONHAN_THIETBI` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Hủy biên bản** | Viewer Components | `QLTB_GiaoNhanThietBi.HUY_BBAN_GIAONHAN_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/cancel` | `QLTB_GiaoNhanThietBiController.HUY_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.HUY_BBAN_GIAONHAN_CNTT` | `HUY_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Xóa biên bản** | Viewer Components | `QLTB_GiaoNhanThietBi.DELETE_BBAN_GIAONHAN_CNTT` | `DELETE /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/delete/{id}` | `QLTB_GiaoNhanThietBiController.DELETE_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.DELETE_BBAN_GIAONHAN_CNTT` | `DELETE_BBAN_GIAONHAN_CNTT` | `TBI_BBAN_GIAONHAN_CNTT`, `TBI_TB_GIAONHAN_CNTT`, `TBI_DM_THIETBI_CNTT` |
| **Kiểm kê thực tế CNTT (Tạo mới)** | `quanlychung/kiemkethietbi` | `QLTB_KiemKeThietBiService.insert` | `POST /APIPCHY/QLTB_KiemKeThietBi/kiemkethietbi/insert` | `QLTB_KiemKeThietBiController.INSERT_BBAN_KIEMKE_CNTT` | `QLTB_KiemKeThietBi_Manager.INSERT_BBAN_KIEMKE_CNTT` | `INSERT_BBAN_KIEMKE_CNTT` | `TBI_BBAN_KIEMKE_CNTT`, `TBI_TB_KIEMKE_CNTT` |
| **Kiểm kê thực tế CNTT (Cập nhật đối soát)** | `DialogNhapKetQuaKiemKe.js` | `QLTB_KiemKeThietBiService.update` | `PUT /APIPCHY/QLTB_KiemKeThietBi/kiemkethietbi/update` | `QLTB_KiemKeThietBiController.UPDATE_BBAN_KIEMKE_CNTT` | `QLTB_KiemKeThietBi_Manager.UPDATE_BBAN_KIEMKE_CNTT` | `UPDATE_BBAN_KIEMKE_CNTT` | `TBI_BBAN_KIEMKE_CNTT`, `TBI_TB_KIEMKE_CNTT` |
| **Kiểm kê thực tế CNTT (Ký C1 - Đại diện C3)** | `QLTB_BienBanKiemKeViewer.js` | `pdfUtils.QLTB_signPdf` | `POST /APIPCHY/PDF/QLTB_sign` | `PDFController.QLTB_SignPdf` | `PdfSignService.QLTB_SignAsync` | `KY_C1_BBAN_KIEMKE_CNTT` | `TBI_BBAN_KIEMKE_CNTT` |
| **Kiểm kê thực tế CNTT (Ký C2 - Đại diện Đơn vị)** | `QLTB_BienBanKiemKeViewer.js` | `pdfUtils.QLTB_signPdf` | `POST /APIPCHY/PDF/QLTB_sign` | `PDFController.QLTB_SignPdf` | `PdfSignService.QLTB_SignAsync` | `KY_C2_BBAN_KIEMKE_CNTT` | `TBI_BBAN_KIEMKE_CNTT` |
| **Bổ sung hồ sơ thanh lý** | `DialogFormThietBiThanhLy.js` | `QLTB_GiaoNhanThietBi.INSERT_THONGTIN_DUYETTHANHLY` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/insert_thongtin_duyetthanhly` | `QLTB_GiaoNhanThietBiController.INSERT_THONGTIN_DUYETTHANHLY` | `QLTB_GiaoNhanThietBi_Manager.INSERT_THONGTIN_DUYETTHANHLY` | `INSERT_THONGTIN_DUYETTHANHLY` | `TBI_BB_XACNHAN_THANHLY_C4` |
| **Duyệt thanh lý** | `QLTB_ButtonOptionThanhLy.js` | `QLTB_GiaoNhanThietBi.DUYET_THANH_LY_CNTT` | `POST /APIPCHY/QLTB_GiaoNhanThietBi/giaonhanthietbi/duyet_thanhly` | `QLTB_GiaoNhanThietBiController.DUYET_THANH_LY_CNTT` | `QLTB_GiaoNhanThietBi_Manager.DUYET_THANH_LY_CNTT` | `DUYET_THANH_LY_CNTT` | `TBI_BB_XACNHAN_THANHLY_C4`, `TBI_DM_THIETBI_CNTT` |

---

## 2. Bảng mapping LOAI_BBAN và LOAI_NGHIEPVU thực tế

> Nguồn kiểm tra: `INSERT_BBAN_GIAONHAN_CNTT` (L4658–4703) và `INSERT_BBAN_KIEMTRA_TBI_CNTT` (L4904–4911) trong `body_PKG_HIEUCT.sql`.

| Nghiệp vụ | LOAI_BBAN | LOAI_NGHIEPVU | Cấp thực hiện | Ý nghĩa chi tiết trong DB |
| :--- | :-: | :--- | :--- | :--- |
| **Bàn giao C3** | `0` | `BGC3` | Cấp 3 (P10) | P10 bàn giao cho phòng ban Công ty. Trạng thái đích: `1` (Đang sử dụng). |
| **Bàn giao C4** | `0` | `BGC4` | Cấp 3 (P10) | P10 bàn giao cho Đơn vị Cấp 4. Trạng thái đích: `5` (Trong kho Cấp 4). |
| **Bàn giao SD** | `0` | `BGSD` | Cấp 4 | Đơn vị C4 bàn giao cho Người sử dụng. Trạng thái đích: `1` (Đang sử dụng). |
| **Thu hồi C3** | `1` | `THC3` | Cấp 3 (P10) | Thu hồi từ phòng ban cty về kho CNTT. Trạng thái đích: `5` (Kho CNTT `1`). |
| **Thu hồi SD** | `1` | `THSD` | Cấp 4 | Đơn vị C4 thu hồi từ Người sử dụng về kho đơn vị. Trạng thái đích: `5` (Kho C4). |
| **Trả lại C4** | `2` | `THC4` | Cấp 4 $\rightarrow$ Cấp 3 | Đơn vị C4 trả thiết bị về P10/Công ty. Trạng thái đích: `5` (Kho CNTT `1`). |
| **Thanh lý C3** | `3` | `TLC3` | Cấp 3 (P10) | Lập biên bản kiểm tra đề nghị thanh lý tại C3. Trạng thái đích: `9` (Chờ thanh lý). |
| **Thanh lý C4** | `3` | `TLC4` | Cấp 4 | Lập biên bản kiểm tra đề nghị thanh lý tại C4. Trạng thái đích: `9` (Chờ thanh lý). |

---

## 3. Xác minh Trạng thái thiết bị (`TBI_TRANGTHAI`)

> Nguồn kiểm tra: `TBI_DM_THIETBI_CNTT.TBI_TRANGTHAI_ID` và các câu lệnh `UPDATE` / `MERGE` trong `body_PKG_HIEUCT.sql`.

| ID | Tên trạng thái | Nghiệp vụ phát sinh / sử dụng | Procedure PL/SQL thay đổi `TBI_TRANGTHAI_ID` |
| :-: | :--- | :--- | :--- |
| **1** | Đang sử dụng | Hoàn tất bàn giao `BGC3` hoặc `BGSD` | `ky_so_C2_GIAONHAN_THIETBI` (MERGE từ `TRANGTHAI_MOI_ID`) |
| **4** | Đã thanh lý | Phê duyệt hồ sơ thanh lý thành công | `DUYET_THANH_LY_CNTT` (UPDATE trực tiếp = `4`, gán kho `26`, đơn vị `PA23`) |
| **5** | Trong kho | Duyệt TB mới; Hoàn tất `BGC4`, `THC3`, `THSD`, `THC4`; Kiểm tra `Y` | `update_DUYET_TBIMOI` / `_MULTI`, `ky_so_C2_GIAONHAN_THIETBI`, `INSERT_KIEMTRATB_CNTT` |
| **7** | Chờ duyệt | Tạo thiết bị mới (thao tác trực tiếp hoặc import) | `insert_TBI_DM_THIETBI_CNTT` (INSERT khởi tạo = `7`) |
| **8** | Đang giao nhận (khóa tạm) | Đang nằm trong biên bản chờ ký (trạng thái `0` hoặc `1`) | `INSERT_BBAN_GIAONHAN_CNTT`, `UPDATE_BBAN_GIAONHAN_CNTT`, `INSERT_BBAN_KIEMTRA_TBI_CNTT` |
| **9** | Chờ thanh lý | Kiểm tra kết quả `N`; Hoàn tất ký biên bản thanh lý `TLC3`/`TLC4` | `INSERT_KIEMTRATB_CNTT` (kết quả `N`), `ky_so_C2_GIAONHAN_THIETBI` (cho `LOAI_BBAN = 3`) |

---

## 4. Xác minh Vòng đời Biên bản (`TBI_BBAN_GIAONHAN_CNTT`)

| Trạng thái | Ý nghĩa | Hành động (Action) tạo ra | Procedure cập nhật | Quyền / Role thao tác | Nơi Frontend kiểm tra (`useActionQLTB.js`) |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **`0`** | Mới tạo / Chờ ký C1 | Tạo mới biên bản bàn giao/thu hồi/thanh lý | `INSERT_BBAN_GIAONHAN_CNTT`, `INSERT_BBAN_KIEMTRA_TBI_CNTT` | `NGUOI_TAO` (Người tạo phiếu) | `showUpdateBtn = isNguoiTao && trang_thai == 0`, `showDeleteBtn`, `showKyCap1Btn` |
| **`1`** | Đã ký C1 / Chờ ký C2 | Người giao thực hiện ký số C1 thành công | `ky_so_C1_GIAONHAN_THIETBI` (Cập nhật `TRANG_THAI = 1`, `NGAY_GIAO = SYSDATE`) | `NGUOI_GIAO` (Người ký C1), `NGUOI_TAO` / `ADMIN` (Hủy) | `showKyCap2Btn = isNguoiNhan && trang_thai == 1`, `showDestroyBtn = (isNguoiTao \|\| isAdmin) && trang_thai == 1` |
| **`2`** | Đã ký C2 / Hoàn thành | Người nhận thực hiện ký số C2 thành công | `ky_so_C2_GIAONHAN_THIETBI` (Cập nhật `TRANG_THAI = 2`, `NGAY_NHAN = SYSDATE`) | `NGUOI_NHAN` (Người ký C2) | `showThanhLyBtn = isNguoiTao && trang_thai == 2 && trang_thai_thanh_ly == -1` |
| **`3`** | Đã hủy | Hủy biên bản đã ký C1 | `HUY_BBAN_GIAONHAN_CNTT` (Cập nhật `TRANG_THAI = 3`, `NGAY_HUY = SYSDATE`) | `NGUOI_TAO` hoặc `ADMIN` | Biên bản bị loại khỏi danh sách tìm kiếm mặc định (`TRANG_THAI <> 3`) |

---

## 5. Chi tiết xử lý PL/SQL khi INSERT / UPDATE / DELETE / HỦY Biên bản

### A. Khi INSERT Biên bản (`INSERT_BBAN_GIAONHAN_CNTT` / `INSERT_BBAN_KIEMTRA_TBI_CNTT`)
* **Trạng thái trước:** `1` (Đang sử dụng) hoặc `5` (Trong kho) hoặc `7` (Chờ duyệt).
* **Trạng thái sau khi thêm:** Thiết bị chính trong `TBI_DM_THIETBI_CNTT` bị cập nhật thành `8` (Đang nằm trong biên bản).
* **Dữ liệu Snapshot lưu vào `TBI_TB_GIAONHAN_CNTT`:**
  * Snapshot hiện tại: `DONVI_CU`, `PHONGBAN_CU`, `KHOCU_ID`, `TRANGTHAI_CU_ID`, `NGUOI_SD_CU`.
  * Giá trị dự kiến sau khi hoàn thành: `DONVI_MOI`, `PHONGBAN_MOI`, `KHOMOI_ID`, `TRANGTHAI_MOI_ID`, `NGUOI_SD_MOI` (hoặc `TINH_TRANG_TB`, `NGUYEN_NHAN` nếu là thanh lý).

### B. Khi UPDATE Biên bản (`UPDATE_BBAN_GIAONHAN_CNTT` / `UPDATE_BBAN_KIEMTRA_TBI_CNTT`)
* **Thiết bị bị loại khỏi biên bản:** Được phát hiện qua câu lệnh `NOT EXISTS` và lập tức được `UPDATE` trả về `TBI_TRANGTHAI_ID = TRANGTHAI_CU_ID`, sau đó dòng chi tiết tương ứng trong `TBI_TB_GIAONHAN_CNTT` bị `DELETE`.
* **Thiết bị mới được thêm:** Đã qua kiểm tra không nằm ở biên bản `0/1` khác $\rightarrow$ Chèn snapshot mới vào `TBI_TB_GIAONHAN_CNTT` và `UPDATE TBI_TRANGTHAI_ID = 8`.
* **Thiết bị giữ nguyên:** Cập nhật lại thông tin `NGUOI_SD_MOI` hoặc `TINH_TRANG_TB` / `NGUYEN_NHAN` dự kiến.

### C. Khi DELETE Biên bản (`DELETE_BBAN_GIAONHAN_CNTT`)
* Chỉ thực hiện được khi biên bản có `TRANG_THAI = 0`.
* **Rollback thiết bị:** Duyệt vòng lặp `FOR R IN (SELECT THIETBI_ID, TRANGTHAI_CU_ID ...)` và `UPDATE TBI_DM_THIETBI_CNTT SET TBI_TRANGTHAI_ID = R.TRANGTHAI_CU_ID`.
* **Xóa dữ liệu:** `DELETE FROM TBI_TB_GIAONHAN_CNTT WHERE BBAN_ID = P_ID` $\rightarrow$ `DELETE FROM TBI_BBAN_GIAONHAN_CNTT WHERE ID = P_ID` (Xóa hoàn toàn cả header và detail).

### D. Khi HỦY Biên bản (`HUY_BBAN_GIAONHAN_CNTT`)
* Khác với DELETE: Chỉ thực hiện được khi biên bản ở trạng thái `1` (đã ký C1, chưa ký C2). Biên bản **không bị xóa khỏi DB**.
* **Rollback thiết bị:** Dùng `MERGE INTO TBI_DM_THIETBI_CNTT` trả `TBI_TRANGTHAI_ID = TRANGTHAI_CU_ID`.
* **Cập nhật Header:** `UPDATE TBI_BBAN_GIAONHAN_CNTT SET TRANG_THAI = 3, NGAY_HUY = SYSDATE, NGUOI_HUY = P_NGUOI_HUY`.

---

## 6. Xác minh Luồng Ký số C1 / C2

### A. Ký C1
* **Component frontend:** `SignaturePDFViewer.js`
* **API Backend:** `POST /APIPCHY/API_PDF/KyPhieu` $\rightarrow$ `API_PDFController.SignPdf` $\rightarrow$ `PdfSignService.SignPdf`
* **Procedure DB gọi sau khi ký:** `ky_so_C1_GIAONHAN_THIETBI(p_ID)`
* **Điều kiện ký C1:** `TRANG_THAI = 0`. Nếu `LOAI_NGHIEPVU` là `BGC3` hoặc `BGSD`, kiểm tra tất cả các thiết bị thuộc chủng loại có `CAN_CHON_NSD = 'Y'` bắt buộc phải có `NGUOI_SD_MOI`.
* **Dữ liệu thay đổi:** `TBI_BBAN_GIAONHAN_CNTT.TRANG_THAI = 1`, `NGAY_GIAO = SYSDATE`.

### B. Ký C2
* **Component frontend / API Backend / Procedure DB:** `SignaturePDFViewer.js` $\rightarrow$ `API_PDFController.SignPdf` $\rightarrow$ `ky_so_C2_GIAONHAN_THIETBI(p_ID)`.
* **Điều kiện ký C2:** `TRANG_THAI = 1`.
* **Các cột của `TBI_DM_THIETBI_CNTT` được cập nhật khi hoàn tất (dòng 6494–6521):**
  * Với biên bản thông thường (`LOAI_BBAN <> 3`): `MA_DVIQLY` (gán `DONVI_MOI`), `DM_PHONGBAN_ID` (gán `PHONGBAN_MOI`), `TBI_KHO_ID` (gán `KHOMOI_ID`), `DM_DONVI_ID` (gán `v_dv_id`), `NGUOI_SD` (gán `NGUOI_SD_MOI`), `TBI_TRANGTHAI_ID` (gán `TRANGTHAI_MOI_ID`), `LAST_BBAN_ID` (gán `p_ID`).
  * Với biên bản kiểm tra thanh lý (`LOAI_BBAN = 3`): Chỉ cập nhật `TBI_TRANGTHAI_ID = 9` (Chờ thanh lý) và `LAST_BBAN_ID = p_ID`.

---

## 7. Xác minh Luồng Thanh lý & Bảng `TBI_BB_XACNHAN_THANHLY_C4`

1. **Lập biên bản kiểm tra thanh lý:** Gọi `INSERT_BBAN_KIEMTRA_TBI_CNTT` $\rightarrow$ Tạo biên bản `LOAI_BBAN = 3` (`TLC3` hoặc `TLC4`), lưu tình trạng & nguyên nhân vào `TBI_TB_GIAONHAN_CNTT`, thiết bị chuyển sang trạng thái tạm `8`.
2. **Ký C1 & Ký C2 biên bản thanh lý:** Sau ký C2, `ky_so_C2_GIAONHAN_THIETBI` chuyển trạng thái thiết bị sang `9` (Chờ thanh lý).
3. **Bổ sung hồ sơ thanh lý:** Gọi `INSERT_THONGTIN_DUYETTHANHLY` $\rightarrow$ Chèn bản ghi mới vào `TBI_BB_XACNHAN_THANHLY_C4` với `BIENBAN_ID`, `FILE_VANBAN`, `SO_VANBAN`, `NGUOI_TAO`, `NGUOI_KIEMSOAT`, `TRANG_THAI = 0` (Đang duyệt thanh lý).
4. **Người kiểm soát duyệt thanh lý:** Gọi `DUYET_THANH_LY_CNTT` (dòng 7770–7834):
   * Khóa dòng bằng `SELECT ... FOR UPDATE`.
   * Kiểm tra `NGUOI_KIEMSOAT` khớp với tài khoản đăng nhập và `TRANG_THAI <> 1`.
   * Cập nhật `TBI_BB_XACNHAN_THANHLY_C4.TRANG_THAI = 1`, `THOIGIAN_XACNHAN = SYSDATE`.
   * Cập nhật `TBI_DM_THIETBI_CNTT`: `TBI_TRANGTHAI_ID = 4` (Đã thanh lý), `TBI_KHO_ID = 26` (Kho thanh lý), `MA_DVIQLY = 'PA23'`, `DM_DONVI_ID = 'f36d78d6-34a2-42d3-8395-fdb5eb401fe0'`.

---

## 8. Dependency của các Procedure quan trọng trong Backend C#

| Procedure PL/SQL | Nơi gọi trong Backend C# | Màn hình Frontend ảnh hưởng |
| :--- | :--- | :--- |
| `INSERT_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.INSERT_BBAN_GIAONHAN_CNTT` | Giao nhận C3, Giao nhận C4, BG người dùng, Thu hồi C3, Thu hồi C4, Trả lại C4. |
| `UPDATE_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.UPDATE_BBAN_GIAONHAN_CNTT` | Sửa tất cả các loại biên bản giao nhận/thu hồi/trả lại khi còn ở `TRANG_THAI = 0`. |
| `ky_so_C1_GIAONHAN_THIETBI` | `PdfSignService.SignPdf` (khi luồng nhận diện ký C1) | Màn hình Viewer ký số PDF cho tất cả các loại biên bản. |
| `ky_so_C2_GIAONHAN_THIETBI` | `PdfSignService.SignPdf` (khi luồng nhận diện ký C2) | Màn hình Viewer ký số PDF (điểm commit áp dụng vị trí/trạng thái thiết bị). |
| `DELETE_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.DELETE_BBAN_GIAONHAN_CNTT` | Nút Xóa biên bản ở tất cả màn hình biên bản khi `TRANG_THAI = 0`. |
| `HUY_BBAN_GIAONHAN_CNTT` | `QLTB_GiaoNhanThietBi_Manager.HUY_BBAN_GIAONHAN_CNTT` | Nút Hủy biên bản khi biên bản đã ở `TRANG_THAI = 1`. |
| `update_DUYET_TBIMOI_MULTI` | `QLTB_DuyetMoKhoaTB_Manager.update_DUYET_TBIMOI_MULTI` | Màn hình Duyệt thiết bị mới cấp 3 (duyệt hàng loạt). |
| `INSERT_KIEMTRATB_CNTT_MULTI` | `QLTB_KiemTraTB_Manager.INSERT_KIEMTRATB_CNTT_MULTI` | Màn hình Kiểm tra thiết bị cấp 3. |

---

## 9. Bảng điều kiện phân quyền trong `useActionQLTB.js`

> Nguồn kiểm tra: `hooks/useActionQLTB.js`.

| Action | Role | Vai trò trên BB | TRANG_THAI | Điều kiện bổ sung |
| :--- | :--- | :--- | :-: | :--- |
| **Sửa** (`showUpdateBtn`) | Bất kỳ | `isNguoiTaoPhieu` (`user.id` / `username == nguoi_tao`) | `0` | Biên bản chưa ký cấp nào. |
| **Xóa** (`showDeleteBtn`) | Bất kỳ | `isNguoiTaoPhieu` | `0` | Biên bản chưa ký cấp nào. |
| **Ký C1** (`showKyCap1Btn`) | Bất kỳ | `isNguoiKyC1` (`user.id` / `username == nguoi_giao`) | `0` | Biên bản ở trạng thái chờ ký cấp 1. |
| **Ký C2** (`showKyCap2Btn`) | Bất kỳ | `isNguoiNhan` (`user.id` / `username == nguoi_nhan`) | `1` | Biên bản đã ký cấp 1. |
| **Hủy** (`showDestroyBtn`) | `ADMIN` (`PA23`) hoặc Bất kỳ | `isNguoiTaoPhieu` hoặc `isAdmin` | `1` | Biên bản đã ký C1 (chưa ký C2). |
| **Thanh lý** (`showThanhLyBtn`) | Bất kỳ | `isNguoiTaoPhieu` | `2` | `trang_thai_thanh_ly == -1` (Chưa từng tạo hồ sơ thanh lý). |
| **Đang duyệt thanh lý** (`showThongTinThanhLy`) | Bất kỳ | Bất kỳ | `2` | `trang_thai_thanh_ly == 0` hoặc `1`. |
| **Duyệt thanh lý** (`showDuyetThanhLy`) | Bất kỳ | `isNguoiDuyetThanhLy` (`username == nguoi_kiemsoat`) | `2` | `trang_thai_thanh_ly == 0` (Hồ sơ đang chờ duyệt). |

---

## 10. Xác minh Positional Binding Oracle trong `DataHelper`

* **File:** `Helpers/DataHelper.cs`
* **Method:** `ExcuteNonQuery_v2` (L117–171) và `ExcuteDataTable_v2` / `ExcuteReader`.
* **Thuộc tính `BindByName`:** **KHÔNG CÓ (Default = `false`)**. Trong ODP.NET Managed Driver, khi `BindByName` không được gán `true`, OracleCommand tự động bind các tham số theo **vị trí mảng tham số (Positional Index)** được `cmd.Parameters.Add()` thêm vào.
* **Ví dụ phụ thuộc vị trí tham số:**
  Trong `QLTB_GiaoNhanThietBi_Manager.cs` dòng 24–29:
  ```csharp
  DataTable ds = helper.ExcuteReader("PKG_HIEUCT.GET_BBGIAONHAN_TB_CNTT_V2",
      "p_page_index", "p_page_size", "p_ID", "p_LOAI_BBAN", "p_LOAI_NGHIEPVU", "p_MA_DVI_GIAO", ...
      pageIndex, pageSize, id, loai_bban, loai_nghiepvu, ma_dvi_giao, ...
  );
  ```
  Nếu thay đổi thứ tự tham số truyền vào array trong C# hoặc thay đổi thứ tự tham số khai báo trong PL/SQL Procedure, Oracle sẽ gán sai dữ liệu tham số dù tên string key truyền vào khớp nhau.

---

## 11. Kết luận và Tổng kết Kỹ thuật

### A. 10 điểm kỹ thuật quan trọng nhất cần ghi nhớ trước khi phát triển tính năng mới

> [!IMPORTANT]
> 1. **Tuyệt đối không thay đổi thứ tự tham số PL/SQL Procedure** nếu không cập nhật tương ứng ở Manager C# (do Positional Binding).
> 2. **Trạng thái `8` là trạng thái khóa giao dịch tạm thời**, bắt buộc phải được duy trì khi thiết bị nằm trong bất kỳ biên bản nào chưa hoàn tất (`TRANG_THAI IN (0, 1)`).
> 3. **Ký cấp 2 (`ky_so_C2_GIAONHAN_THIETBI`) là thời điểm duy nhất Commit nghiệp vụ** để đẩy dữ liệu vị trí/người dùng/trạng thái mới từ biên bản vào bảng chính `TBI_DM_THIETBI_CNTT`.
> 4. **Duyệt thiết bị mới (`update_DUYET_TBIMOI`) luôn tự động chèn kết quả kiểm tra `Y`** vào `TBI_KIEMTRA_CNTT`.
> 5. **Procedure `INSERT_BBAN_GIAONHAN_CNTT` phân biệt vị trí nhận dựa vào `LOAI_NGHIEPVU`**: `BGC3`/`BGSD` gán Phòng ban + Người dùng mới; `BGC4`/`THSD`/`THC4` gán Kho mới.
> 6. **Xóa biên bản (`DELETE`) chỉ áp dụng cho `TRANG_THAI = 0`**, còn **Hủy biên bản (`CANCEL`) chỉ áp dụng cho `TRANG_THAI = 1`**.
> 7. **Bảng `TBI_TB_GIAONHAN_CNTT` đóng vai trò Snapshot lưu vết lịch sử**, lưu giữ toàn bộ thông tin cũ (`*_CU`) và thông tin mới (`*_MOI`) của thiết bị tại thời điểm tạo biên bản.
> 8. **Phân quyền hiển thị nút giao diện (`useActionQLTB.js`) và xử lý Backend đều đồng bộ phụ thuộc vào username người khởi tạo, người giao, người nhận và người kiểm soát**.
> 9. **Duyệt thanh lý (`DUYET_THANH_LY_CNTT`) hard-code Mã đơn vị `PA23` và Kho `26`** khi chuyển thiết bị sang trạng thái `4` (Đã thanh lý).
> 10. **Ký số PDF đi qua Web API `API_PDFController`** trước khi kích hoạt procedure ký C1/C2 dưới Oracle DB.

### B. Các điểm chưa xác minh

Không có. Toàn bộ 10 mục yêu cầu đã được xác minh trực tiếp 100% qua source code Frontend, Backend C# và file SQL `spec_PKG_HIEUCT.sql` / `body_PKG_HIEUCT.sql`.
