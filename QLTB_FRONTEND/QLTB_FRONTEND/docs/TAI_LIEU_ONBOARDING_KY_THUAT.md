# Tài liệu onboarding kỹ thuật dự án PCHY_QLTB_FRONTEND

## 1. Mục đích

Tài liệu này dành cho lập trình viên mới nhận dự án, giúp:

- Hiểu kiến trúc tổng thể của frontend
- Nắm được các thư mục chính và vai trò của từng nhóm file
- Hiểu cơ chế đăng nhập, phân quyền, menu động, chuyển đơn vị
- Biết các luồng kỹ thuật quan trọng để lần theo khi debug hoặc phát triển tiếp

Phạm vi của tài liệu là frontend repo `PCHY_QLTB_FRONTEND`. Toàn bộ nghiệp vụ thực tế phụ thuộc rất mạnh vào backend API `/APIPCHY`.

## 2. Tổng quan kỹ thuật

Đây là một ứng dụng Next.js sử dụng `pages router`, giao diện dựa trên PrimeReact/PrimeFlex. Frontend này đóng vai trò shell dùng chung cho nhiều phân hệ nghiệp vụ nội bộ.

Các phân hệ chính đang có trên frontend:

- Quản trị hệ thống
- Quản lý kìm chì
- Quản lý thiết bị
- Quản lý vận hành
- Đánh giá giao dịch viên

Ngoài ra còn có dấu hiệu của module quản lý thí nghiệm trong `services`, `models`, `hooks`, `utils/Components`, nhưng hiện chưa thấy thư mục route hoàn chỉnh trong `pages`.

## 3. Stack công nghệ

### 3.1 Công nghệ chính

- Next.js `13.2.3`
- React `18.2.0`
- PrimeReact `9.6.4`
- PrimeFlex
- PrimeIcons
- Axios
- Sass
- `moment`, `dayjs`, `date-fns`
- `exceljs`, `file-saver`
- `pdfjs-dist`, `@react-pdf-viewer/core`, `@react-pdf-viewer/default-layout`

### 3.2 Scripts

Trong `package.json`:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run export`
- `npm run lint`

### 3.3 Cấu hình môi trường

File mẫu: `.env-example`

Biến môi trường đáng chú ý:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_PCHY`
- `NEXT_PUBLIC_API_TOKEN`

`constants/api.js` tạo `apiClient` với base URL:

- `${NEXT_PUBLIC_API_URL}/APIPCHY`

Và tạo thêm `apiPCHY` với:

- `${NEXT_PUBLIC_API_PCHY}/APIPCHY`

## 4. Cấu trúc thư mục

### 4.1 Thư mục lõi

- `pages/`: route frontend
- `services/`: service gọi API backend
- `models/`: object mẫu/default state
- `components/`: component dùng chung
- `layout/`: shell ứng dụng, sidebar, topbar, menu
- `hooks/`: custom hooks và hooks điều khiển action theo vai trò/trạng thái
- `constants/`: hằng số hệ thống và nghiệp vụ
- `utils/`: helper, PDF, Excel, upload, storage, interceptors
- `context/`: form context, data context

### 4.2 Bản đồ route chính

- `pages/quantrihethong`
- `pages/quanlykimchi`
- `pages/quanlythietbi`
- `pages/quanlyvanhanh`
- `pages/danhgiagdv`
- `pages/auth`

Lưu ý kỹ thuật:

- Có `services/quanlythinghiem` và `models/quanlythinghiem`
- Có `hooks/useThongTinYCTN.js`, `hooks/useBuocYCTN.js`
- Nhưng không thấy `pages/quanlythinghiem`

Điều này là do:

- Module đã tách sang repo khác
- Route frontend đã bị loại bỏ nhưng service/model còn tồn tại

## 5. Điểm vào ứng dụng

### 5.1 `pages/_app.js`

Vai trò:

- Nạp CSS/SCSS toàn cục
- Wrap `LayoutProvider`
- Wrap `MenuProvider`
- Gọi `useMenuGuard()` trước khi render page

Ý nghĩa:

- Route được kiểm tra quyền từ rất sớm
- App shell được gắn mặc định cho hầu hết các page

### 5.2 `layout/layout.js`

Vai trò:

- Là shell hiển thị `AppTopbar`, `AppSidebar`, `AppFooter`
- Gọi `checkLogin()` để xác nhận session backend
- Nếu thất bại thì đẩy về `/auth/login`

Đây là file cần đọc đầu tiên nếu muốn hiểu lifecycle đăng nhập.

### 5.3 `pages/index.js`

Vai trò:

- Dashboard tổng hợp
- Hiển thị dashboard theo `currentAppCode` -- chính là mã menu chọn từ PCHUNGYEN
- Nếu chưa chọn app (đăng nhập trực tiếp) thì hiển thị tất cả dashboard cùng lúc

## 6. Xác thực và phân quyền

## 6.1 Đăng nhập

Trang đăng nhập:

- `pages/auth/login/index.js`

2 luồng đăng nhập:

- Đăng nhập thường: `HT_NGUOIDUNG/login`
- Đăng nhập SSO: `HT_NGUOIDUNG/sso-login` - đăng nhập tự động qua PCHUNGYEN

Sau khi đăng nhập thành công, frontend lưu vào `localStorage`:

- `user`
- `ds_donvi`
- `current_MADVIQLY`
- `currentAppCode` trong trường hợp SSO hoặc chọn app

## 6.2 Kiểm tra session

`services/authService.js` cung cấp:

- `checkLogin()`
- `getAccessTokenByRefreshToken()`
- `logOut()`

`layout/layout.js` gọi `checkLogin()` mỗi khi shell load.

## 6.3 Interceptor

`utils/setupInterceptors.js` làm 2 việc chính:

- Gắn header `X-Menu-Path` theo route hiện tại
- Tự động refresh token khi gặp `401`

Nếu refresh thất bại:

- Clear `localStorage`
- Alert phiên đăng nhập hết hạn
- Chuyển về `/auth/login`

## 6.4 Guard route

`hooks/useMenuGuard.js` kiểm tra:

- Route có nằm trong nhóm cần bảo vệ không
- User hiện tại có `allowedMenus` chứa route đó không

Danh sách prefix đang được bảo vệ:

- `/quanlykimchi/`
- `/quantrihethong/`
- `/quanlythinghiem/`
- `/quanlyvanhanh/`
- `/quanlythietbi/`
- `/danhgiagdv/`

Có một số ngoại lệ hard-code:

- Route ký số đặc biệt của quản lý thí nghiệm
- Route chi tiết quyết toán cần có `id_giaonhan_temchi`

## 7. Menu động và context ứng dụng

## 7.1 `layout/AppMenu.js`

Đây là file rất quan trọng để hiểu cơ chế menu.

Nguồn dữ liệu menu:

- `HT_NGUOIDUNG_Service.getMenuByIdUser(idUser)`
- `HT_NGUOIDUNG_Service.getMenuWaitSign(username)`
- `HT_NGUOIDUNG_Service.getWarningQuyetToanTemChi(username)`

Chức năng:

- Build cây menu cho `PanelMenu`
- Lọc menu theo `currentAppCode`
- Chèn menu quản trị nếu user có role `ADMIN` hoặc `ADMIN_DL`
- Hiển thị badge số chờ ký và cảnh báo quyết toán

Hệ quả kỹ thuật:

- Menu không hard-code ở frontend
- Sai menu phần lớn phải kiểm tra backend hoặc dữ liệu DB menu

## 7.2 `layout/AppTopbar.js`

Vai trò:

- Hiển thị thông tin người dùng
- Cho phép đổi mật khẩu
- Cho phép chuyển đơn vị làm việc
- Đăng xuất

Điểm quan trọng:

- Khi đổi `current_MADVIQLY`, app gọi `router.reload()`
- Điều này khiến nhiều page phụ thuộc trực tiếp vào context đơn vị làm việc hiện tại

## 7.3 Local storage keys

Các key thường xuyên được dùng:

- `user`
- `ds_donvi`
- `current_MADVIQLY`
- `currentAppCode`
- `currentMenu`

Nếu bug liên quan đến “vào sai dữ liệu”, “menu sai”, “không thấy bản ghi”, nên kiểm tra 5 key này trước.

## 8. Pattern tổ chức code

## 8.1 Service layer

Hai kiểu service chính:

- CRUD dùng helper `createService()` trong `services/apiService.js`
- Service viết tay cho nghiệp vụ phức tạp

Ví dụ CRUD generator:

- `services/quanlythietbi/QLTB_DANH_MUC_Service.js`

Ví dụ service viết tay:

- `services/quanlykimchi/QLTB_QTOAN_TEMCHIService.js`
- `services/quanlythietbi/QLTB_GiaoNhanThietBi.js`
- `services/quanlyvanhanh/SO_TRUC_VAN_HANHService.js`
- `services/danhgiagdv/DANHGIAGDVService.js`

## 8.2 Models

`models/` chủ yếu dùng để:

- Khai báo object mặc định cho form
- Khởi tạo dữ liệu rỗng
- Chuẩn hóa cấu trúc state

## 8.3 Page pattern

Rất nhiều page đi theo mẫu giống nhau:

1. State filter
2. State paging
3. `loadData()` gọi service
4. Table component riêng
5. Dialog thêm/sửa
6. Viewer/PDF modal
7. Hook action để quyết định hiện nút nào

Hiểu được pattern này sẽ đọc nhanh được gần như toàn bộ repo.

## 9. Hooks nghiệp vụ quan trọng

## 9.1 `useAction.js`

Dùng chủ yếu cho quản lý kìm chì.

Cho biết:

- Ai là người tạo phiếu
- Ai là người nhận
- Có hiện nút ký cấp 1 không
- Có hiện nút ký cấp 2 không
- Có được xóa, hủy, thu hồi, quyết toán hay không

## 9.2 `useActionQT.js`

Dùng cho luồng quyết toán nhiều cấp.

Cho biết:

- Ai là người quyết toán
- Ai là người quản lý
- Ai là trưởng đơn vị
- Có hiện nút ký cấp 1, 2, 3 không

## 9.3 `useActionQLTB.js`

Dùng cho quản lý thiết bị.

Ngoài luồng ký giao nhận còn có:

- Hiện nút thanh lý
- Hiện nút xem thông tin thanh lý
- Hiện nút duyệt thanh lý

## 9.4 `useActionQLVH.js`

Dùng cho quản lý vận hành.

Luồng đơn giản hơn:

- Người tạo phiếu có thể ký
- Người tạo phiếu hoặc admin có thể hủy

## 10. Cơ chế PDF và ký số

`services/pdfService.js` là hạ tầng rất quan trọng.

Có các nhóm hàm:

- Dùng chung: `preview`, `digitalSign`, `downloadPdf`, `getPdf`
- Riêng QLVH: `QLVH_preview`, `QLVH_digitalSign`
- Riêng QLTB: `QLTB_preview`, `QLTB_digitalSign`

Thông tin ký số lấy từ `localStorage.user`:

- `so_cmnd`
- `sign_alias`
- `sign_type`

Kết luận kỹ thuật:

- Nhiều trạng thái nghiệp vụ chỉ được cập nhật sau bước preview/ký số
- Khi debug lỗi “không ký được”, phải kiểm tra đồng thời:
  - dữ liệu user
  - service PDF
  - route viewer
  - API cập nhật trạng thái sau ký

## 11. Bản đồ kỹ thuật theo phân hệ

## 11.1 Quản trị hệ thống

Route:

- `pages/quantrihethong/nguoidung`
- `pages/quantrihethong/vaitro`
- `pages/quantrihethong/menu`
- `pages/quantrihethong/donvi`
- `pages/quantrihethong/phongban`

Service chính:

- `services/quantrihethong/HT_NGUOIDUNGService.js`
- `services/quantrihethong/HT_MENUService.js`
- `services/quantrihethong/HT_NHOMQUYENService.js`
- `services/quantrihethong/DM_DONVIService.js`
- `services/quantrihethong/DM_PHONGBANService.js`

Nên đọc:

- `pages/quantrihethong/nguoidung/index.js`
- `pages/quantrihethong/menu/index.js`

## 11.2 Quản lý kìm chì

Route lớn:

- `giaonhantemchi`
- `giaonhantemchic4`
- `giaonhankimc4`
- `bbangiaokimc3`
- `quyettoanchic3`
- `quyettoanchic4`
- `chitietquyettoanchi`
- `chitietquyettoanTND`
- các route báo cáo

Service chính:

- `services/quanlykimchi/*`

File nên đọc:

- `pages/quanlykimchi/giaonhantemchi/index.js`
- `pages/quanlykimchi/chitietquyettoanchi/index.js`
- `services/quanlykimchi/QLTB_QTOAN_TEMCHIService.js`

## 11.3 Quản lý thiết bị

Nhóm route:

- `danhmuc/*`
- `quanlycap4/dangkymokhoa`
- `quanlycap3/duyetmokhoa`
- `quanlychung/giaonhanthietbi`
- `quanlychung/thuhoithietbi`
- `quanlychung/tralaithietbiC4`
- `quanlychung/thanhlythietbi`
- `baocao/*`

Service chính:

- `services/quanlythietbi/QLTB_DANH_MUC_Service.js`
- `services/quanlythietbi/QLTB_GiaoNhanThietBi.js`
- `services/quanlythietbi/QLTB_DangKyMoKhoaTBService.js`
- `services/quanlythietbi/QLTB_DuyetMoKhoaTBService.js`
- `services/quanlythietbi/QLTB_BaoCaoService.js`

File nên đọc:

- `pages/quanlythietbi/quanlycap4/dangkymokhoa/index.js`
- `pages/quanlythietbi/quanlycap3/duyetmokhoa/index.js`
- `hooks/useActionQLTB.js`

## 11.4 Quản lý vận hành

Route:

- `theodoivanhanh/sotrucvanhanh`
- `danhmuc/danhmucmaychu`
- `danhmuc/danhmucthietbi`
- `danhmuc/hangmucloaiphieu`
- `baocao/tonghoploi`
- `baocao/tonghoptheodoi`

File nên đọc:

- `pages/quanlyvanhanh/theodoivanhanh/sotrucvanhanh/index.js`
- `services/quanlyvanhanh/SO_TRUC_VAN_HANHService.js`
- `hooks/useActionQLVH.js`

## 11.5 Đánh giá giao dịch viên

Route:

- `pages/danhgiagdv/baocaotonghop`
- `pages/danhgiagdv/baocaochitiet`

Service:

- `services/danhgiagdv/DANHGIAGDVService.js`

Lưu ý:

- Đây chủ yếu là phân hệ báo cáo
- Có xử lý gom nhóm dữ liệu ngay ở frontend

## 12. Những rủi ro và điểm cần chú ý khi bảo trì

## 12.1 README hiện tại chưa phản ánh dự án

`README.md` vẫn là mẫu mặc định của Next.js, không dùng được cho onboarding thực tế.

## 12.2 Phụ thuộc backend rất nặng

Frontend phụ thuộc backend ở các phần:

- Menu
- Phân quyền route
- Badge chờ ký/cảnh báo
- Trạng thái nghiệp vụ
- PDF và ký số

## 12.3 Có nhiều logic nghiệp vụ nằm trực tiếp trong page

Ví dụ:

- Gom dữ liệu báo cáo
- Mapping tên người dùng
- Hiện/ẩn nút thao tác
- Kiểm tra quyền ở cấp component

Điều này làm việc debug nhanh hơn nhưng khó tái sử dụng và khó refactor.

## 12.4 Có rủi ro encoding tiếng Việt

Khi đọc qua terminal, nhiều comment và chuỗi bị lỗi hiển thị encoding. Khi chỉnh sửa hàng loạt cần thận trọng để tránh làm hỏng file cũ.

## 13. Thứ tự đọc code đề xuất cho dev mới

Nếu mới vào dự án, nên đọc theo thứ tự:

1. `package.json`
2. `pages/_app.js`
3. `layout/layout.js`
4. `layout/AppTopbar.js`
5. `layout/AppMenu.js`
6. `hooks/useMenuGuard.js`
7. `constants/api.js`
8. `utils/setupInterceptors.js`
9. `services/quantrihethong/HT_NGUOIDUNGService.js`
10. Chọn một phân hệ để đi sâu end-to-end

Đề xuất theo phân hệ:

- QLTB: `giaonhantemchi` -> `chitietquyettoanchi` -> `useAction` -> `useActionQT`
- QLTB: `dangkymokhoa` -> `duyetmokhoa` -> `QLTB_GiaoNhanThietBi.js` -> `useActionQLTB`
- QLVH: `sotrucvanhanh` -> `SO_TRUC_VAN_HANHService.js` -> `useActionQLVH`

## 14. Kết luận

Frontend này là một ứng dụng đa phân hệ, lấy menu và quyền động từ backend, trong đó các trục kỹ thuật quan trọng nhất là:

- Xác thực và refresh token
- Menu động và `allowedMenus`
- Context đơn vị làm việc `current_MADVIQLY`
- Viewer/PDF/ký số
- Các hook action quyết định trạng thái nút thao tác.
