using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using Vocal.Business.Security;
using Vocal.Business.Tools;

namespace Vocal.WebApi.Attribute
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            bool isAuthorize = false;
            var cookie = CookieManager.Get("authorize");
            if (cookie != null)
            {
                var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.Request.CookieRequest>(cookie.Value);
                if(obj != null)
                {
                    isAuthorize = Authorize.IsAuthorize(obj.UserId, obj.Sign, obj.Timestamp);
                }
            }
            return isAuthorize;
            //return base.AuthorizeCore(httpContext);
        }
    }
}