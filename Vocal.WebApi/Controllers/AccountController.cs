using System.Web.Mvc;
using Vocal.Business;
using Vocal.WebApi.Models;

namespace Vocal.WebApi.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult ResetPassword(string id, string token, string lang)
        {
            var response = Business.Tools.Monitoring.Execute(AuthentificationBusiness.IsTokenValid, id, token, lang);
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
                var response = Business.Tools.Monitoring.Execute(AuthentificationBusiness.ResetPassword, model.Password, id, token, lang);
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