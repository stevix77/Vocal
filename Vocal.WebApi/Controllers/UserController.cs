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

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        [HttpPost,Route("IsExistsUsername")]
        public Response<bool> IsExistsUsername(UserExistsRequest request)
        {
            return UserBusiness.IsExistsUsername(request.Value, request.Lang);
        }

        [HttpPost, Route("IsExistsEmail")]
        public Response<bool> IsExistsEmail(UserExistsRequest request)
        {
            return UserBusiness.IsExistsEmail(request.Value, request.Lang);
        }
    }
}
