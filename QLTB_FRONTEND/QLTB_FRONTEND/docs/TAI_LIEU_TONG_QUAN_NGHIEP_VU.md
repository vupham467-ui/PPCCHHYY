# Tài liệu tổng quan nghiệp vụ dự án PCHY_QLTB_FRONTEND

## 1. Mục đích

Tài liệu này dành cho người mới tiếp nhận dự án ở góc nhìn nghiệp vụ, giúp:

- Hiểu hệ thống này phục vụ những mảng công việc nào
- Nhận diện các phân hệ và chức năng chính
- Nắm được luồng xử lý tổng quát của từng module
- Biết nên bắt đầu từ đâu khi cần bàn giao, kiểm thử hoặc phân tích yêu cầu

## 2. Tổng quan hệ thống

Đây là hệ thống frontend nội bộ dùng chung cho nhiều bài toán vận hành của đơn vị. Người dùng đăng nhập một lần và được cấp quyền theo vai trò, đơn vị quản lý và phân hệ được phép sử dụng.

Hệ thống hiện đang bao phủ các mảng chính:

- Quản trị hệ thống
- Quản lý kìm chì
- Quản lý thiết bị
- Quản lý vận hành
- Đánh giá giao dịch viên

Ngoài ra còn có dấu vết của phân hệ quản lý thí nghiệm, nhưng hiện chưa thấy đầy đủ màn hình nghiệp vụ trên frontend trong repo này.

## 3. Cách hệ thống vận hành ở mức người dùng

## 3.1 Đăng nhập

Người dùng vào hệ thống qua trang đăng nhập hoặc SSO. Sau khi đăng nhập:

- Hệ thống lấy thông tin người dùng
- Xác định danh sách đơn vị mà người dùng được thao tác
- Xác định menu và route được phép truy cập

## 3.2 Chọn đơn vị làm việc

Một người dùng có thể được phép thao tác trên nhiều đơn vị. Tại góc trên hệ thống có ô chuyển đơn vị.

Đơn vị đang chọn ảnh hưởng trực tiếp tới:

- Dữ liệu nhìn thấy
- Danh sách bản ghi được tìm kiếm
- Một số quyền thao tác
- Dashboard và báo cáo

## 3.3 Chọn phân hệ

Hệ thống không cố định một menu duy nhất. Menu sẽ thay đổi theo:

- Quyền người dùng
- App code hoặc phân hệ đang mở

Người dùng cấp quản trị có thể thấy thêm menu quản trị hệ thống.

## 4. Các phân hệ nghiệp vụ

## 4.1 Quản trị hệ thống

Mục tiêu:

- Quản lý người dùng
- Quản lý vai trò, nhóm quyền
- Quản lý menu
- Quản lý đơn vị, phòng ban

Chức năng chính:

- Tạo và cập nhật người dùng
- Khóa/mở khóa tài khoản
- Reset mật khẩu
- Gán quyền cho người dùng
- Tạo/cập nhật menu để điều khiển quyền truy cập

Đây là phân hệ ảnh hưởng trực tiếp tới toàn bộ hệ thống vì menu và quyền đi từ đây.

## 4.2 Quản lý kìm chì

Đây là phân hệ nghiệp vụ lớn và phức tạp nhất trong repo hiện tại.

Các nhóm chức năng:

- Danh mục kìm
- Kho tem chì
- Giao nhận kìm
- Giao nhận tem/chì cấp 3
- Giao nhận tem/chì cấp 4
- Nhập lại tem chì
- Quyết toán chì
- Báo cáo tổng hợp, chi tiết, thống kê

### Luồng nghiệp vụ tổng quát

1. Quản lý danh mục và tồn kho
2. Tạo biên bản giao hoặc nhận
3. Ký số theo từng vai trò
4. Sau khi giao nhận hoàn tất, một số loại biên bản có thể chuyển sang quyết toán hoặc thu hồi
5. Nhập chi tiết quyết toán
6. Tạo biên bản quyết toán
7. Ký số hoàn tất biên bản quyết toán
8. Tổng hợp lên báo cáo

### Những điểm nghiệp vụ cần nhớ

- Có sự phân biệt cấp công ty, cấp 3 và cấp 4
- Một số thao tác chỉ được phép với người giao, người nhận hoặc người quản lý
- Nhiều luồng kết thúc bằng bước ký số trước khi trạng thái chính thức thay đổi

### Luồng giao nhận tem/chì

Đây là một trong những luồng cốt lõi:

1. Tạo biên bản giao hoặc nhận tem/chì
2. Người giao ký cấp 1
3. Người nhận ký cấp 2
4. Biên bản hoàn tất
5. Tùy loại nghiệp vụ có thể phát sinh thu hồi hoặc quyết toán

### Luồng quyết toán chì

Luồng này phức tạp hơn:

1. Chọn biên bản giao nhận đã đủ điều kiện
2. Mở trang chi tiết quyết toán
3. Nhập dữ liệu quyết toán trực tiếp hoặc lấy từ nguồn khác như CMIS
4. Tạo phiếu quyết toán
5. Ký số nhiều cấp

Theo logic hiện tại, quyết toán có thể qua 3 cấp:

- Người quyết toán
- Người quản lý
- Trưởng đơn vị

### Báo cáo trong QLTB

Nhóm báo cáo hiện có:

- Báo cáo tổng hợp
- Báo cáo chi tiết kìm
- Báo cáo chi tiết sử dụng chì
- Báo cáo giao nhận kìm
- Báo cáo quyết toán chì
- Báo cáo kiểm tra trùng lặp
- Báo cáo thống kê biên bản

## 4.3 Quản lý thiết bị

Phân hệ này phục vụ quản lý vòng đời thiết bị từ danh mục đến giao nhận, thu hồi và thanh lý.

Các nhóm chức năng:

- Danh mục thiết bị
- Danh mục nhóm, chủng loại, hãng, nước sản xuất, kho
- Đăng ký mở khóa
- Duyệt mở khóa
- Duyệt thiết bị mới
- Giao nhận thiết bị
- Thu hồi thiết bị
- Trả lại thiết bị
- Thanh lý thiết bị
- Đồng bộ dữ liệu cũ
- Báo cáo

### Luồng nghiệp vụ chính

#### A. Đăng ký mở khóa thiết bị

Phía đơn vị cấp 4 có thể tìm thiết bị đủ điều kiện và gửi đăng ký mở khóa.

Luồng khái quát:

1. Lọc thiết bị theo đơn vị, nhóm, chủng loại, trạng thái
2. Chọn thiết bị đủ điều kiện
3. Tạo đăng ký mở khóa
4. Chuyển lên cấp duyệt

#### B. Duyệt mở khóa

Phía cấp 3 hoặc đơn vị quản lý sẽ xem các đăng ký:

- Duyệt mở khóa
- Duyệt thiết bị mới

Đây là bước xác nhận nghiệp vụ trước khi thiết bị được chuyển trạng thái thực tế.

#### C. Giao nhận thiết bị

Luồng tương tự nhiều biên bản giao nhận khác:

1. Tạo biên bản giao nhận
2. Người giao ký
3. Người nhận ký
4. Biên bản hoàn tất

#### D. Thu hồi, trả lại, thanh lý

Sau khi thiết bị đã được giao:

- Có thể bị thu hồi
- Có thể trả lại từ đơn vị cấp 4
- Có thể chuyển sang thanh lý nếu đủ điều kiện

Thanh lý là luồng có thêm nhiều bước hơn:

1. Tạo hồ sơ/thông tin thanh lý
2. Có thể có biên bản kiểm tra thanh lý
3. Người kiểm soát duyệt thanh lý
4. Thiết bị chuyển trạng thái đã thanh lý

### Báo cáo trong QLTB

Nhóm báo cáo hiện có:

- Báo cáo chi tiết thiết bị
- Báo cáo tổng hợp thiết bị
- Báo cáo giao nhận thiết bị
- Báo cáo thống kê biên bản
- Báo cáo đồng bộ thiết bị cũ

### Dashboard của QLTB

Trang chủ thể hiện:

- Tổng số thiết bị
- Số chờ duyệt
- Số đang sử dụng
- Số trong kho
- Số đã thanh lý

## 4.4 Quản lý vận hành

Phân hệ này tập trung vào theo dõi vận hành, trong đó hạt nhân là sổ trực vận hành.

Các nhóm chức năng:

- Sổ trực vận hành
- Danh mục máy chủ
- Danh mục thiết bị
- Danh mục hạng mục/loại phiếu
- Báo cáo tổng hợp lỗi
- Báo cáo tổng hợp theo dõi

### Luồng nghiệp vụ chính của sổ trực

1. Tạo phiếu trực
2. Nhập nội dung vận hành theo mẫu
3. Lưu phiếu
4. Ký số phiếu
5. Xem lại biên bản/PDF
6. Tổng hợp báo cáo

Đặc điểm:

- Đây là luồng đơn giản hơn so với QLTB và QLTB
- Thường là một cấp ký
- Dữ liệu của phiếu được tổ chức theo nội dung cấu trúc

## 4.5 Đánh giá giao dịch viên

Đây là phân hệ báo cáo, không phải phân hệ tác nghiệp nhiều bước.

Chức năng chính:

- Báo cáo tổng hợp đánh giá giao dịch viên
- Báo cáo chi tiết đánh giá

Các bộ lọc thường gặp:

- Đơn vị quản lý
- Giao dịch viên
- Tháng đánh giá

Kết quả báo cáo tổng hợp hiện đang được nhóm theo từng nhân viên, bao gồm:

- Tổng số lượt đánh giá
- Tổng điểm
- Tỷ lệ/tổng hợp theo từng phân loại đánh giá

## 4.6 Quản lý thí nghiệm

Từ dấu hiệu trong code, phân hệ này từng được thiết kế cho các bước:

- Tạo yêu cầu thí nghiệm
- Giao nhiệm vụ
- Khảo sát phương án
- Gắn thiết bị vào yêu cầu
- Ghi nhận chi tiết thí nghiệm
- Bàn giao kết quả
- Ký số và xuất file đã ký

Tuy nhiên, do chưa thấy route đầy đủ trong `pages`, phần này đã tách sang hẳn 1 repo mới.

## 5. Vai trò và phân quyền ở góc nhìn nghiệp vụ

Một số vai trò được thể hiện trong code:

- `ADMIN`
- `ADMIN_DL`
- `LDP6`
- `QLP6`
- `LDC4`
- `QLC4`
- `NVTT`
- `QLTB_QLP10`
- `QLTB_QLC4`

Về bản chất, quyền của người dùng phụ thuộc vào:

- Vai trò
- Đơn vị đang làm việc
- Menu được backend trả về
- Route được phép truy cập
- Trạng thái hiện tại của chứng từ/biên bản

Điều quan trọng là không phải cứ nhìn thấy dữ liệu là thao tác được. Nhiều nút chỉ hiện khi:

- Đúng người tạo
- Đúng người nhận
- Đúng người duyệt
- Đúng trạng thái chứng từ

## 6. Ký số trong nghiệp vụ

Ký số là mắt xích quan trọng ở nhiều phân hệ:

- Quản lý kìm chì
- Quản lý thiết bị
- Quản lý vận hành

Ký số không chỉ để xem tài liệu mà còn là bước chuyển trạng thái nghiệp vụ.

Ví dụ:

- Biên bản giao nhận chưa ký thì chưa được xem là hoàn tất
- Phiếu quyết toán chưa ký đủ cấp thì chưa hoàn thành quy trình
- Phiếu trực vận hành chưa ký thì chưa chốt nội dung

## 7. Báo cáo và dashboard

Hệ thống có 2 kiểu tổng hợp dữ liệu:

- Dashboard ở trang chủ
- Báo cáo theo từng phân hệ

Dashboard hiện đang thiên về:

- Kìm/chì
- Thiết bị

Báo cáo theo phân hệ thì đi sâu hơn vào:

- Chi tiết từng loại chứng từ
- Thống kê theo trạng thái
- Thống kê theo đơn vị
- Thống kê theo thời gian

## 8. Gợi ý tiếp nhận nghiệp vụ cho người mới

## 8.1 Nếu là BA hoặc người bàn giao

Nên đi theo thứ tự:

1. Quản trị hệ thống
2. Quản lý kìm chì
3. Quản lý thiết bị
4. Quản lý vận hành
5. Đánh giá giao dịch viên

Lý do:

- Quản trị hệ thống giải thích ai được làm gì
- QLTB là phân hệ phức tạp nhất
- QLTB là phân hệ có nhiều bước trạng thái
- QLVH đơn giản hơn, dễ nắm sau
- Đánh giá GDV chủ yếu là báo cáo

## 8.2 Nếu là tester

Nên học theo các kịch bản end-to-end:

1. Đăng nhập bằng tài khoản công ty
2. Chuyển đơn vị
3. Tạo và ký một biên bản giao nhận
4. Mở một trang quyết toán
5. Chạy một báo cáo tổng hợp
6. Kiểm tra khác biệt giữa người có quyền và không có quyền

## 8.3 Nếu là quản lý dự án hoặc người nhận bàn giao tổng thể

Nên xác nhận thêm 5 điểm:

1. Danh sách vai trò đang dùng thực tế
2. Những route nào đang sử dụng thật trên production
3. Module quản lý thí nghiệm còn dùng hay không
4. Quy trình ký số phụ thuộc hệ thống ngoài nào
5. Những báo cáo nào là trọng yếu trong vận hành hàng ngày

## 9. Những điểm cần lưu ý khi bàn giao

### 9.1 Quyền và menu đi từ backend

Nếu bàn giao chỉ bằng cách mô tả giao diện thì chưa đủ. Cần làm rõ:

- Ai được cấp menu nào
- Ai được ký bước nào
- Ai được thao tác trên đơn vị nào

### 9.2 Nhiều quy trình khác nhau giữa cấp công ty và cấp đơn vị

Ví dụ:

- Đơn vị công ty thường được xem rộng hơn
- Đơn vị cấp 4 thường bị giới hạn dữ liệu và thao tác

### 9.3 Có nhiều trạng thái trung gian

Đặc biệt ở:

- Giao nhận tem/chì
- Quyết toán
- Giao nhận thiết bị
- Thanh lý thiết bị

Khi bàn giao, cần giải thích rõ trạng thái nào là “được tạo”, “đã ký”, “hoàn tất”, “đã duyệt”, “đã hủy”.

## 10. Kết luận

Ở góc nhìn nghiệp vụ, đây là một hệ thống quản trị nội bộ đa phân hệ, trong đó:

- Quản lý kìm chì là trục nghiệp vụ lớn nhất
- Quản lý thiết bị là trục quản lý vòng đời tài sản/thiết bị
- Quản lý vận hành là trục ghi nhận và tổng hợp vận hành
- Đánh giá giao dịch viên là trục báo cáo chất lượng phục vụ
- Quản trị hệ thống là nền tảng để tất cả các phân hệ hoạt động

Người mới tiếp nhận không nên cố hiểu tất cả chi tiết ngay từ đầu. Cách hiệu quả nhất là:

1. Hiểu quyền và đơn vị làm việc
2. Chọn một luồng end-to-end của từng phân hệ
3. Đối chiếu lại với menu thực tế và dữ liệu thật trên hệ thống
