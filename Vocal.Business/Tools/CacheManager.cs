using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;

namespace Vocal.Business.Tools
{
    public class CacheManager
    {
        public static T GetCache<T>(string key)
        {
            var content = System.Web.HttpRuntime.Cache.Get(key);
            if (content != null)
                return (T)content;
            else
                return default(T);
        }

        public static void SetCache<T>(string key, T response)
        {
            System.Web.HttpRuntime.Cache.Insert(key, response, null, DateTime.Now.AddHours(Settings.Default.CacheDuration), System.Web.Caching.Cache.NoSlidingExpiration);
        }

        public static void RemoveCache(string key)
        {
            System.Web.HttpRuntime.Cache.Remove(key);
        }
        public static string GetKey(string cacheKey, string value)
        {
            return string.Format(cacheKey, value);
        }
    }
}
