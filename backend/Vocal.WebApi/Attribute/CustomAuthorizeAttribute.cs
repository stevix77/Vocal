using System.Web.Http;
using System.Web.Http.Controllers;
using Vocal.Business.Security;
using Vocal.WebApi.Helpers;

namespace Vocal.WebApi.Attribute
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var dbContext = ContextGenerator.GetDbContext();
            bool isAuthorize = false;
            var obj = Helper.GetAuthorizeCookie(actionContext);
            if (obj != null)
            {
                isAuthorize = new Authorize(dbContext).IsAuthorize(obj.UserId, obj.Sign, obj.Timestamp, actionContext.Request.RequestUri.AbsoluteUri);
            }
            return isAuthorize;
        }
    }
}