using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.DB;

namespace Vocal.Business.Security
{
    public static class Authorize
    {
        /// <summary>
        /// Check if it's token's id
        /// </summary>
        /// <param name="id">User's Identifiant</param>
        /// <param name="sign">Signature de la requête</param>
        /// <param name="timestamp">Timestamp utilisé pour générer la signature</param>
        /// <returns>True if matching</returns>
        public static bool IsAuthorize(string id, string sign, string timestamp, string url)
        {
            bool authorize = false;
            if (!IsSignatureExist(sign))
            {
                string token = string.Empty;
                token = CacheManager.GetCache<string>($"{Properties.Settings.Default.CacheKeyToken}_{id}");
                if (string.IsNullOrEmpty(token))
                {
                    var user = Repository.Instance.GetUserById(id);
                    if (user != null)
                    {
                        token = user.Token;
                        CacheManager.SetCache($"{Properties.Settings.Default.CacheKeyToken}_{id}", token);
                    }
                }
                string signature = Hash.getHash(string.Format(Properties.Settings.Default.FormatSign, url, timestamp, token));
                if (sign.Equals(signature))
                {
                    authorize = true;
                    Task.Run(() => SaveSignature(id, sign));
                }
            }
            return authorize;
        }

        private static void SaveSignature(string sign, string userId)
        {
            Repository.Instance.SaveSign(userId, sign);
        }

        private static bool IsSignatureExist(string sign)
        {
            var exists = Repository.Instance.GetSignature(sign);
            return exists;
        }
    }
}
