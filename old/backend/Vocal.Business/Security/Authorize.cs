using System.Threading.Tasks;
using Vocal.Business.Business;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Context;

namespace Vocal.Business.Security
{
    public class Authorize : BaseBusiness
    {
        public Authorize(DbContext context) : base(context)
        {

        }
        /// <summary>
        /// Check if it's token's id
        /// </summary>
        /// <param name="id">User's Identifiant</param>
        /// <param name="sign">Signature de la requête</param>
        /// <param name="timestamp">Timestamp utilisé pour générer la signature</param>
        /// <returns>True if matching</returns>
        public bool IsAuthorize(string id, string sign, string timestamp, string url)
        {
            bool authorize = false;
            if (!IsSignatureExist(sign))
            {
                string token = string.Empty;
                token = CacheManager.GetCache<string>($"{Properties.Settings.Default.CacheKeyToken}_{id}");
                if (string.IsNullOrEmpty(token))
                {
                    var user = _repository.GetUserById(id);
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
                    Task.Run(() => SaveSignature(sign, id));
                }
            }
            return authorize;
        }

        private void SaveSignature(string sign, string userId)
        {
            _repository.SaveSign(userId, sign);
        }

        private bool IsSignatureExist(string sign)
        {
            var exists = _repository.GetSignature(sign);
            return exists;
        }
    }
}
