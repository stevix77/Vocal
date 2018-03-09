using System.Collections.Generic;
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
    [RoutePrefix("api/user")]
    public class UserController : VocalApiController
    {

        readonly UserBusiness _userBusiness;

        public UserController()
        {
            _userBusiness = new UserBusiness(_dbContext);
        }

        [HttpPost,Route("IsExistsUsername")]
        public Response<bool> IsExistsUsername(UserExistsRequest request)
        {
            return _monitoring.Execute(_userBusiness.IsExistsUsername, request.Value, request.Lang);
        }

        [HttpPost, Route("IsExistsEmail")]
        public Response<bool> IsExistsEmail(UserExistsRequest request)
        {
            return _monitoring.Execute(_userBusiness.IsExistsEmail, request.Value, request.Lang);
        }

        [HttpPost, Route("me"), CustomAuthorize]
        public Response<SettingsResponse> GetSettings(Request request)
        {
            return _monitoring.Execute(_userBusiness.GetSettings, GetUserIdFromCookie(), request.Lang);
        }

        [HttpPost, Route("me/update"), CustomAuthorize]
        public Response<bool> UpdateUser(UpdateRequest request)
        {
            return _monitoring.Execute(_userBusiness.UpdateUser, GetUserIdFromCookie(), request.Value, request.UpdateType, request.Lang);
        }

        [HttpPost, Route("profil"), CustomAuthorize]
        public Response<UserResponse> GetUserById(ProfilRequest request)
        {
            return _monitoring.Execute(_userBusiness.GetUserById, GetUserIdFromCookie(), request.UserId, request.Lang);
        }

        [HttpPost, Route("list"), CustomAuthorize]
        public Response<List<UserResponse>> GetListUsers(Request request)
        {
            return _monitoring.Execute(_userBusiness.GetListUsers, request.Lang);
        }

        [HttpPost, Route("block"), CustomAuthorize]
        public Response<bool> BlockUsers(ManageFriendsRequest request)
        {
            return _monitoring.Execute(_userBusiness.BlockUsers, GetUserIdFromCookie(), request.Ids, request.Lang);
        }

        [HttpPost, Route("unblock"), CustomAuthorize]
        public Response<bool> UnblockUsers(ManageFriendsRequest request)
        {
            return _monitoring.Execute(_userBusiness.UnblockUsers, GetUserIdFromCookie(), request.Ids, request.Lang);
        }

        [HttpPost, Route("block/list"), CustomAuthorize]
        public Response<List<UserResponse>> GetUsersBlocked(Request request)
        {
            return _monitoring.Execute(_userBusiness.GetUsersBlocked, GetUserIdFromCookie(), request.Lang);
        }
    }
}
