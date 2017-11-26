using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/error")]
    public class ErrorController : VocalApiController
    {
        [Route("add"), HttpPost]
        public void AddError(object ex)
        {
            ExceptionBusiness.Add(ex.ToString());
        }
    }
}
