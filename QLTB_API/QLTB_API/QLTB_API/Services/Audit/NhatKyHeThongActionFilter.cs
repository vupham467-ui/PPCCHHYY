using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using QLTB_API.Middlewares;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace QLTB_API.Services.Audit
{
    public sealed class NhatKyHeThongActionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            NhatKyPlan plan = NhatKyClassifier.Classify(context.HttpContext);
            if (plan != null)
            {
                var parameters = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
                int objectCount = 1;

                foreach (KeyValuePair<string, object> argument in context.ActionArguments.Take(30))
                {
                    parameters[argument.Key] = Sanitize(argument.Key, argument.Value, 0);
                    if (argument.Value is ICollection collection && !(argument.Value is string))
                    {
                        objectCount = Math.Max(objectCount, collection.Count);
                    }
                }

                if (parameters.Count > 0)
                {
                    context.HttpContext.Items[NhatKyHeThongItems.ChiTietBoSung]
                        = BuildBusinessDetail(plan.MaThaoTac, parameters);
                    context.HttpContext.Items[NhatKyHeThongItems.SoLuongDoiTuong] = objectCount;
                }
            }

            await next();
        }

        private static object BuildBusinessDetail(
            string actionCode,
            IDictionary<string, object> data)
        {
            switch (actionCode)
            {
                case MaThaoTacNhatKy.THEM_MOI:
                    return new { du_lieu_them_moi = data };
                case MaThaoTacNhatKy.CAP_NHAT:
                    return new { gia_tri_moi = data };
                case MaThaoTacNhatKy.XOA:
                    return new { doi_tuong_xoa = data };
                case MaThaoTacNhatKy.KHOI_PHUC:
                    return new { doi_tuong_khoi_phuc = data };
                case MaThaoTacNhatKy.DONG_BO:
                    return new { du_lieu_dong_bo = data };
                case MaThaoTacNhatKy.NHAP_DU_LIEU:
                    return new { du_lieu_nhap = data };
                default:
                    return new { du_lieu_nghiep_vu = data };
            }
        }

        private static object Sanitize(string name, object value, int depth)
        {
            if (IsSensitive(name))
            {
                return "[DA_AN]";
            }

            if (value == null)
            {
                return null;
            }

            if (value is IFormFile file)
            {
                return new
                {
                    ten_file = Truncate(Path.GetFileName(file.FileName), 300),
                    kich_thuoc = file.Length,
                    loai_noi_dung = Truncate(file.ContentType, 100)
                };
            }

            Type type = value.GetType();
            if (IsSimple(type))
            {
                return value is string text ? Truncate(text, 1000) : value;
            }

            if (depth >= 4 || value is Stream || value is byte[])
            {
                return "[KHONG_GHI_NOI_DUNG]";
            }

            if (value is IEnumerable enumerable && !(value is string))
            {
                var items = new List<object>();
                foreach (object item in enumerable)
                {
                    if (items.Count >= 20)
                    {
                        break;
                    }

                    items.Add(Sanitize("item", item, depth + 1));
                }

                return items;
            }

            var result = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
            foreach (PropertyInfo property in type.GetProperties(BindingFlags.Instance | BindingFlags.Public).Take(50))
            {
                if (!property.CanRead || property.GetIndexParameters().Length > 0)
                {
                    continue;
                }

                try
                {
                    result[property.Name] = Sanitize(property.Name, property.GetValue(value), depth + 1);
                }
                catch
                {
                    result[property.Name] = "[KHONG_DOC_DUOC]";
                }
            }

            return result;
        }

        private static bool IsSimple(Type type)
        {
            Type actualType = Nullable.GetUnderlyingType(type) ?? type;
            return actualType.IsPrimitive
                || actualType.IsEnum
                || actualType == typeof(string)
                || actualType == typeof(decimal)
                || actualType == typeof(DateTime)
                || actualType == typeof(DateTimeOffset)
                || actualType == typeof(Guid);
        }

        private static bool IsSensitive(string name)
        {
            string normalized = (name ?? string.Empty).Replace("_", string.Empty).ToUpperInvariant();
            return normalized.Contains("MATKHAU")
                || normalized.Contains("PASSWORD")
                || normalized.Contains("TOKEN")
                || normalized.Contains("SECRET")
                || normalized.Contains("AUTHORIZATION")
                || normalized.Contains("COOKIE")
                || normalized.Contains("SOCMND")
                || normalized.Contains("CCCD")
                || normalized.Contains("SODIENTHOAI")
                || normalized.Contains("EMAIL")
                || normalized.Contains("BASE64")
                || normalized.Contains("FILECONTENT")
                || normalized.Contains("IMAGE")
                || normalized.StartsWith("ANH", StringComparison.Ordinal)
                || normalized.Contains("HINHANH");
        }

        private static string Truncate(string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            {
                return value;
            }

            return value.Substring(0, maxLength);
        }
    }
}
