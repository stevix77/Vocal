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
    [RoutePrefix("api/friend")]
    public class FriendController : ApiController
    {
        [HttpPost, CustomAuthorize, Route("getFriends")]
        public Response<List<UserResponse>> GetFriends(GetFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.GetFriends, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("addedMe")]
        public Response<List<PeopleResponse>> GetContactsAddMe(GetFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.GetFriendsAddedMe, request.UserId, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("add")]
        public Response<bool> AddFriends(ManageFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.AddFriends, request.UserId, request.Ids, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("Remove")]
        public Response<bool> RemoveFriends(ManageFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.RemoveFriends, request.UserId, request.Ids, request.Lang);
        }
    }
}
