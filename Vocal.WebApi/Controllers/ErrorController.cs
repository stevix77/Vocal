using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/error")]
    public class ErrorController : ApiController
    {
        [Route("add"), HttpPost]
        public void AddError(object ex)
        {
            ExceptionBusiness.Add(ex.ToString());
        }
    }
}
