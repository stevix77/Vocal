using System;
using System.Web;

namespace Vocal.Business.Tools
{
    public static class CookieManager
    {
        public static HttpCookie Get(string name)
        {
            var cookie = HttpContext.Current.Request.Cookies.Get(name);
            return cookie;
        }

        public static void Set(string name, string value)
        {
            var cookie = new HttpCookie(name, value);
            cookie.HttpOnly = false;
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        public static void Remove(string name)
        {
            var cookie = HttpContext.Current.Request.Cookies.Get(name);
            cookie.Expires = DateTime.Now.AddDays(-1);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
    }
}
