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
        private static Repository _repo = new Repository();

        
        /// <summary>
        /// Check if it's token's id
        /// </summary>
        /// <param name="id">User's Identifiant</param>
        /// <param name="sign">Signature de la requête</param>
        /// <param name="timestamp">Timestamp utilisé pour générer la signature</param>
        /// <returns>True if matching</returns>
        public static bool IsAuthorize(string id, string sign, string timestamp)
        {
            bool authorize = false;
            if (!IsSignatureExist(sign))
            {
                string token = string.Empty;
                token = CacheManager.GetCache<string>($"{Settings.Default.CacheKeyToken}_{id}");
                if (string.IsNullOrEmpty(token))
                {
                    var user = _repo.GetUserById(id);
                    if (user != null)
                    {
                        token = user.Token;
                        CacheManager.SetCache($"{Settings.Default.CacheKeyToken}_{id}", token);
                    }
                }
                string signature = Hash.getHash(string.Format(Settings.Default.FormatSign, id, token, timestamp));
                if (sign.Equals(signature))
                {
                    authorize = true;
                    Task.Run(() => SaveSignature(sign, id));
                }
            }
            return authorize;
        }

        private static void SaveSignature(string sign, string userId)
        {
            Sign s = new Sign { Id = sign, UserId = userId };
            _repo.SaveSign(s);
        }

        private static bool IsSignatureExist(string sign)
        {
            var s = _repo.GetSignature(sign);
            return s != null;
        }
    }
}
