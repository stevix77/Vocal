using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.DAL;

namespace Vocal.Business.Security
{
    public class Authorize
    {
        private static Repository _repo = new Repository();

        
        /// <summary>
        /// Check if it's token's id
        /// </summary>
        /// <param name="id">User's Identifiant</param>
        /// <param name="sign">Signature de la requête</param>
        /// <param name="timestamp">Timestamp utilisé pour générer la signature</param>
        /// <returns>True if matching</returns>
        public bool IsAuthorize(string id, string sign, string timestamp)
        {
            bool authorize = false;
            if (IsSignatureExist(sign))
                return authorize;
            string token = string.Empty;
            token = Cache.CacheManager.GetCache<string>($"{Settings.Default.CacheKeyToken}_{id}");
            if(string.IsNullOrEmpty(token))
            {
                var user = _repo.GetUserById(id);
                if (user == null)
                    return authorize;
                token = user.Token;
                Cache.CacheManager.SetCache($"{Settings.Default.CacheKeyToken}_{id}", token);
            }
            string signature = Hash.getHash(string.Format(Settings.Default.FormatSign, id, token, timestamp));
            if (sign.Equals(signature))
            {
                authorize = true;
                Task.Run(() => SaveSignature(sign));
            }
            return authorize;
        }

        private void SaveSignature(string sign)
        {
            throw new NotImplementedException();
        }

        private bool IsSignatureExist(string sign)
        {
            throw new NotImplementedException();
        }
    }
}
