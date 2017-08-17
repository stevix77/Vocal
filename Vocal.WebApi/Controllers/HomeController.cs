using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    public class HomeController : ApiController
    {
        [HttpPost, Route("init")]
        public Response<InitResponse> Initialize(Request request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return InitBusiness.Initialize(obj.UserId, request.Lang);
        }
    }
}
