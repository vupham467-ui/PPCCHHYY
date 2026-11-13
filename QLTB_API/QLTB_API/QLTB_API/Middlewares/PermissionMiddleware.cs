using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using APIPCHY.Helpers;
using QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG;
using DocumentFormat.OpenXml.ExtendedProperties;
using Microsoft.AspNetCore.Http;

namespace QLTB_API.Middlewares
{
    public class PermissionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly DataHelper _helper;
        private readonly HT_NGUOIDUNG_Manager _manager;

        public PermissionMiddleware(RequestDelegate next)
        {
            _next = next;
            _helper = new DataHelper();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Danh sách các route public
            var publicRoutes = new List<string>
            {
                "/",                // Trang chính
                "/auth/login",      // Trang login
                "/403",             // Trang không có quyền
                "/quanlykimchi/chitietquyettoanchi",
                "/quanlythinghiem/kyso?status=3"  
            };

            var menuPath = context.Request.Headers["X-Menu-Path"].ToString();
            if (!string.IsNullOrEmpty(menuPath))
            {
                menuPath = menuPath.Trim().Replace("\uFEFF", "");
                if (menuPath.Length > 1 && menuPath.EndsWith("/"))
                {
                    menuPath = menuPath.TrimEnd('/');
                }

                // Bỏ qua check cho các route public
                if (publicRoutes.Any(r => menuPath.Equals(r, StringComparison.OrdinalIgnoreCase) || menuPath.StartsWith(r + "/")))
                {
                    await _next(context);
                    return;
                }
            }

            // Lấy cookie "allowedMenus"
            // Lấy danh sách allowedMenus từ cookie
            List<string> allowedMenus;
            if (context.Request.Cookies.TryGetValue("allowedMenus", out var allowedMenusJson))
            {
                try
                {
                    var decodedJson = Uri.UnescapeDataString(allowedMenusJson);
                    allowedMenus = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(decodedJson)
                        .Where(m => !string.IsNullOrEmpty(m))
                        .Select(m => m.Trim().TrimEnd('/'))
                        .ToList();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Parse allowedMenus lỗi: " + ex.Message);
                    allowedMenus = new List<string>();
                }
            }
            else
            {
                allowedMenus = new List<string>();
            }

            // Kiểm tra menuPath có trong allowedMenus không
            if (!string.IsNullOrEmpty(menuPath) && !allowedMenus.Contains(menuPath, StringComparer.OrdinalIgnoreCase))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Forbidden-Không có quyền truy cập");
                return;
            }

            // Nếu có quyền, tiếp tục
            await _next(context);
        }
    }
}
