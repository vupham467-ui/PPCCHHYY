using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using System.Configuration;
using System.Collections.Generic;

namespace APIPCHY_PhanQuyen.Services
{
    public class TokenService
    {
        private readonly string _secret;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _accessTokenExpiryMinutes = 20;  // Thời gian hết hạn của Access Token
        private readonly int _refreshTokenExpiryHours = 4; //Thời gian hết hạn của Refresh Token

        private readonly string _sharedSecret;

        public TokenService(IConfiguration configuration)
        {
            // Lấy `secret` từ appsettings.json
            _secret = configuration["Jwt:Key"];
            _issuer = configuration["Jwt:Issuer"];
            _audience = configuration["Jwt:Audience"];

            _sharedSecret = configuration["SSO:SharedSecret"];
        }

        //Tạo accessToken:
        public string GenerateAccessToken(HT_NGUOIDUNG_Model account, string sessionId = null)
        {
            // Tạo `key` từ `secret`
            //var key = Encoding.ASCII.GetBytes(_secret);
            var key = Encoding.UTF8.GetBytes(_secret);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(CreateUserClaims(account, sessionId)),
                Expires = DateTime.UtcNow.AddMinutes(_accessTokenExpiryMinutes), // Thời hạn token
                Issuer = _issuer,             
                Audience = _audience,             
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) //Đảm bảo không bị giả
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        // Tạo Refresh Token
        public string GenerateRefreshToken(HT_NGUOIDUNG_Model account, string sessionId = null)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(CreateUserClaims(account, sessionId)),
                Expires = DateTime.UtcNow.AddHours(_refreshTokenExpiryHours),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static IEnumerable<Claim> CreateUserClaims(HT_NGUOIDUNG_Model account, string sessionId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, account.ten_dang_nhap ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, account.id ?? string.Empty)
            };

            if (!string.IsNullOrWhiteSpace(account.ho_ten))
            {
                claims.Add(new Claim("ho_ten", account.ho_ten));
            }

            if (!string.IsNullOrWhiteSpace(account.ma_dviqly))
            {
                claims.Add(new Claim("ma_dviqly", account.ma_dviqly));
            }

            if (!string.IsNullOrWhiteSpace(sessionId))
            {
                claims.Add(new Claim("sid", sessionId));
            }

            return claims;
        }

        // Gán accesss token vào cookie
        public void SetAccessTokenInCookie(HttpResponse response, string accessToken)
        {
            response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Path = "/",
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(_accessTokenExpiryMinutes)
            });
        }

        // Gán refresh token vào cookie
        public void SetRefreshTokenInCookie(HttpResponse response, string refreshToken)
        {
            response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true, // Không thể truy cập qua JavaScript
                Secure = true, // Chỉ gửi qua HTTPS
                Path = "/",
                SameSite = SameSiteMode.None, //Không cần trùng trang
                Expires = DateTime.UtcNow.AddHours(_refreshTokenExpiryHours) //thời gian hết hạn
            });
        }

        // Gán danh sách menu được phân quyền vào cookie
        public void SetAllowedMenusInCookie(HttpResponse response, string menuJson)
        {

            response.Cookies.Append("allowedMenus", menuJson, new CookieOptions
            {
                HttpOnly = false, // Frontent cần đọc
                Secure = true, // Chỉ gửi qua HTTPS
                Path = "/",
                SameSite = SameSiteMode.None, //Không cần trùng trang
            });
        }


        //Kiểm tra tính hợp lệ của refreshToken:
        public ClaimsPrincipal? ValidateRefreshToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secret);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = false // Bỏ qua kiểm tra hết hạn refresh token, kiểm tra thủ công
                }, out SecurityToken securityToken);
                if (securityToken is not JwtSecurityToken jwtToken ||
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null;
                }
                // Kiểm tra nếu refresh token đã hết hạn
                var expirationDateUnix = jwtToken.ValidTo; // Ngày hết hạn của token
                if (expirationDateUnix < DateTime.UtcNow)
                {  
                    return null;
                }
                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine("---------");
                Console.WriteLine("Lỗi validate token: " + ex.Message);
                Console.WriteLine("---------");
                return null;
            }
        }

        //Kiểm tra tính hợp lệ của accessToken:
        public ClaimsPrincipal? ValidateAccessToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secret);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = _issuer,  
                    ValidAudience = _audience,
                    ValidateLifetime = true, // Access token phải kiểm tra hạn
                    ClockSkew = TimeSpan.FromMinutes(2)
                    //ClockSkew = TimeSpan.Zero // Không cho phép trễ thời gian
                }, out SecurityToken validatedToken);
                // Kiểm tra kiểu token và thuật toán
                if (validatedToken is not JwtSecurityToken jwtToken)
                {
                    Console.WriteLine("Token không phải là JwtSecurityToken.");
                    return null;
                }


                if (!jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    Console.WriteLine($"Thuật toán không hợp lệ: {jwtToken.Header.Alg}");
                    return null;
                }

                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi validate access token: " + ex.Message);
                return null;
            }
        }

        public bool ValidateTempToken(string username, string tempToken)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(tempToken))
                return false;

            try
            {
                // Decode token (Base64 hoặc parse string)
                var parts = tempToken.Split(':');
                if (parts.Length != 3) return false;

                var tokenUsername = parts[0];
                var expiryUnix = long.Parse(parts[1]);
                var signature = parts[2];

                // 1. Check username khớp
                if (!string.Equals(username, tokenUsername, StringComparison.OrdinalIgnoreCase))
                    return false;

                // 2. Check token còn hạn
                var expiry = DateTimeOffset.FromUnixTimeSeconds(expiryUnix);
                if (expiry < DateTimeOffset.UtcNow)
                    return false;

                // 3. Tính HMAC lại bằng shared secret
                var secret = _sharedSecret;
                using var hmac = new System.Security.Cryptography.HMACSHA256(Encoding.UTF8.GetBytes(secret));
                var payload = $"{tokenUsername}:{expiryUnix}";
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                var expectedSignature = Convert.ToBase64String(hashBytes);

                // 4. So khớp signature
                return signature == expectedSignature;
            }
            catch
            {
                return false;
            }
        }
    }
}
