using QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG;
using APIPCHY_PhanQuyen.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Security.Claims;

public class RequireAccessTokenAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Không bị kiểm tra access token
        var endpoint = context.HttpContext.GetEndpoint();
        if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
        {
            return;
        }

        var request = context.HttpContext.Request;
        // Nếu có Authorization header thì không kiểm tra cookie nữa
        if (request.Headers.TryGetValue("Authorization", out var authHeader)
            && authHeader.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            // Cho phép hệ thống JWT của ASP.NET xử lý tiếp
            return;
        }

        var tokenService = context.HttpContext.RequestServices.GetService<TokenService>();

        var accessToken = context.HttpContext.Request.Cookies["accessToken"];
        var refreshToken = context.HttpContext.Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(accessToken) && string.IsNullOrEmpty(refreshToken))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var principal = tokenService?.ValidateAccessToken(accessToken);

        if (principal == null && !string.IsNullOrEmpty(refreshToken))
        {
            // Nếu access token không hợp lệ và có refresh token, thử làm mới access token
            var principalRefresh = tokenService?.ValidateRefreshToken(refreshToken);
            if (principalRefresh == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Tạo mới access token và set lại vào cookie
            var userId = principalRefresh.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = principalRefresh.Identity?.Name;

            var user = new HT_NGUOIDUNG_Model
            {
                id = userId,
                ten_dang_nhap = username,
            };

            var newAccessToken = tokenService.GenerateAccessToken(user);
            tokenService.SetAccessTokenInCookie(context.HttpContext.Response, newAccessToken);

            // Gán principal vào HttpContext.User sau khi làm mới token
            context.HttpContext.User = principalRefresh;
        }
        else if (principal == null)
        {
            // Nếu không có refresh token hoặc không làm mới thành công
            Console.WriteLine("Token không hợp lệ hoặc đã hết hạn.");
            context.Result = new UnauthorizedObjectResult(new { message = "Token không hợp lệ hoặc đã hết hạn." });
            //context.Result = new UnauthorizedResult();
        }
        else
        {
            // Nếu access token hợp lệ
            context.HttpContext.User = principal;
        }
    }
}
