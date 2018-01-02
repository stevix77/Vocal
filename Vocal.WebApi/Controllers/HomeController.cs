using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;
using Vocal.WebApi.Attribute;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [CustomAuthorize, RoutePrefix("api/home")]
    public class HomeController : VocalApiController
    {
        readonly InitBusiness _initBusiness;

        public HomeController()
        {
            _initBusiness = new InitBusiness(_dbContext, _hubContext);
        }

        [HttpPost, Route("init")]
        public Response<InitResponse> Initialize(Request request)
        {
            return _monitoring.Execute(_initBusiness.Initialize, GetUserIdFromCookie(), request.Lang);
        }
    }
}
