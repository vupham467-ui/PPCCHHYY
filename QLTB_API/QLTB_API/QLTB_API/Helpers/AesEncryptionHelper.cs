using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace CHCT_API.Helpers
{
    public static class AesEncryptionHelper
    {
        // =========================
        // KEY (32 bytes AES-256)
        // =========================
        private static byte[] _aesKey;

        private const string VERSION = "v1";

        // =========================
        // CONFIG
        // =========================
        public static void SetConfiguration(IConfiguration configuration)
        {
            var key = configuration["AES:AES_KEY"]?.Trim();

            if (string.IsNullOrWhiteSpace(key))
                throw new Exception("AES_KEY chưa cấu hình");

            try
            {
                _aesKey = Convert.FromBase64String(key);
            }
            catch
            {
                throw new Exception("AES_KEY phải là Base64 hợp lệ (32 bytes)");
            }

            if (_aesKey.Length != 32)
                throw new Exception($"AES_KEY phải đúng 32 bytes. Hiện tại: {_aesKey.Length}");
        }

        // =========================
        // ENCRYPT
        // =========================
        public static string Encrypt(string plainText)
        {
            if (string.IsNullOrWhiteSpace(plainText))
                return string.Empty;

            try
            {
                byte[] iv = new byte[12];
                RandomNumberGenerator.Fill(iv);

                byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
                byte[] cipherBytes = new byte[plainBytes.Length];
                byte[] tag = new byte[16];

                using (var aes = new AesGcm(_aesKey))
                {
                    aes.Encrypt(iv, plainBytes, cipherBytes, tag);
                }

                byte[] result = new byte[iv.Length + tag.Length + cipherBytes.Length];

                Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                Buffer.BlockCopy(tag, 0, result, iv.Length, tag.Length);
                Buffer.BlockCopy(cipherBytes, 0, result, iv.Length + tag.Length, cipherBytes.Length);

                return $"{VERSION}|{Convert.ToBase64String(result)}";
            }
            catch
            {
                throw new Exception("AES encryption failed");
            }
        }

        // =========================
        // DECRYPT
        // =========================
        public static string Decrypt(string cipherText)
        {
            if (string.IsNullOrWhiteSpace(cipherText))
                return string.Empty;

            try
            {
                // =========================
                // CHECK VERSION
                // =========================
                if (!cipherText.StartsWith($"{VERSION}|"))
                    throw new Exception("Unsupported encryption version");

                string base64 = cipherText.Substring(3);

                byte[] fullCipher = Convert.FromBase64String(base64);

                if (fullCipher.Length < 28)
                    throw new Exception("Invalid cipher data");

                byte[] iv = new byte[12];
                byte[] tag = new byte[16];
                byte[] cipherBytes = new byte[fullCipher.Length - 28];

                Buffer.BlockCopy(fullCipher, 0, iv, 0, 12);
                Buffer.BlockCopy(fullCipher, 12, tag, 0, 16);
                Buffer.BlockCopy(fullCipher, 28, cipherBytes, 0, cipherBytes.Length);

                byte[] plainBytes = new byte[cipherBytes.Length];

                using (var aes = new AesGcm(_aesKey))
                {
                    aes.Decrypt(iv, cipherBytes, tag, plainBytes);
                }

                return Encoding.UTF8.GetString(plainBytes);
            }
            catch (CryptographicException)
            {
                throw new Exception("Decrypt failed (data tampered or invalid key)");
            }
            catch
            {
                throw new Exception("Decryption error");
            }
        }
    }
}