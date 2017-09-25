using NAudio.Wave;
using System;
using System.Collections.Generic;
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
    }
}
