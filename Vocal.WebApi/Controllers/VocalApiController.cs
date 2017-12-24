namespace Vocal.WebApi.Controllers
{
    using System.Web.Http;

    public abstract class VocalApiController : ApiController
    {
        protected string GetUserIdFromCookie()
        {
            return Helpers.Helper.GetAuthorizeCookie(ActionContext).UserId;
        }
    }
}