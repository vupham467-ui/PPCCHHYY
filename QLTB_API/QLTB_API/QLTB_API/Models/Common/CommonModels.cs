namespace QLTB_API.Models.Common
{
    public class InsertResult<T>
    {
        public T? data { get; set; } // Dữ liệu trả về nếu thành công
        public string? p_Error { get; set; } // Thông báo lỗi nếu có
    }
}
