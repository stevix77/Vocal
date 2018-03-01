using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace Vocal.WebApi.Attribute
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        private static Business.Security.Authorize _authorize = new Business.Security.Authorize();

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            bool isAuthorize = false;
            var cookie = HttpContext.Current.Request.Cookies.Get("authorize");
            if (cookie != null)
            {
                var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.Request.CookieRequest>(cookie.Value);
                if(obj != null)
                {
                    isAuthorize = _authorize.IsAuthorize(obj.UserId, obj.Sign, obj.Timestamp);
                }
            }
            return isAuthorize;
            //return base.AuthorizeCore(httpContext);
        }
    }
}