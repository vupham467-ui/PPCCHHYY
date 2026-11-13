# Tài liệu phân hệ Quản lý thiết bị (QLTB)

## 1. Mục đích và phạm vi

Tài liệu này tổng hợp luồng nghiệp vụ và luồng kỹ thuật của phân hệ `quanlythietbi`, phục vụ:

- Tra cứu nhanh khi bảo trì hoặc phát triển chức năng.
- Đối chiếu giữa màn hình, frontend service, API, manager và Oracle procedure.
- Làm cơ sở phân tích lỗi liên quan đến trạng thái thiết bị, biên bản, mở khóa, thanh lý và đồng bộ dữ liệu cũ.

Nguồn phân tích chính:

- Frontend: `pages/quanlythietbi`, `services/quanlythietbi`, `components/QLTB`, `hooks/useActionQLTB.js`.
- Backend: `Controllers/QLTB`, `Models/QLTB`.
- Oracle package: `sql_quanlythietbi/spec_PKG_HIEUCT.sql` và `sql_quanlythietbi/body_PKG_HIEUCT.sql`.

Phần SQL trong package còn chứa procedure của menu, tem chỉ và đánh giá GDV. Tài liệu này chỉ trình bày phần liên quan đến QLTB.

## 2. Kiến trúc tổng quát

Luồng gọi thông thường:

```text
Màn hình Next.js/React
    -> service trong services/quanlythietbi
    -> Axios apiClient (/APIPCHY)
    -> ASP.NET Core Controller
    -> Manager
    -> DataHelper
    -> Oracle package KPI0404.PKG_HIEUCT
    -> các bảng TBI_*
```

Frontend sử dụng Next.js 13, React 18 và PrimeReact. Backend sử dụng ASP.NET Core 5 và Oracle Managed Data Access.

`apiClient` gắn `X-Menu-Path` theo URL hiện tại. Quyền truy cập còn phụ thuộc JWT, menu được cấp cho người dùng và đơn vị làm việc hiện tại trong `current_MADVIQLY`.

## 3. Vai trò nghiệp vụ

Các vai trò thường gặp:

| Vai trò | Ý nghĩa chính |
| --- | --- |
| `ADMIN` | Quản trị, có một số quyền thao tác đặc biệt |
| `QLTB_QLP10` | Quản lý thiết bị cấp công ty/P10, đơn vị mã `PA23` |
| `QLTB_QLC4` | Quản lý thiết bị tại đơn vị cấp 4 |

Ngoài role, quyền thao tác trên một biên bản còn phụ thuộc người dùng có phải:

- Người tạo biên bản (`NGUOI_TAO`).
- Người giao/ký cấp 1 (`NGUOI_GIAO`).
- Người nhận/ký cấp 2 (`NGUOI_NHAN`).
- Người kiểm soát thanh lý (`NGUOI_KIEMSOAT`).

Các quy tắc hiển thị nút tập trung tại `hooks/useActionQLTB.js`.

## 4. Các bảng dữ liệu trung tâm

| Bảng | Vai trò |
| --- | --- |
| `TBI_DM_THIETBI_CNTT` | Bản ghi thiết bị chính thức |
| `TBI_DM_NHOM` | Nhóm thiết bị, ví dụ CNTT hoặc đo xa |
| `TBI_DM_CHUNGLOAI` | Chủng loại và cấu hình trường chi tiết |
| `TBI_DM_HANGSX` | Hãng sản xuất |
| `TBI_DM_NUOCSX` | Nước sản xuất |
| `TBI_KHO` | Kho thiết bị |
| `TBI_TRANGTHAI` | Danh mục trạng thái thiết bị |
| `TBI_KIEMTRA_CNTT` | Lịch sử kiểm tra thiết bị |
| `TBI_TB_CNTT_MOKHOA` | Lịch sử đăng ký, duyệt mở và đóng khóa |
| `TBI_BBAN_GIAONHAN_CNTT` | Phần đầu biên bản |
| `TBI_TB_GIAONHAN_CNTT` | Danh sách thiết bị và trạng thái trước/sau của biên bản |
| `TBI_BB_XACNHAN_THANHLY_C4` | Văn bản, người kiểm soát và trạng thái duyệt thanh lý |
| `STG_THIETBI_OLD` | Dữ liệu thiết bị từ hệ thống cũ chờ chuẩn hóa/đồng bộ |

Dữ liệu đơn vị và phòng ban được đọc qua database link từ `QLTB.DM_DONVI@QLTB` và `QLTB.DM_PHONGBAN@QLTB`.

## 5. Trạng thái nghiệp vụ

### 5.1 Trạng thái thiết bị

| ID | Ý nghĩa | Cách phát sinh chính |
| --- | --- | --- |
| `1` | Đang sử dụng | Hoàn thành bàn giao cho phòng ban/người sử dụng |
| `4` | Đã thanh lý | Người kiểm soát duyệt thanh lý |
| `5` | Trong kho | Duyệt thiết bị mới, thu hồi hoặc bàn giao về kho |
| `7` | Chờ duyệt | Trạng thái mặc định khi tạo thiết bị mới |
| `8` | Đang giao nhận/đang nằm trong biên bản | Đặt tạm ngay khi tạo hoặc sửa biên bản chưa hoàn tất |
| `9` | Chờ thanh lý | Kiểm tra không đạt hoặc biên bản thanh lý đã ký đủ hai cấp |

Trạng thái `8` là trạng thái khóa nghiệp vụ tạm thời. Đơn vị, phòng ban, kho và người sử dụng mới chưa được áp dụng vào thiết bị ở bước này; các giá trị dự kiến được lưu trong chi tiết biên bản.

Dashboard quy đổi thiết bị trạng thái `8` như sau:

- Có phòng ban, không có kho: tính vào nhóm đang sử dụng.
- Có kho, không có phòng ban: tính vào nhóm trong kho.

Trạng thái `9` cũng được dashboard tính vào nhóm trong kho.

### 5.2 Trạng thái biên bản

| Giá trị | Ý nghĩa |
| --- | --- |
| `0` | Chờ ký, có thể sửa hoặc xóa |
| `1` | Người giao đã ký cấp 1, chờ người nhận ký cấp 2 |
| `2` | Đã ký đủ và hoàn thành |
| `3` | Đã hủy |

### 5.3 Trạng thái mở khóa

| Giá trị quy đổi | Ý nghĩa |
| --- | --- |
| `0` | Chưa đăng ký mở khóa |
| `1` | Đã đăng ký, chờ duyệt |
| `2` | Đã duyệt mở khóa |
| `3` | Đã khóa lại |

Sau khi một thiết bị đang ở trạng thái mở (`2`) được cập nhật thành công, procedure cập nhật bản ghi mở khóa gần nhất thành `3`, đồng thời ghi ngày và người khóa.

### 5.4 Kết quả kiểm tra

| Giá trị | Ý nghĩa | Tác động lên thiết bị |
| --- | --- | --- |
| `O` | Chưa kiểm tra | Chỉ dùng để lọc danh sách |
| `Y` | Đạt | Chuyển về trạng thái `5 – Trong kho` |
| `N` | Không đạt | Chuyển sang `9 – Chờ thanh lý` |

### 5.5 Trạng thái đồng bộ dữ liệu cũ

| Giá trị | Ý nghĩa |
| --- | --- |
| `0` | Chưa cập nhật/chuẩn hóa |
| `1` | Đã cập nhật, sẵn sàng đồng bộ |
| `2` | Đã đồng bộ thành công |
| `9` | Đồng bộ lỗi |

## 6. Vòng đời thiết bị mới

### 6.1 Tạo trực tiếp hoặc import Excel

Procedure `insert_TBI_DM_THIETBI_CNTT`:

1. Tạo thiết bị với trạng thái mặc định `7 – Chờ duyệt`.
2. Gán `DUYET_TBI = 0`.
3. Nếu đơn vị quản lý là `PA23`, kho luôn được gán là kho CNTT có ID `1`.
4. QR code hiện được backend tạo từ GUID của thiết bị.
5. Serial/NO bị ràng buộc không trùng; lỗi unique được trả thành thông báo “Serial(NO) thiết bị đã tồn tại”.

Các thông tin chính của thiết bị gồm:

- ID, mã thiết bị, QR code, serial/NO và tên.
- Nhóm/chủng loại, hãng sản xuất, nước sản xuất, năm sản xuất.
- Kho, trạng thái, đơn vị, phòng ban và người sử dụng.
- Ngày vận hành, người/ngày tạo và duyệt.
- `THONGTIN_CHITIET_JSON` cho cấu hình động theo chủng loại.
- `IS_FROM_OLD_SYS` để phân biệt thiết bị đồng bộ từ hệ thống cũ.

### 6.2 Duyệt thiết bị mới

Procedure `update_DUYET_TBIMOI` và `update_DUYET_TBIMOI_MULTI`:

1. Ghi người duyệt và ngày duyệt.
2. Đặt `DUYET_TBI = 1`.
3. Chuyển thiết bị sang `5 – Trong kho`.
4. Đồng thời tạo lịch sử kiểm tra kết quả `Y – Đạt` nếu chưa có kết quả đạt phù hợp.

Đây là quy tắc nghiệp vụ chủ đích: chỉ người có thẩm quyền của phòng quản lý được duyệt; hành động duyệt được hiểu là thiết bị đã được kiểm tra, nên hệ thống ghi kết quả `Y` trong cùng luồng để giảm thao tác.

Thiết bị đã duyệt hoặc ID không tồn tại sẽ không được duyệt lại.

## 7. Kiểm tra thiết bị

Màn hình cấp 3 hỗ trợ kiểm tra một hoặc nhiều thiết bị và xem lịch sử.

Procedure ghi kiểm tra:

- `INSERT_KIEMTRATB_CNTT`.
- `INSERT_KIEMTRATB_CNTT_MULTI`.

Dữ liệu lịch sử gồm thiết bị, đơn vị kiểm tra, người kiểm tra, ngày kiểm tra, kết quả và ghi chú.

Danh sách kiểm tra sử dụng kết quả gần nhất của từng thiết bị. Cờ phục vụ giao diện:

- `CO_THE_KIEMTRA = Y` khi thiết bị ở kho CNTT và có trạng thái `5`, `7` hoặc `9`.
- `CAN_XU_LY = Y` khi kết quả gần nhất là `N` và thiết bị chưa từng có trong biên bản giao nhận. Cờ này phục vụ việc xác định khả năng xử lý/xóa ở giao diện.

## 8. Đăng ký và duyệt mở khóa

Chỉ thiết bị đã duyệt và đang ở trạng thái `1 – Đang sử dụng` hoặc `5 – Trong kho` xuất hiện trong danh sách đăng ký mở khóa.

Luồng:

```text
Thiết bị đang khóa
    -> Cấp 4 đăng ký mở khóa (trạng thái 1)
    -> Cấp 3 duyệt (trạng thái 2)
    -> Người được phép cập nhật thiết bị
    -> Cập nhật xong tự khóa lại (trạng thái 3)
```

Procedure chính:

- `GET_MOKHOA_TBI_CNTT_V2`: lấy thiết bị có thể đăng ký.
- `INSERT_DKMOKHOA`/`INSERT_DKMOKHOA_MULTI`: tạo yêu cầu trạng thái `1`.
- `GET_DUYETMOKHOA_CNTT_V2`: lấy yêu cầu đang chờ duyệt.
- `UPDATE_MOKHOA`/`UPDATE_MOKHOA_MULTI`: chuyển yêu cầu `1 -> 2`.
- `DELETE_DKMOKHOA`/`DELETE_DKMOKHOA_MULTI`: hủy yêu cầu đang chờ.
- `update_TBI_DM_THIETBI_CNTT`: sau khi sửa thiết bị, chuyển yêu cầu mở gần nhất `2 -> 3`.

Thiết bị có bản ghi mở khóa gần nhất chưa đóng (`TRANG_THAI <> 3`) không được chọn vào biên bản giao nhận.

## 9. Loại biên bản và mã nghiệp vụ

### 9.1 Loại biên bản

| `LOAI_BBAN` | Ý nghĩa |
| --- | --- |
| `0` | Bàn giao |
| `1` | Thu hồi |
| `2` | Trả lại từ đơn vị cấp 4 |
| `3` | Kiểm tra/xác nhận thanh lý |

### 9.2 Mã nghiệp vụ

| Mã | Ý nghĩa |
| --- | --- |
| `BGC3` | P10 bàn giao cho phòng ban công ty |
| `BGC4` | P10 bàn giao cho đơn vị cấp 4 |
| `BGSD` | Đơn vị cấp 4 bàn giao cho người sử dụng |
| `THC3` | Thu hồi từ phòng ban công ty về kho CNTT |
| `THSD` | Đơn vị cấp 4 thu hồi từ người sử dụng về kho đơn vị |
| `THC4` | Đơn vị cấp 4 trả lại thiết bị về công ty |
| `TLC3` | Kiểm tra/xác nhận thanh lý thiết bị CNTT tại cấp 3 |
| `TLC4` | Kiểm tra/xác nhận thanh lý thiết bị CNTT tại cấp 4 |

## 10. Điều kiện chọn thiết bị vào biên bản

Điều kiện chung:

- Thiết bị đã duyệt (`DUYET_TBI = 1`).
- Không có yêu cầu mở khóa đang chờ hoặc đang mở.
- Thiết bị từ hệ thống cũ (`IS_FROM_OLD_SYS = 1`) được phép tham gia trực tiếp.
- Thiết bị tạo mới (`IS_FROM_OLD_SYS = 0`) phải có kết quả kiểm tra gần nhất là `Y`.
- Thiết bị không được đồng thời nằm trong biên bản khác có trạng thái `0` hoặc `1`.

Điều kiện theo nghiệp vụ:

| Nghiệp vụ | Điều kiện thiết bị |
| --- | --- |
| `BGC3`, `BGC4` | Thuộc PA23, kho `1`, trạng thái `5`, chưa có người sử dụng |
| `BGSD` | Không thuộc PA23, trạng thái `5`, có kho, chưa có người sử dụng |
| `THC3` | Thuộc PA23, trạng thái `1`, không có kho, phòng ban thiết bị trùng phòng ban trả |
| `THSD` | Không thuộc PA23, trạng thái `1`, không có kho, phòng ban thiết bị trùng phòng ban trả |
| `THC4` | Không thuộc PA23, trạng thái `5`, có kho và chưa có người sử dụng |
| `TLC3` | Thuộc PA23, kho `1`, trạng thái `5`, chưa có người sử dụng và thuộc nhóm CNTT |
| `TLC4` | Không thuộc PA23, trạng thái `5`, có kho, chưa có người sử dụng và thuộc nhóm CNTT |

Khi sửa biên bản, danh sách chọn luôn kèm lại các thiết bị đã có trong chính biên bản đó để người dùng có thể giữ hoặc bỏ chọn.

## 11. Luồng biên bản giao nhận, thu hồi và trả lại

### 11.1 Tạo biên bản

Procedure `INSERT_BBAN_GIAONHAN_CNTT`:

1. Kiểm tra thông tin đơn vị, phòng ban, người giao, người nhận và ngày lập.
2. Parse danh sách thiết bị từ JSON; tối đa 500 thiết bị.
3. Kiểm tra thiết bị tồn tại và không nằm trong biên bản `0/1` khác.
4. Tạo phần đầu biên bản ở trạng thái `0`.
5. Lưu trạng thái cũ và trạng thái dự kiến của từng thiết bị vào bảng chi tiết.
6. Chuyển thiết bị chính sang trạng thái tạm `8`.

Trạng thái dự kiến sau khi hoàn thành:

| Nghiệp vụ | Đơn vị/phòng ban/kho/người sử dụng mới | Trạng thái mới |
| --- | --- | --- |
| `BGC3` | Đơn vị nhận, phòng ban nhận, không kho, người dùng được chọn | `1` |
| `BGSD` | Đơn vị nhận, phòng ban nhận, không kho, người dùng được chọn | `1` |
| `BGC4` | Đơn vị cấp 4 nhận, không phòng ban, kho nhận, không người dùng | `5` |
| `THC3` | PA23, không phòng ban, kho CNTT `1`, không người dùng | `5` |
| `THSD` | Đơn vị cấp 4, không phòng ban, kho nhận của đơn vị, không người dùng | `5` |
| `THC4` | PA23, không phòng ban, kho CNTT `1`, không người dùng | `5` |

### 11.2 Sửa biên bản

Chỉ biên bản trạng thái `0` được sửa.

Procedure `UPDATE_BBAN_GIAONHAN_CNTT`:

- Thiết bị bị bỏ khỏi biên bản được phục hồi trạng thái cũ.
- Chi tiết bị bỏ được xóa.
- Thiết bị mới được thêm với ảnh chụp trạng thái hiện tại và trạng thái dự kiến.
- Người sử dụng dự kiến được cập nhật cho `BGC3` và `BGSD`.
- Toàn bộ thiết bị còn nằm trong biên bản được chuyển sang trạng thái tạm `8`.

### 11.3 Ký cấp 1

Procedure `ky_so_C1_GIAONHAN_THIETBI` chỉ cho phép ký khi biên bản ở trạng thái `0`.

Đối với `BGC3` và `BGSD`, các chủng loại có `CAN_CHON_NSD = Y` bắt buộc phải có `NGUOI_SD_MOI` trước khi ký.

Kết quả ký cấp 1:

- `TRANG_THAI = 1`.
- `NGAY_GIAO = SYSDATE`.

### 11.4 Ký cấp 2

Procedure `ky_so_C2_GIAONHAN_THIETBI` chỉ cho phép ký khi biên bản ở trạng thái `1`.

Kết quả:

1. Biên bản chuyển sang `2`, ghi `NGAY_NHAN`.
2. Với biên bản không phải thanh lý, các giá trị dự kiến trong bảng chi tiết được merge vào thiết bị chính:
   - Đơn vị quản lý.
   - Phòng ban.
   - Kho.
   - `DM_DONVI_ID`.
   - Người sử dụng.
   - Trạng thái.
   - `LAST_BBAN_ID`.
3. Với biên bản thanh lý, chỉ trạng thái dự kiến và `LAST_BBAN_ID` được áp dụng ở bước ký.

### 11.5 Xóa và hủy

`DELETE_BBAN_GIAONHAN_CNTT`:

- Chỉ xóa biên bản trạng thái `0`.
- Phục hồi trạng thái cũ cho thiết bị.
- Xóa chi tiết rồi xóa phần đầu biên bản.

`HUY_BBAN_GIAONHAN_CNTT`:

- Chỉ hủy biên bản trạng thái `1`.
- Phục hồi trạng thái cũ cho thiết bị.
- Chuyển biên bản sang `3`, ghi người và ngày hủy.

## 12. Luồng thanh lý

### 12.1 Lập biên bản kiểm tra thanh lý

Procedure `INSERT_BBAN_KIEMTRA_TBI_CNTT` và `UPDATE_BBAN_KIEMTRA_TBI_CNTT` nhận thêm:

- Tình trạng thiết bị.
- Nguyên nhân đề nghị thanh lý.

Khi lập biên bản:

- Trạng thái dự kiến của thiết bị là `9 – Chờ thanh lý`.
- Trong thời gian chờ ký, thiết bị chính ở trạng thái tạm `8`.
- Sau khi ký cấp 2, thiết bị chuyển sang `9`.

### 12.2 Bổ sung hồ sơ thanh lý

Thông tin được lưu tại `TBI_BB_XACNHAN_THANHLY_C4`:

- Biên bản liên quan.
- File văn bản.
- Số văn bản.
- Người tạo.
- Người kiểm soát.
- Trạng thái duyệt, mặc định `0`.

### 12.3 Duyệt thanh lý

Procedure `DUYET_THANH_LY_CNTT` khóa bản ghi bằng `FOR UPDATE`, sau đó kiểm tra:

- Hồ sơ chưa được duyệt.
- Tài khoản thực hiện đúng bằng `NGUOI_KIEMSOAT` đã chỉ định.

Khi duyệt thành công:

- Hồ sơ thanh lý chuyển sang trạng thái `1` và ghi thời gian xác nhận.
- Thiết bị chuyển sang `4 – Đã thanh lý`.
- Kho được gán ID `26`.
- Đơn vị quản lý chuyển về `PA23`.
- `DM_DONVI_ID` được gán ID đơn vị PA23 đang hard-code trong procedure.

## 13. Đồng bộ thiết bị từ hệ thống cũ

### 13.1 Chuẩn hóa staging

Người dùng cập nhật bản ghi `STG_THIETBI_OLD` trước khi đồng bộ. Procedure kiểm tra tính nhất quán theo trạng thái:

- Thiết bị chưa duyệt phải ở trạng thái `7`, kho CNTT `1`, không có phòng ban và người sử dụng.
- Thiết bị đang sử dụng (`1`) phải có phòng ban; nếu chủng loại yêu cầu chọn người dùng thì phải có người dùng; không được có kho.
- Thiết bị trong kho/chờ hoặc đã thanh lý (`4`, `5`, `9`) phải có kho, không có phòng ban và người sử dụng.

Sau khi hợp lệ, `SYNC_STATUS` chuyển thành `1` và xóa thông tin lỗi đồng bộ cũ.

### 13.2 Đồng bộ chính thức

`sync_one_TBI_from_STG`:

1. Khóa hàng bằng `FOR UPDATE NOWAIT`.
2. Chỉ nhận bản ghi `SYNC_STATUS = 1`.
3. Kiểm tra trùng ID và serial/NO.
4. Insert vào `TBI_DM_THIETBI_CNTT` với `IS_FROM_OLD_SYS = 1`.
5. Chuyển staging sang `SYNC_STATUS = 2`.
6. Nếu lỗi nghiệp vụ, ghi `SYNC_STATUS = 9` và `SYNC_ERROR`.

`sync_list_TBI_from_STG` giới hạn tối đa 500 thiết bị, dùng `IS_LOCKED`, `LOCK_BY`, `LOCK_DATE` để tránh hai tiến trình cùng xử lý một bản ghi.

## 14. Báo cáo

Các nhóm báo cáo chính:

- Chi tiết thiết bị.
- Lịch sử giao nhận theo thiết bị.
- Số lượng thiết bị trên dashboard.
- Tổng hợp thiết bị theo đơn vị, nhóm, chủng loại và trạng thái.
- Đồng bộ thiết bị cũ: tổng số, đã đồng bộ, chưa đồng bộ và lỗi.
- Tình trạng cấp phát sau khi P10 bàn giao về đơn vị cấp 4.
- Tổng hợp biên bản cấp 3/cấp 4 theo trạng thái ký.

Báo cáo tình trạng cấp phát dùng:

- `BGC4` hoàn thành làm mốc bàn giao về đơn vị.
- Lần `BGSD` hoàn thành đầu tiên sau mốc đó làm ngày cấp phát.
- Phân loại: đã cấp trong kỳ, cấp sau kỳ hoặc chưa cấp.

## 15. Ánh xạ frontend, API và procedure

| Nhóm | Frontend service | Controller | Procedure tiêu biểu |
| --- | --- | --- | --- |
| Danh mục/thiết bị | `QLTB_DANH_MUC_Service.js` | `QLTB_DANH_MUCController` | `get_TBI_DM_THIETBI_CNTT_V2`, `insert_TBI_DM_THIETBI_CNTT` |
| Đăng ký mở khóa | `QLTB_DangKyMoKhoaTBService.js` | `QLTB_DangKyMoKhoaTBController` | `GET_MOKHOA_TBI_CNTT_V2`, `INSERT_DKMOKHOA` |
| Duyệt thiết bị/mở khóa | `QLTB_DuyetMoKhoaTBService.js` | `QLTB_DuyetMoKhoaTBController` | `update_DUYET_TBIMOI`, `UPDATE_MOKHOA` |
| Kiểm tra | `QLTB_KiemTraTBService.js` | `QLTB_KiemTraTBController` | `GET_KIEMTRA_TB_CNTT_V2`, `INSERT_KIEMTRATB_CNTT` |
| Giao nhận/thanh lý | `QLTB_GiaoNhanThietBi.js` | `QLTB_GiaoNhanThietBiController` | `INSERT_BBAN_GIAONHAN_CNTT`, `ky_so_C1_GIAONHAN_THIETBI`, `DUYET_THANH_LY_CNTT` |
| Đồng bộ cũ | `QLTB_Dongbodulieu.js` | `QLTB_DongbodulieuController` | `update_STG_THIETBI_OLD`, `sync_one_TBI_from_STG` |
| Báo cáo | `QLTB_BaoCaoService.js` | `QLTB_BAOCAOController` | Nhóm `GET_BC_*`, `GET_DASHBOARD_THIETBI_CNTT` |

Ký số đi qua `components/QLTB/*Viewer`, `utils/pdfUtils.js`, `services/pdfService.js`, `API_PDFController` và `PdfSignService`. Sau khi ký PDF thành công, backend gọi procedure ký cấp tương ứng để chuyển trạng thái nghiệp vụ.

## 16. Các lưu ý kỹ thuật khi bảo trì

### 16.1 Duyệt đồng thời là kiểm tra đạt

Việc duyệt thiết bị mới tự tạo kết quả kiểm tra `Y` là đúng nghiệp vụ hiện hành. Không tách hai bước này nếu chưa có yêu cầu thay đổi nghiệp vụ từ phòng quản lý.

### 16.2 Trạng thái `8` phải được phục hồi đúng

Mọi thay đổi ở luồng tạo/sửa/xóa/hủy biên bản cần bảo đảm:

- Thiết bị mới thêm được chuyển sang `8`.
- Thiết bị bị bỏ chọn được trả về `TRANGTHAI_CU_ID`.
- Xóa/hủy biên bản phục hồi toàn bộ thiết bị liên quan.
- Chỉ ký cấp 2 mới áp dụng trạng thái và vị trí đích.

### 16.3 DataHelper bind tham số theo vị trí

`DataHelper.ExcuteNonQuery_v2` không bật `OracleCommand.BindByName`. Vì vậy tham số đang được bind theo vị trí, kể cả khi tên tham số truyền từ manager không trùng đúng vị trí khai báo trong procedure.

Một số lời gọi tạo biên bản có tên `P_MA_DVI_GIAO` và `P_LOAI_NGHIEPVU` sắp không giống package nhưng giá trị lại được sắp theo thứ tự procedure. Hiện tại có thể vẫn chạy do bind theo vị trí; nếu bật `BindByName` phải sửa đồng bộ toàn bộ lời gọi.

### 16.4 Kết quả đồng bộ hàng loạt cần kiểm tra thêm

`sync_one_TBI_from_STG` bắt lỗi và ghi lỗi vào staging nhưng không ném lỗi lại. `sync_list_TBI_from_STG` lại tăng biến thành công ngay sau khi gọi procedure con. Vì vậy thông báo tổng hợp có khả năng báo thành công dù một số bản ghi đã chuyển sang `SYNC_STATUS = 9`.

Khi xử lý yêu cầu liên quan đồng bộ hàng loạt, cần kiểm tra cả thông báo trả về và trạng thái thực tế của từng bản ghi staging.

### 16.5 Import với tùy chọn duyệt ngay

Backend import có truyền `duyet_tbi = 1` khi chọn duyệt ngay. Tuy nhiên procedure insert hiện vẫn khởi tạo `i_DUYET_TBI = 0` và trạng thái `7`; các dòng gán sang duyệt/trong kho đang comment.

Nếu phát sinh yêu cầu sửa import, cần xác nhận lại mong muốn nghiệp vụ trước khi thay đổi: import luôn chờ duyệt hay tài khoản có thẩm quyền được import và duyệt ngay.

### 16.6 Xóa thiết bị

Procedure xóa thiết bị chỉ kiểm tra bản ghi tồn tại. Các điều kiện như chưa duyệt hoặc chưa có lịch sử hiện chủ yếu được kiểm soát ở giao diện hoặc bởi ràng buộc cơ sở dữ liệu.

Không mở rộng quyền xóa hoặc gọi trực tiếp endpoint xóa khi chưa kiểm tra lịch sử biên bản và khóa ngoại.

### 16.7 Kích thước thông báo lỗi

`DataHelper.ExcuteNonQuery_v2` khai báo output `VARCHAR2` dài 200 ký tự. Một số procedure hàng loạt có thể tạo thông báo dài hơn. Nếu gặp lỗi không rõ nguyên nhân hoặc thông báo bị thiếu, cần kiểm tra giới hạn này.

## 17. Trình tự đọc code đề xuất

Khi cần điều tra một yêu cầu QLTB, nên đọc theo thứ tự:

1. Màn hình tương ứng trong `pages/quanlythietbi`.
2. Service trong `services/quanlythietbi`.
3. Controller và model request/response trong backend.
4. Manager để xác định procedure và thứ tự tham số.
5. Package spec để xác định contract.
6. Package body để xác định điều kiện, DML và chuyển trạng thái thực tế.
7. `useActionQLTB.js` và component viewer nếu liên quan nút thao tác hoặc ký số.

Các câu hỏi cần trả lời khi phân tích lỗi:

- `current_MADVIQLY` đang là đơn vị nào?
- User có role/menu nào và có đúng là người tạo, người giao, người nhận hoặc người kiểm soát không?
- Thiết bị hiện có `DUYET_TBI`, `TBI_TRANGTHAI_ID`, kho, phòng ban và người sử dụng nào?
- Có yêu cầu mở khóa gần nhất chưa đóng không?
- Có biên bản trạng thái `0` hoặc `1` đang giữ thiết bị không?
- Kết quả kiểm tra gần nhất là gì?
- Thiết bị là dữ liệu mới hay `IS_FROM_OLD_SYS = 1`?
- Thứ tự tham số từ manager có khớp thứ tự khai báo procedure không?

## 18. Kết luận ngắn

Phân hệ QLTB quản lý thiết bị theo hai lớp trạng thái:

- Trạng thái hiện tại trên thiết bị chính.
- Trạng thái trước/sau được lưu trong chi tiết biên bản.

Thiết bị bị khóa tạm bằng trạng thái `8` trong lúc biên bản chưa hoàn thành. Ký cấp 2 là điểm commit nghiệp vụ chuyển quyền quản lý/vị trí sử dụng; xóa hoặc hủy là đường hoàn tác. Duyệt thiết bị mới đồng thời ghi nhận kiểm tra đạt. Thanh lý có thêm một bước phê duyệt của người kiểm soát sau khi biên bản đã ký đủ.
