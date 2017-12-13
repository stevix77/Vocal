namespace Vocal.WebApi.Controllers
{
    using System.Web.Http;

    public abstract class VocalApiController : ApiController
    {
        public string GetUserIdFromCookie()
        {
            return Helpers.Helper.GetAuthorizeCookie(ActionContext).UserId;
        }
    }
}