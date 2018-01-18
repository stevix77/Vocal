using NAudio.Wave;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace Vocal.Business.Tools
{
    public static class Converter
    {
        public static byte[] ConvertToWav(string base64File)
        {
            LogManager.LogDebug(base64File);
            byte[] stream = null;
            using (var file = new StreamMediaFoundationReader(new MemoryStream(Convert.FromBase64String(base64File))))
            {
                using (var pcm = WaveFormatConversionStream.CreatePcmStream(file))
                {
                    var wavStream = new MemoryStream();
                    WaveFileWriter.WriteWavFileToStream(wavStream, pcm);
                    stream = wavStream.ToArray();
                }
            }
            return stream;
        }

        public static void ConvertToImageAndSave(string base64File, string filename, int width, int height)
        {
            byte[] imageBytes = Convert.FromBase64String(base64File);
            using (var ms = new MemoryStream(imageBytes))
            {
                using (var image = Image.FromStream(ms, true))
                {
                    var bitmap = new Bitmap(image, new Size(width, height));
                    bitmap.Save(filename, ImageFormat.Jpeg);
                }
            }
        }
    }
}
