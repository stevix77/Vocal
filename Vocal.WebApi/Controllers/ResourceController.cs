using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/resource")]
    public class ResourceController : VocalApiController
    {
        [HttpPost, Route("list/{lang}")]
        public Response<List<KeyValueResponse<string, string>>> List(string lang)
        {
            return _monitoring.Execute(ResourceBusiness.GetAllResources, lang);
        }
    }
}