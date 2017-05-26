using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Business;
using Vocal.Model.Request;
using System.Web.Http;
using Vocal.Model.Response;
using Vocal.WebApi.Attribute;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Vocal.WebApi.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        [HttpPost]
        [Route("login")]
        public Response<UserResponse> Login(LoginRequest request)
        {
            var response = AuthentificationBusiness.Login(request.Login, request.Password, request.Lang);
            return response;

        }

        [HttpPost]
        [Route("register")]
        public Response<UserResponse> Register(RegisterRequest request)
        {
            return AuthentificationBusiness.Register(request.Email, request.Username, request.Password, request.Lang);
        }
        
        [HttpPost]
        [Route("askpassword")]
        public Task<Response<bool>> Password(PasswordRequest request)
        {
            return AuthentificationBusiness.Password(request.Email, request.Lang);
        }
    }
}
