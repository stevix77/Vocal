using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;


namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/auth")]
    public class AuthController : VocalApiController
    {
        readonly AuthentificationBusiness _authentificationBusiness;

        public AuthController()
        {
            _authentificationBusiness = new AuthentificationBusiness(_dbContext);
        }

        [HttpPost]
        [Route("login")]
        public Response<UserResponse> Login(LoginRequest request)
        {
            return _monitoring.Execute(_authentificationBusiness.Login, request.Login, request.Password, request.Lang);
        }

        [HttpPost]
        [Route("register")]
        public Response<UserResponse> Register(RegisterRequest request)
        {
            return _monitoring.Execute(_authentificationBusiness.Register, request.Email, request.Username, request.Password, request.Firstname, request.Lastname, request.BirthdayDate, request.Lang);
        }
        
        [HttpPost]
        [Route("askpassword")]
        public Response<bool> PasswordForgot(PasswordRequest request)
        {
            return _monitoring.Execute(_authentificationBusiness.PasswordForgot, request.Email, request.Lang);
        }
    }
}
