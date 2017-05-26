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
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var user = HttpContext.Current.Request.Cookies.Get("User");
            //var user = httpContext.Session["User"] as Model.Business.User;
            if (user != null)
                return true;
            else
                return false;
            //return base.AuthorizeCore(httpContext);
        }
    }
}