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
    [RoutePrefix("api/follow")]
    public class FollowController : VocalApiController
    {
        [HttpPost, CustomAuthorize, Route("getFollowers")]
        public Response<List<UserResponse>> GetFollowers(GetFollowUserRequest request)
        {
            return Business.Tools.Monitoring.Execute(FollowBusiness.GetFollowers, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("getFollowing")]
        public Response<List<UserResponse>> GetFollowing(GetFollowUserRequest request)
        {
            return Business.Tools.Monitoring.Execute(FollowBusiness.GetFollowing, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("follow")]
        public Response<bool> Follow(ManageFollowUserRequest request)
        {
            return Business.Tools.Monitoring.Execute(FollowBusiness.Follow, request.UserId, request.Ids, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("unfollow")]
        public Response<bool> Unfollow(ManageFollowUserRequest request)
        {
            return Business.Tools.Monitoring.Execute(FollowBusiness.Unfollow, request.UserId, request.Ids, request.Lang);
        }
    }
}