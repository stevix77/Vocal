namespace Vocal.WebApi.Controllers
{
    using System.Web.Http;
    using Vocal.WebApi.Helpers;
    using Vocal.Model.Context;
    using Vocal.Business.Tools;

    public abstract class VocalApiController : ApiController
    {
        protected readonly DbContext _dbContext;
        protected readonly HubContext _hubContext;
        protected readonly Monitoring _monitoring;
      

        public VocalApiController()
        {
            _dbContext = ContextGenerator.GetDbContext();
            _hubContext = ContextGenerator.GetHubContext();
            _monitoring = new Monitoring(_dbContext);
        }

        protected string GetUserIdFromCookie()
        {
            return Helper.GetAuthorizeCookie(ActionContext).UserId;
        }
    }
}