using Microsoft.Bing.Speech;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Vocal.Business
{
    public class CognitiveServicesAuthorizationProvider : IAuthorizationProvider
    {
        private readonly string subscriptionKey;

        public CognitiveServicesAuthorizationProvider(string subscriptionKey)
        {
            if (subscriptionKey == null)
            {
                throw new ArgumentNullException(nameof(subscriptionKey));
            }

            if (string.IsNullOrWhiteSpace(subscriptionKey))
            {
                throw new ArgumentException(nameof(subscriptionKey));
            }

            this.subscriptionKey = subscriptionKey;
        }

        private const string FetchTokenUri = "https://api.cognitive.microsoft.com/sts/v1.0";

        public Task<string> GetAuthorizationTokenAsync()
        {
            return FetchToken(FetchTokenUri, subscriptionKey);
        }

        private static async Task<string> FetchToken(string fetchUri, string subscriptionKey)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
                var uriBuilder = new UriBuilder(fetchUri);
                uriBuilder.Path += "/issueToken";

                using (var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null).ConfigureAwait(false))
                {
                    return await result.Content.ReadAsStringAsync().ConfigureAwait(false);
                }
            }
        }
    }
}
