using APIPCHY.Helpers;
using QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace QLTB_API.Services.Audit
{
    public sealed class NhatKyHeThongWriterService : BackgroundService
    {
        private const int BatchSize = 100;
        private readonly INhatKyHeThongQueue _queue;
        private readonly ILogger<NhatKyHeThongWriterService> _logger;
        private readonly IConfiguration _configuration;
        private readonly ConcurrentDictionary<string, DonViCacheEntry> _unitCache
            = new ConcurrentDictionary<string, DonViCacheEntry>(StringComparer.OrdinalIgnoreCase);

        public NhatKyHeThongWriterService(
            INhatKyHeThongQueue queue,
            ILogger<NhatKyHeThongWriterService> logger,
            IConfiguration configuration)
        {
            _queue = queue;
            _logger = logger;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                NhatKyHeThongEntry first;
                try
                {
                    first = await _queue.DequeueAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }

                var batch = new List<NhatKyHeThongEntry>(BatchSize) { first };
                while (batch.Count < BatchSize && _queue.TryDequeue(out NhatKyHeThongEntry next))
                {
                    batch.Add(next);
                }

                try
                {
                    FillMissingUserUnits(batch);
                    await WriteBatchAsync(batch, stoppingToken);
                }
                catch (Exception ex)
                {
                    // Không làm hỏng nghiệp vụ chính khi DB nhật ký tạm thời có lỗi.
                    // Đưa lại hàng đợi để worker thử ghi ở lượt sau.
                    _logger.LogError(ex, "Không thể ghi {Count} bản ghi vào NHAT_KY_HE_THONG.", batch.Count);
                    foreach (NhatKyHeThongEntry entry in batch)
                    {
                        _queue.Enqueue(entry);
                    }

                    try
                    {
                        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }
                }
            }
        }

        private void FillMissingUserUnits(IEnumerable<NhatKyHeThongEntry> batch)
        {
            string[] usernames = batch
                .Where(x => string.IsNullOrWhiteSpace(x.MaDonVi)
                    && !string.IsNullOrWhiteSpace(x.MaNguoiDung))
                .Select(x => x.MaNguoiDung.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();

            foreach (string username in usernames)
            {
                string unitCode = ResolveUserUnit(username);
                if (string.IsNullOrWhiteSpace(unitCode))
                {
                    continue;
                }

                foreach (NhatKyHeThongEntry entry in batch.Where(x =>
                    string.IsNullOrWhiteSpace(x.MaDonVi)
                    && string.Equals(x.MaNguoiDung, username, StringComparison.OrdinalIgnoreCase)))
                {
                    entry.MaDonVi = unitCode;
                }
            }
        }

        private string ResolveUserUnit(string username)
        {
            DateTime now = DateTime.UtcNow;
            if (_unitCache.TryGetValue(username, out DonViCacheEntry cached)
                && cached.ExpiresAtUtc > now)
            {
                return cached.UnitCode;
            }

            string unitCode = null;
            try
            {
                var manager = new HT_NGUOIDUNG_Manager(_configuration);
                unitCode = manager.GET_MA_DVIQLY_byUsername(username);
            }
            catch (Exception ex)
            {
                // Không để lỗi tra cứu bổ sung làm mất nhật ký nghiệp vụ.
                _logger.LogWarning(ex,
                    "Không thể tra mã đơn vị của người dùng {Username} khi bổ sung nhật ký.",
                    username);
            }

            _unitCache[username] = new DonViCacheEntry
            {
                UnitCode = unitCode,
                ExpiresAtUtc = now.AddMinutes(string.IsNullOrWhiteSpace(unitCode) ? 5 : 30)
            };
            return unitCode;
        }

        private sealed class DonViCacheEntry
        {
            public string UnitCode { get; set; }
            public DateTime ExpiresAtUtc { get; set; }
        }

        private static async Task WriteBatchAsync(
            IReadOnlyCollection<NhatKyHeThongEntry> batch,
            CancellationToken cancellationToken)
        {
            string connectionString = new ConnectionOracle().getConnectionQLTB().ConnectionString;
            using OracleConnection connection = new OracleConnection(connectionString);
            await connection.OpenAsync(cancellationToken);
            using OracleTransaction transaction = connection.BeginTransaction();
            using OracleCommand command = connection.CreateCommand();
            command.Transaction = transaction;
            command.BindByName = true;
            command.CommandType = CommandType.Text;
            command.CommandText = @"
                INSERT INTO QLTB.NHAT_KY_HE_THONG
                (
                    ID_NHAT_KY, THOI_GIAN, MA_UNG_DUNG, MA_CHUC_NANG,
                    MA_THAO_TAC, TRANG_THAI, MA_NGUOI_DUNG, TEN_NGUOI_DUNG,
                    MA_DON_VI, NOI_DUNG, CHI_TIET_JSON, MA_PHIEN_GIAO_DICH,
                    NEN_TANG_THIET_BI, DIA_CHI_IP, THONG_BAO_LOI,
                    SO_LUONG_DOI_TUONG
                )
                VALUES
                (
                    :ID_NHAT_KY, :THOI_GIAN, :MA_UNG_DUNG, :MA_CHUC_NANG,
                    :MA_THAO_TAC, :TRANG_THAI, :MA_NGUOI_DUNG, :TEN_NGUOI_DUNG,
                    :MA_DON_VI, :NOI_DUNG, :CHI_TIET_JSON, :MA_PHIEN_GIAO_DICH,
                    :NEN_TANG_THIET_BI, :DIA_CHI_IP, :THONG_BAO_LOI,
                    :SO_LUONG_DOI_TUONG
                )";

            command.Parameters.Add("ID_NHAT_KY", OracleDbType.Varchar2, 32);
            command.Parameters.Add("THOI_GIAN", OracleDbType.Date);
            command.Parameters.Add("MA_UNG_DUNG", OracleDbType.Varchar2, 50);
            command.Parameters.Add("MA_CHUC_NANG", OracleDbType.Varchar2, 80);
            command.Parameters.Add("MA_THAO_TAC", OracleDbType.Varchar2, 80);
            command.Parameters.Add("TRANG_THAI", OracleDbType.Varchar2, 80);
            command.Parameters.Add("MA_NGUOI_DUNG", OracleDbType.Varchar2, 100);
            command.Parameters.Add("TEN_NGUOI_DUNG", OracleDbType.Varchar2, 200);
            command.Parameters.Add("MA_DON_VI", OracleDbType.Varchar2, 20);
            command.Parameters.Add("NOI_DUNG", OracleDbType.Varchar2, 1000);
            command.Parameters.Add("CHI_TIET_JSON", OracleDbType.Clob);
            command.Parameters.Add("MA_PHIEN_GIAO_DICH", OracleDbType.Varchar2, 64);
            command.Parameters.Add("NEN_TANG_THIET_BI", OracleDbType.Varchar2, 100);
            command.Parameters.Add("DIA_CHI_IP", OracleDbType.Varchar2, 64);
            command.Parameters.Add("THONG_BAO_LOI", OracleDbType.Varchar2, 2000);
            command.Parameters.Add("SO_LUONG_DOI_TUONG", OracleDbType.Int32);

            try
            {
                foreach (NhatKyHeThongEntry entry in batch)
                {
                    SetValue(command, "ID_NHAT_KY", entry.IdNhatKy);
                    SetValue(command, "THOI_GIAN", entry.ThoiGian);
                    SetValue(command, "MA_UNG_DUNG", entry.MaUngDung);
                    SetValue(command, "MA_CHUC_NANG", entry.MaChucNang);
                    SetValue(command, "MA_THAO_TAC", entry.MaThaoTac);
                    SetValue(command, "TRANG_THAI", entry.TrangThai);
                    SetValue(command, "MA_NGUOI_DUNG", entry.MaNguoiDung);
                    SetValue(command, "TEN_NGUOI_DUNG", entry.TenNguoiDung);
                    SetValue(command, "MA_DON_VI", entry.MaDonVi);
                    SetValue(command, "NOI_DUNG", entry.NoiDung);
                    SetValue(command, "CHI_TIET_JSON", entry.ChiTietJson);
                    SetValue(command, "MA_PHIEN_GIAO_DICH", entry.MaPhienGiaoDich);
                    SetValue(command, "NEN_TANG_THIET_BI", entry.NenTangThietBi);
                    SetValue(command, "DIA_CHI_IP", entry.DiaChiIp);
                    SetValue(command, "THONG_BAO_LOI", entry.ThongBaoLoi);
                    SetValue(command, "SO_LUONG_DOI_TUONG", entry.SoLuongDoiTuong);
                    await command.ExecuteNonQueryAsync(cancellationToken);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private static void SetValue(OracleCommand command, string parameterName, object value)
        {
            command.Parameters[parameterName].Value = value ?? DBNull.Value;
        }
    }
}
