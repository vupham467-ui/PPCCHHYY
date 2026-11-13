using QRCoder;
using SkiaSharp;
using System;
using System.IO;

namespace QLTB_API.Helpers
{
    public class GenQRCode
    {
        private readonly string _rootPath;

        public GenQRCode()
        {
            _rootPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "genqr"));
        }

        // ============================================================
        // QR cơ bản + logo + text
        // ============================================================
        public string CreateQR(string MA_TBI_QR, string ID_LOAI_TBI, string SERIALNUM)
        {
            // Tạo QR code
            using var qrImg = GenerateQR(MA_TBI_QR, 500);

            // Load logo và frame
            using var logoImg = LoadAndResize($"{_rootPath}/QRIcon.png", 120, 120);
            using var frameImg = LoadAndResize($"{_rootPath}/QRbg.png", 500, 500);

            // Tạo surface vẽ
            var surfaceInfo = new SKImageInfo(frameImg.Width, frameImg.Height);
            using var surface = SKSurface.Create(surfaceInfo);
            var canvas = surface.Canvas;
            canvas.Clear(SKColors.White);

            // Vẽ frame, QR, logo
            canvas.DrawImage(frameImg, 0, 0);
            canvas.DrawImage(qrImg, (frameImg.Width - 400) / 2, 10);
            canvas.DrawImage(logoImg, (frameImg.Width - 120) / 2, (frameImg.Height - 120) / 2);

            // Vẽ text
            using var paint = new SKPaint
            {
                Color = SKColors.Blue,
                TextSize = 20,
                IsAntialias = true,
                TextAlign = SKTextAlign.Center,
                Typeface = SKTypeface.FromFamilyName("Times New Roman")
            };
            canvas.DrawText($"Thiết bị: {ID_LOAI_TBI}", frameImg.Width / 2, 440, paint);
            paint.Color = SKColors.Red;
            canvas.DrawText($"SERIAL: {SERIALNUM}", frameImg.Width / 2, 470, paint);

            // Vẽ viền
            using var borderPaint = new SKPaint
            {
                Color = SKColors.Blue,
                StrokeWidth = 10,
                Style = SKPaintStyle.Stroke
            };
            canvas.DrawRect(new SKRect(0, 0, frameImg.Width, frameImg.Height), borderPaint);

            canvas.Flush();
            return "data:image/png;base64," + SurfaceToBase64(surface);
        }

        // ============================================================
        // Hàm QR nhỏ (3 QR liên tiếp)
        // ============================================================
        public string CreateQR_Small(string MA_TBI_QR, string SERIALNUM)
        {
            using var qrImg = GenerateQR(MA_TBI_QR, 430);
            using var logoImg = LoadAndResize($"{_rootPath}/QRIcon_CCDC.png", 120, 120);
            using var frameImg = LoadAndResize($"{_rootPath}/QRbg.png", 500, 500);

            // Surface 1 QR
            var surfaceInfo = new SKImageInfo(frameImg.Width, frameImg.Height);
            using var surface = SKSurface.Create(surfaceInfo);
            var canvas = surface.Canvas;
            canvas.Clear(SKColors.White);

            canvas.DrawImage(frameImg, 0, 0);
            canvas.DrawImage(qrImg, (frameImg.Width - qrImg.Width) / 2, 10);
            canvas.DrawImage(logoImg, (frameImg.Width - logoImg.Width) / 2, (frameImg.Height - logoImg.Height) / 2);

            using var paint = new SKPaint
            {
                Color = SKColors.Black,
                TextSize = 25,
                IsAntialias = true,
                TextAlign = SKTextAlign.Center,
                Typeface = SKTypeface.FromFamilyName("Times New Roman", SKFontStyle.Bold)
            };
            canvas.DrawText($"SERIAL: {SERIALNUM}", frameImg.Width / 2, 470, paint);

            using var borderPaint = new SKPaint { Color = SKColors.Black, StrokeWidth = 15, Style = SKPaintStyle.Stroke };
            canvas.DrawRect(new SKRect(0, 0, frameImg.Width, frameImg.Height), borderPaint);
            canvas.Flush();

            using var singleImg = surface.Snapshot();

            // Ghép 3 QR
            var resultInfo = new SKImageInfo(1510, 500);
            using var resultSurface = SKSurface.Create(resultInfo);
            var c = resultSurface.Canvas;
            c.Clear(SKColors.White);

            c.DrawImage(singleImg, 0, 0);
            c.DrawImage(singleImg, 505, 0);
            c.DrawImage(singleImg, 1010, 0);
            c.Flush();

            return "data:image/png;base64," + SurfaceToBase64(resultSurface);
        }

        // ============================================================
        // QR đơn giản 1 QR + serial
        // ============================================================
        public string CreateQR_Single(string MA_TBI_QR, string SERIALNUM)
        {
            using var qrImg = GenerateQR(MA_TBI_QR, 480);
            using var logoImg = LoadAndResize($"{_rootPath}/QRIcon.png", 120, 120);
            using var frameImg = LoadAndResize($"{_rootPath}/QRbg.png", 500, 500);

            var surfaceInfo = new SKImageInfo(frameImg.Width, frameImg.Height);
            using var surface = SKSurface.Create(surfaceInfo);
            var canvas = surface.Canvas;
            canvas.Clear(SKColors.White);


            canvas.DrawImage(frameImg, 0, 0);
            canvas.DrawImage(qrImg, (frameImg.Width - qrImg.Width) / 2, 10);
            canvas.DrawImage(logoImg, (frameImg.Width - logoImg.Width) / 2, (frameImg.Height - logoImg.Height) / 2);

            using var paint = new SKPaint
            {
                Color = SKColors.Red,
                TextSize = 20,
                IsAntialias = true,
                TextAlign = SKTextAlign.Center,
                Typeface = SKTypeface.FromFamilyName("Times New Roman")
            };
            canvas.DrawText($"SERIAL: {SERIALNUM}", frameImg.Width / 2, 480, paint);

            using var borderPaint = new SKPaint { Color = SKColors.Black, StrokeWidth = 10, Style = SKPaintStyle.Stroke };
            canvas.DrawRect(new SKRect(0, 0, frameImg.Width, frameImg.Height), borderPaint);

            canvas.Flush();
            return "data:image/png;base64," + SurfaceToBase64(surface);
        }

        // ============================================================
        // QR tài sản (logo lớn, không text)
        // ============================================================
        public string CreateQR_TaiSan(string MA_TBI_QR, string SERIALNUM)
        {
            using var qrImg = GenerateQR(MA_TBI_QR, 700);
            using var logoImg = LoadAndResize($"{_rootPath}/QRIcon.png", 200, 200);
            using var frameImg = LoadAndResize($"{_rootPath}/QRbg.png", 700, 700);

            var surfaceInfo = new SKImageInfo(frameImg.Width, frameImg.Height);
            using var surface = SKSurface.Create(surfaceInfo);
            var canvas = surface.Canvas;
            canvas.Clear(SKColors.White);

            canvas.DrawImage(frameImg, 0, 0);
            canvas.DrawImage(qrImg, (frameImg.Width - qrImg.Width) / 2, 10);
            canvas.DrawImage(logoImg, (frameImg.Width - logoImg.Width) / 2, (frameImg.Height - logoImg.Height) / 2);

            canvas.Flush();
            return "data:image/png;base64," + SurfaceToBase64(surface);
        }

        // ============================================================
        // Các hàm hỗ trợ
        // ============================================================
        private static SKImage GenerateQR(string text, int size)
        {
            var qrGen = new QRCodeGenerator();
            var qrData = qrGen.CreateQrCode(text, QRCodeGenerator.ECCLevel.H);
            var qrCode = new PngByteQRCode(qrData);
            var bytes = qrCode.GetGraphic(20);

            using var bitmap = SKBitmap.Decode(bytes);
            var resized = bitmap.Resize(new SKImageInfo(size, size), SKFilterQuality.High);
            return SKImage.FromBitmap(resized);
        }

        private static SKImage LoadAndResize(string path, int w, int h)
        {
            if (!File.Exists(path))
            {
                var info = new SKImageInfo(w, h);
                using var s = SKSurface.Create(info);
                return s.Snapshot();
            }

            using var bitmap = SKBitmap.Decode(path);
            var resized = bitmap.Resize(new SKImageInfo(w, h), SKFilterQuality.High);
            return SKImage.FromBitmap(resized);
        }

        private static string SurfaceToBase64(SKSurface surface)
        {
            using var img = surface.Snapshot();
            using var data = img.Encode(SKEncodedImageFormat.Png, 100);
            return Convert.ToBase64String(data.ToArray());
        }
    }
}
