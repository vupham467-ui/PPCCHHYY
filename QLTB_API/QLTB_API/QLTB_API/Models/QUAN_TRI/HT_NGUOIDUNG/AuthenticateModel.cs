using System.ComponentModel.DataAnnotations;

namespace QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG
{
    public class AuthenticateModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class AppSettings
    {
        public string Secret { get; set; }

    }
}
