using System;

namespace QLTB_API.Helpers
{
    public static class ImageUrlHelper
    {
        public static string BuildUserAvatarUrl(
            string avatarPath,
            string apiBaseUrl)
        {
            if (string.IsNullOrWhiteSpace(avatarPath))
                return string.Empty;

            if (string.IsNullOrWhiteSpace(apiBaseUrl))
                return string.Empty;

            return $"{apiBaseUrl}/APIPCHY/HT_NGUOIDUNG/user-image" +
                   $"?path={Uri.EscapeDataString(avatarPath)}";
        }
    }
}
