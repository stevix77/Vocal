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
        [HttpPost,Route("IsExistsUsername/{username}")]
        public Response<bool> IsExistsUsername(string username, Vocal.Model.Request.Request request)
        {
            return UserBusiness.IsExistsUsername(username, request.Lang);
        }

        [HttpPost, Route("IsExistsEmail/{username}")]
        public Response<bool> IsExistsEmail(string email, Request request)
        {
            return UserBusiness.IsExistsEmail(email, request.Lang);
        }
    }
}
