using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.DAL;

namespace Vocal.Business.Security
{
    public static class Authorize
    {
        private static Repository _repo = new Repository();
        /// <summary>
        /// Check if it's token's id
        /// </summary>
        /// <param name="id">User's Identifiant</param>
        /// <param name="token">Token's user</param>
        /// <returns>True if matching</returns>
        public static bool IsAuthorize(string id, string token)
        {
            bool authorize = false;
            string t = string.Empty;
            t = Cache.CacheManager.GetCache<string>($"{Settings.Default.CacheKeyToken}_{id}");
            if(string.IsNullOrEmpty(t))
            {
                var user = _repo.GetUserById(id);
                if(user != null)
                    t = user.Token;
            }
            if (t.Equals(token))
            {
                authorize = true;
                Cache.CacheManager.SetCache($"{Settings.Default.CacheKeyToken}_{id}", token);
            }
            return authorize;
        }
    }
}
