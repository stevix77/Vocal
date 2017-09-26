using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
//using System.Web.Mvc;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;
using Vocal.WebApi.Attribute;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        [HttpPost,Route("IsExistsUsername")]
        public Response<bool> IsExistsUsername(UserExistsRequest request)
        {
            return Business.Tools.Monitoring.Execute(UserBusiness.IsExistsUsername, request.Value, request.Lang);
        }

        [HttpPost, Route("IsExistsEmail")]
        public Response<bool> IsExistsEmail(UserExistsRequest request)
        {
            return Business.Tools.Monitoring.Execute(UserBusiness.IsExistsEmail, request.Value, request.Lang);
        }

        [HttpPost, Route("me"), CustomAuthorize]
        public Response<SettingsResponse> GetSettings(Request request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Business.Tools.Monitoring.Execute(UserBusiness.GetSettings, obj.UserId, request.Lang);
        }

        [HttpPost, Route("me/update"), CustomAuthorize]
        public Response<bool> UpdateUser(UpdateRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Business.Tools.Monitoring.Execute(UserBusiness.UpdateUser, obj.UserId, request.Value, request.UpdateType, request.Lang);
        }

        [HttpPost, Route("list"), CustomAuthorize]
        public Response<List<UserResponse>> GetListUsers(Request request)
        {
            return Business.Tools.Monitoring.Execute(UserBusiness.GetListUsers, request.Lang);
        }
    }
}
