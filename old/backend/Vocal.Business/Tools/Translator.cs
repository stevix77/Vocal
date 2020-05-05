using Microsoft.Bing.Speech;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.DAL;

namespace Vocal.Business.Tools
{
    public static class Translator
    {
        public async static Task<string> Translate(string language, string audioFile)
        {
            //var uri = new Uri(Settings.Default.CognitiveServiceUrlLongAudio);
            //var csap = new CognitiveServicesAuthorizationProvider(Settings.Default.CognitiveServiceKey);
            var uri = new Uri("wss://speech.platform.bing.com/api/service/recognition/continuous");
            var csap = new CognitiveServicesAuthorizationProvider("6486858a75b244759a4697c0a2420188");
            var preferences = new Preferences(language, uri, csap);
            var result = string.Empty;
            using (var speechClient = new SpeechClient(preferences))
            {
                speechClient.SubscribeToRecognitionResult(async (res) => result = await OnRecognitionResult(res));

                // create an audio content and pass it a stream.
                using (var audio = new FileStream(audioFile, FileMode.Open, FileAccess.Read))
                {
                    var deviceMetadata = new DeviceMetadata(DeviceType.Near, DeviceFamily.Unknown, NetworkType.Unknown, OsName.Unknown, "ws12", "Unknown", "Unknown");
                    var applicationMetadata = new ApplicationMetadata("Vocal", "1.0.0");
                    var requestMetadata = new RequestMetadata(Guid.NewGuid(), deviceMetadata, applicationMetadata, "Vocal");

                    await speechClient.RecognizeAsync(new SpeechInput(audio, requestMetadata), new System.Threading.CancellationToken()).ConfigureAwait(false);
                }
            }
            return result;
        }

        private static Task<string> OnRecognitionResult(RecognitionResult arg)
        {
            string result = string.Empty;
            if (arg.RecognitionStatus == RecognitionStatus.Success)
            {
                var r = arg.Phrases.Where(x => x.Confidence == Confidence.High || x.Confidence == Confidence.Normal)
                                        .OrderBy(x => x.Confidence)
                                        .FirstOrDefault();
                if (r != null)
                    result = r.DisplayText;
                else
                    result = null;
            }
            return Task.FromResult(result);
        }
    }
}
