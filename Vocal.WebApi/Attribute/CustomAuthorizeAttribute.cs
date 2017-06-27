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
            var values = new List<string>().AsEnumerable();
            if(actionContext.Request.Headers.TryGetValues("Set-Cookie", out values))
            {
                var cookie = values.SingleOrDefault(x => x.StartsWith("authorize"));
                if(!string.IsNullOrEmpty(cookie))
                {
                    var value = cookie.Split('=').SingleOrDefault(x => x.StartsWith("{"));
                    var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.Request.CookieRequest>(value);
                    if (obj != null)
                    {
                        isAuthorize = Authorize.IsAuthorize(obj.UserId, obj.Sign, obj.Timestamp, actionContext.Request.RequestUri.AbsoluteUri);
                    }
                }
            }
            return isAuthorize;
            //return base.AuthorizeCore(httpContext);
        }
    }
}