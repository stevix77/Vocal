using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.WebApi.Attribute;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/notification")]
    public class NotificationController : VocalApiController
    {
        readonly NotificationBusiness _notificationBusiness;

        public NotificationController()
        {
            _notificationBusiness = new NotificationBusiness(_dbContext, _hubContext);
        }

        [HttpPost, CustomAuthorize, Route("register")]
        public async Task<Response<string>> GetRegistrationId(NotificationRegisterRequest request)
        {
            return await _notificationBusiness.GetRegistrationId(request.Channel, request.UserId, request.Platform, request.Lang);
        }
    }
}
