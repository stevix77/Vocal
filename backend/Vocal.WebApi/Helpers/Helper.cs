using System.Collections.Generic;
using System.Linq;

namespace Vocal.WebApi.Helpers
{
    public static class Helper
    {
        public static Model.Request.CookieRequest GetAuthorizeCookie(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            Model.Request.CookieRequest request = null;
            var values = new List<string>().AsEnumerable();
            if (actionContext.Request.Headers.TryGetValues("Set-Cookie", out values))
            {
                var cookie = values.SingleOrDefault(x => x.StartsWith("authorize"));
                if (!string.IsNullOrEmpty(cookie))
                {
                    var value = cookie.Split('=').SingleOrDefault(x => x.StartsWith("{"));
                    request = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.Request.CookieRequest>(value);
                }
            }
            return request;
        }
    }
}