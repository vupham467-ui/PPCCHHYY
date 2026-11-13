# Đánh giá kỹ thuật dự án PCHY_QLTB_FRONTEND

## 1. Mục tiêu tài liệu

Tài liệu này là bản đánh giá kỹ thuật ở mức quản trị dự án và kiến trúc, nhằm trả lời 4 câu hỏi:

- Dự án đang mạnh ở đâu
- Rủi ro kỹ thuật nằm ở đâu
- Nợ kỹ thuật hiện tại ảnh hưởng thế nào đến bảo trì và mở rộng
- Nếu tiếp tục đầu tư, nên cải tiến theo lộ trình nào

Đây không phải tài liệu review bug theo từng file, mà là đánh giá ở mức hệ thống.

## 2. Kết luận ngắn

Đây là một dự án có giá trị nghiệp vụ thực tế cao, đã số hóa được nhiều quy trình quan trọng, và đang chạy trên stack frontend đủ ổn định để tiếp tục duy trì.

Tuy nhiên, về mặt kỹ thuật, dự án đang mang đặc trưng của một hệ thống phát triển mở rộng dần theo nhu cầu:

- Nghiệp vụ mạnh hơn kiến trúc
- Chạy được và dùng được, nhưng chi phí bảo trì sẽ tăng nếu tiếp tục mở rộng theo cách hiện tại
- Phụ thuộc khá nặng vào backend, localStorage và logic page-level

Đánh giá tổng quát:

- Giá trị nghiệp vụ: cao
- Độ ổn định công nghệ: khá
- Mức độ chuẩn hóa kiến trúc frontend: trung bình
- Khả năng mở rộng dài hạn nếu không tái cấu trúc: trung bình đến thấp
- Khả năng tiếp nhận của người mới: trung bình

## 3. Điểm tốt của dự án

## 3.1 Stack công nghệ hợp lý cho hệ thống nội bộ

Dự án dùng:

- Next.js
- React
- PrimeReact
- Axios
- Sass

Đây là lựa chọn phù hợp cho hệ thống có nhiều:

- form nhập liệu
- bảng dữ liệu
- dialog
- báo cáo
- dashboard

Ưu điểm:

- Công nghệ phổ biến, dễ tuyển người
- Dev mới không cần học stack quá lạ
- PrimeReact phù hợp với bài toán back-office
- Không có phụ thuộc frontend quá dị biệt hoặc khó bảo trì

## 3.2 Độ phủ nghiệp vụ tốt

Điểm mạnh lớn nhất của dự án không nằm ở kiến trúc, mà nằm ở chỗ hệ thống đã phủ được nhiều quy trình thật:

- quản trị hệ thống
- quản lý kìm chì
- quản lý thiết bị
- quản lý vận hành
- đánh giá giao dịch viên

Đặc biệt, dự án không dừng ở CRUD cơ bản mà đã xử lý được:

- phân quyền theo user/menu
- chuyển đơn vị làm việc
- ký số
- thay đổi trạng thái theo vai trò
- báo cáo tổng hợp và chi tiết

Điều này cho thấy sản phẩm đã bám sát vận hành thực tế.

## 3.3 Có pattern dùng lại ở nhiều phân hệ

Dù chưa được trừu tượng hóa hoàn chỉnh, repo đã hình thành một số pattern lặp lại khá rõ:

- page có filter + table + dialog + viewer
- service tách ra riêng
- model mặc định cho form
- hook điều khiển action theo vai trò/trạng thái
- dashboard theo phân hệ

Đây là nền tảng tốt nếu muốn chuẩn hóa tiếp.

## 3.4 Tư duy phân hệ đã hình thành

Cấu trúc thư mục cho thấy dự án đã có ý thức tách theo module:

- `quanlykimchi`
- `quanlythietbi`
- `quanlyvanhanh`
- `quantrihethong`
- `danhgiagdv`

Điều này quan trọng vì nó tạo điều kiện để refactor dần theo module, thay vì phải viết lại toàn bộ.

## 3.5 Hạ tầng ký số và PDF đã được tích hợp

Nhiều hệ thống nội bộ dừng ở mức nhập liệu, còn dự án này đã đi tới bước:

- preview biên bản
- tải file
- ký số
- cập nhật trạng thái sau ký

Đây là điểm mạnh rõ rệt vì phần này thường tốn nhiều công sức tích hợp.

## 4. Rủi ro kỹ thuật chính

## 4.1 Kiến trúc frontend chưa tách lớp đủ rõ

Rủi ro lớn nhất hiện tại là nhiều logic nghiệp vụ nằm trực tiếp trong page:

- kiểm tra quyền hiển thị nút
- mapping dữ liệu người dùng
- tổng hợp dữ liệu báo cáo
- kiểm tra trạng thái chứng từ
- điều phối dialog, viewer, ký số

Hệ quả:

- file page dài và nặng
- khó unit test
- khó tái sử dụng
- sửa một chỗ dễ ảnh hưởng chỗ khác

Ngắn hạn thì vẫn chạy được, nhưng dài hạn sẽ làm giảm tốc độ phát triển.

## 4.2 Phụ thuộc mạnh vào backend và dữ liệu động

Frontend hiện phụ thuộc nhiều vào backend ở các lớp:

- menu
- quyền truy cập route
- số chờ ký/cảnh báo
- trạng thái nghiệp vụ
- PDF/ký số

Điều này không sai, nhưng dẫn tới rủi ro:

- khó debug nếu không nắm backend
- khó tái hiện lỗi chỉ bằng frontend
- môi trường test/dev có thể không phản ánh đúng production nếu dữ liệu backend khác nhau

## 4.3 Phụ thuộc nhiều vào localStorage

Các key như:

- `user`
- `current_MADVIQLY`
- `currentAppCode`
- `currentMenu`
- `ds_donvi`

được dùng rất thường xuyên và trực tiếp trong nhiều component.

Rủi ro:

- trạng thái ứng dụng bị phân tán
- khó kiểm soát khi refresh hoặc đổi ngữ cảnh
- dễ phát sinh bug “đúng tài khoản nhưng sai dữ liệu”
- khó chuyển sang mô hình state quản lý tập trung sau này

## 4.4 Quy tắc nghiệp vụ phân tán

Hiện tại quy tắc nghiệp vụ không nằm gọn ở một lớp rõ ràng. Nó đang nằm rải ở:

- hooks
- pages
- constants
- services

Ví dụ:

- quyền hiện nút ở `useAction*`
- route guard ở `useMenuGuard`
- role ở `constants/propGlobal.js`
- menu động ở `AppMenu.js`
- chuyển trạng thái ở page/viewer/service

Hệ quả:

- người mới khó nắm được toàn cảnh
- thay đổi một quy tắc cần dò nhiều nơi
- dễ tạo ra logic trùng lặp

## 4.5 Có dấu hiệu code còn sót hoặc module chưa hoàn chỉnh

Ví dụ rõ nhất là module quản lý thí nghiệm:

- có `services/quanlythinghiem`
- có `models/quanlythinghiem`
- có hooks và components liên quan
- nhưng không thấy route frontend đầy đủ trong `pages`

Rủi ro:

- người mới khó phân biệt code đang dùng và code để lại
- tăng nhiễu khi đọc repo
- khó đánh giá đúng phạm vi hệ thống thật

## 4.6 Chất lượng tài liệu gốc chưa theo kịp sản phẩm

`README.md` hiện tại chưa phản ánh dự án thật.

Điều này ảnh hưởng trực tiếp đến:

- onboarding
- bàn giao
- khả năng tự học của dev mới

May mắn là phần này đã có thể khắc phục bằng bộ tài liệu vừa tạo, nhưng xét riêng hệ thống cũ thì đây là một điểm yếu.

## 4.7 Encoding tiếng Việt chưa đồng nhất

Khi đọc file qua terminal, nhiều nội dung hiển thị lỗi encoding.

Rủi ro:

- sửa hàng loạt dễ làm hỏng text
- khó đọc khi debug qua terminal hoặc script
- tài liệu và comment có thể không đồng nhất giữa môi trường

## 5. Nợ kỹ thuật hiện tại

## 5.1 Nợ về tổ chức module

Dự án đã tách thư mục theo phân hệ, nhưng chưa chuẩn hóa cấu trúc bên trong từng module.

Ví dụ mong đợi của một module ổn định thường là:

- `pages`
- `services`
- `components`
- `hooks`
- `constants`
- `types/models`

Hiện tại các phần này vẫn đang rải ở cấp repo, khiến biên giới module chưa rõ.

## 5.2 Nợ về state management

Hiện trạng:

- state page dùng `useState` rất nhiều
- context chỉ dùng ở vài nơi
- localStorage đóng vai trò gần như global store cho một số luồng

Đây là nợ kỹ thuật vì:

- khó kiểm soát source of truth
- khó trace lỗi theo luồng
- khó mở rộng khi có nhiều màn hình liên kết hơn

## 5.3 Nợ về chuẩn hóa service

Một số service dùng helper CRUD khá gọn, nhưng nhiều service viết tay dài và khác nhau về convention:

- tên hàm không đồng nhất
- response trả về không đồng nhất
- nơi trả `res`, nơi trả `res.data`
- nơi dùng `get`, nơi `post`, `put`, `patch` theo style khác nhau

Điều này làm dev mới mất thời gian làm quen và tăng nguy cơ dùng sai.

## 5.4 Nợ về tái sử dụng UI nghiệp vụ

Nhiều page đang có cùng mô hình:

- panel filter
- bảng dữ liệu
- viewer PDF
- dialog nhập liệu
- phân trang

Nhưng chưa được đóng thành “khung chuẩn” cho từng kiểu màn hình. Nợ kỹ thuật này không gây lỗi ngay, nhưng làm tăng chi phí phát triển tính năng mới.

## 5.5 Nợ về kiểm thử

Qua cấu trúc repo hiện tại, chưa thấy dấu hiệu rõ của:

- test unit
- test integration
- test end-to-end

Điều này là rủi ro đáng kể với hệ thống có nhiều trạng thái nghiệp vụ và phụ thuộc quyền người dùng.

## 6. Đánh giá khả năng mở rộng

## 6.1 Có thể mở rộng tiếp không

Có. Dự án vẫn có thể mở rộng tiếp trên nền hiện tại.

Lý do:

- stack chưa lỗi thời
- mô hình phân hệ đã có
- frontend vẫn đang đáp ứng tốt kiểu bài toán back-office

## 6.2 Mở rộng theo cách hiện tại có an toàn không

Không thật sự an toàn nếu tiếp tục mở rộng mạnh mà không chuẩn hóa thêm.

Nếu tiếp tục thêm nhiều chức năng theo cách hiện tại, khả năng cao sẽ gặp:

- page ngày càng dài
- logic ngày càng phân tán
- phụ thuộc chéo tăng
- bug quyền/trạng thái khó kiểm soát
- onboarding chậm hơn

## 6.3 Dự án phù hợp với kiểu mở rộng nào

Phù hợp nhất với mở rộng theo hướng:

- thêm module mới nhưng có chuẩn module rõ
- chuẩn hóa dần các pattern cũ
- không viết lại toàn bộ
- refactor theo lát cắt nhỏ, ưu tiên phân hệ đang phát triển tiếp

Không nên chọn hướng:

- đập đi viết lại hoàn toàn
- cố nhồi thêm nhiều tính năng mà không cải tổ nền

## 7. Đánh giá khả năng tiếp nhận của người mới

## 7.1 Mức độ tiếp nhận hiện tại

Tôi đánh giá ở mức trung bình.

Người mới có thể:

- chạy dự án tương đối dễ
- đọc được stack nhanh
- nhận diện được các phân hệ lớn

Nhưng để hiểu đúng hệ thống và bắt đầu sửa an toàn thì cần thời gian.

## 7.2 Vì sao người mới sẽ khó tiếp cận

Các nguyên nhân chính:

- README gốc không phản ánh hệ thống thực tế
- quyền và menu đi từ backend nên chỉ đọc frontend là chưa đủ
- nhiều logic nghiệp vụ nằm trong page
- state phụ thuộc localStorage
- có code đang dùng lẫn với code có dấu hiệu để lại

## 7.3 Điều kiện để người mới tiếp nhận tốt

Người mới sẽ vào nhanh hơn nhiều nếu có đủ:

- tài liệu onboarding
- tài khoản test theo nhiều vai trò
- dữ liệu mẫu đúng nghiệp vụ
- một người cũ giải thích ít nhất 2-3 luồng end-to-end

Nếu thiếu các điều kiện này, thời gian “ngấm” hệ thống sẽ tăng rõ rệt.

## 8. Lộ trình cải tiến đề xuất trong 3 tháng

## Giai đoạn 1: 2-3 tuần đầu

Mục tiêu: giảm rủi ro onboarding và chuẩn hóa nhận thức hệ thống.

Việc nên làm:

- Chuẩn hóa bộ tài liệu dự án
- Cập nhật `README.md` thật sự phản ánh hệ thống
- Lập danh sách phân hệ đang dùng thật
- Xác nhận module nào còn sống, module nào đã bỏ
- Lập bảng mapping `route -> service -> endpoint -> role -> trạng thái chính`

Hiệu quả:

- giảm nhiễu cho người mới
- giúp đội có ngôn ngữ chung khi trao đổi

## Giai đoạn 2: 3-5 tuần tiếp theo

Mục tiêu: giảm nợ kỹ thuật ở lớp page và service.

Việc nên làm:

- Chuẩn hóa convention service
- Chuẩn hóa response shape ở frontend
- Tách các logic filter/table/action chung thành helper hoặc base component
- Gom các quy tắc hiển thị action theo phân hệ về nơi tập trung hơn

Ưu tiên phân hệ:

- phân hệ nào đang còn phát triển tính năng mới
- nhiều khả năng là `quanlythietbi` hoặc `quanlykimchi`

## Giai đoạn 3: 4-6 tuần tiếp theo

Mục tiêu: tăng khả năng mở rộng và giảm rủi ro regression.

Việc nên làm:

- Giảm phụ thuộc trực tiếp vào `localStorage`
- Tạo lớp app context rõ ràng hơn cho user, đơn vị, app code
- Bổ sung test cho các helper và các luồng trọng yếu
- Kiểm tra lại các route guard và quyền hiển thị nút thao tác

Nếu có nguồn lực thêm:

- Tách module theo domain rõ hơn
- Xây “module template” chuẩn cho các màn hình mới

## 9. Ưu tiên kỹ thuật nếu phải chọn ít việc nhất

Nếu chỉ được làm ít nhưng hiệu quả cao, tôi ưu tiên theo thứ tự:

1. Chuẩn hóa tài liệu và mapping route/service/quyền
2. Xác nhận phạm vi code còn dùng, dọn code mơ hồ
3. Chuẩn hóa service và response convention
4. Giảm logic nặng trong page của các phân hệ trọng điểm
5. Gom state người dùng và đơn vị làm việc về lớp rõ ràng hơn

## 10. Kết luận cuối

Dự án này không phải kiểu đẹp về kiến trúc nhưng yếu về thực tế. Ngược lại, nó là kiểu dự án có nghiệp vụ mạnh, đã chạy được nhiều quy trình thật, và đang mang giá trị sử dụng rõ ràng.

Điều cần làm tiếp không phải là viết lại từ đầu, mà là:

- giữ nguyên giá trị nghiệp vụ đang có
- chuẩn hóa dần lớp frontend
- giảm phụ thuộc phân tán
- tăng khả năng tiếp nhận của người mới

Nếu được cải tiến theo lộ trình vừa phải, dự án vẫn có thể phát triển ổn trong các giai đoạn tiếp theo mà không cần thay nền công nghệ.
