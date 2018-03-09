using System.Web.Mvc;
using Vocal.Business;
using Vocal.Business.Business;
using Vocal.Business.Tools;
using Vocal.WebApi.Helpers;
using Vocal.WebApi.Models;

namespace Vocal.WebApi.Controllers
{
    public class AccountController : Controller
    {
        readonly AuthentificationBusiness _authentificationBusiness;
        readonly Monitoring _monitoring;

        public AccountController()
        {
            var dbContext = ContextGenerator.GetDbContext();
            _authentificationBusiness = new AuthentificationBusiness(dbContext);
            _monitoring = new Monitoring(dbContext);
        }


        // GET: Account
        public ActionResult ResetPassword(string id, string token, string lang)
        {
            var response = _monitoring.Execute(_authentificationBusiness.IsTokenValid, id, token, lang);
            if (response.Data)
                return View();
            else
            {
                ViewBag.Error = response.ErrorMessage;
                return View("Error");
            }
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult ResetPassword(PasswordReset model, string id, string token, string lang)
        {
            if(ModelState.IsValid)
            {
                var response = _monitoring.Execute(_authentificationBusiness.ResetPassword, model.Password, id, token, lang);
                if (response.Data)
                {
                    ViewBag.Success = Business.Properties.Resources_Language.ResetPasswordSuccess;
                    return View("ResetPasswordSuccess");
                }
                else
                {
                    ViewBag.Error = response.ErrorMessage;
                    return View("Error");
                }
            }
            else
                return View(model);
        }
    }
}