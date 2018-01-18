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
        readonly FollowBusiness _followBusiness;

        public FollowController()
        {
            _followBusiness = new FollowBusiness(_dbContext, _hubContext);
        }

        [HttpPost, CustomAuthorize, Route("getFollowers")]
        public Response<List<UserResponse>> GetFollowers(GetFollowUserRequest request)
        {
            return _monitoring.Execute(_followBusiness.GetFollowers, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("getFollowing")]
        public Response<List<UserResponse>> GetFollowing(GetFollowUserRequest request)
        {
            return _monitoring.Execute(_followBusiness.GetFollowing, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("follow")]
        public Response<bool> Follow(ManageFollowUserRequest request)
        {
            return _monitoring.Execute(_followBusiness.Follow, request.UserId, request.Ids, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("unfollow")]
        public Response<bool> Unfollow(ManageFollowUserRequest request)
        {
            return _monitoring.Execute(_followBusiness.Unfollow, request.UserId, request.Ids, request.Lang);
        }
    }
}