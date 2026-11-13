using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace QLTB_API.Services.Audit
{
    public sealed class NhatKyHeThongEntry
    {
        public string IdNhatKy { get; set; } = Guid.NewGuid().ToString("N");
        public DateTime ThoiGian { get; set; } = DateTime.Now;
        public string MaUngDung { get; set; }
        public string MaChucNang { get; set; }
        public string MaThaoTac { get; set; }
        public string TrangThai { get; set; }
        public string MaNguoiDung { get; set; }
        public string TenNguoiDung { get; set; }
        public string MaDonVi { get; set; }
        public string NoiDung { get; set; }
        public string ChiTietJson { get; set; }
        public string MaPhienGiaoDich { get; set; }
        public string NenTangThietBi { get; set; }
        public string DiaChiIp { get; set; }
        public string ThongBaoLoi { get; set; }
        public int SoLuongDoiTuong { get; set; }
    }

    public interface INhatKyHeThongQueue
    {
        void Enqueue(NhatKyHeThongEntry entry);
        ValueTask<NhatKyHeThongEntry> DequeueAsync(CancellationToken cancellationToken);
        bool TryDequeue(out NhatKyHeThongEntry entry);
    }

    public sealed class NhatKyHeThongQueue : INhatKyHeThongQueue
    {
        // Hàng đợi không chặn request; chỉ các thao tác nghiệp vụ chính mới được đưa vào đây.
        private readonly Channel<NhatKyHeThongEntry> _channel = Channel.CreateUnbounded<NhatKyHeThongEntry>(
            new UnboundedChannelOptions { SingleReader = true, SingleWriter = false });

        public void Enqueue(NhatKyHeThongEntry entry)
        {
            if (entry != null)
            {
                _channel.Writer.TryWrite(entry);
            }
        }

        public ValueTask<NhatKyHeThongEntry> DequeueAsync(CancellationToken cancellationToken)
        {
            return _channel.Reader.ReadAsync(cancellationToken);
        }

        public bool TryDequeue(out NhatKyHeThongEntry entry)
        {
            return _channel.Reader.TryRead(out entry);
        }
    }
}
