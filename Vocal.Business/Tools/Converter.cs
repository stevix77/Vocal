using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            //LogManager.LogDebug(base64File, filename);
            // Convert base 64 string to byte[]
            byte[] imageBytes = Convert.FromBase64String(base64File);
            // Convert byte[] to Image
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
