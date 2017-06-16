using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Binder;
using Vocal.Business.Properties;
using Vocal.Business.Security;
using Vocal.Business.Signalr;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Model.Response;

namespace Vocal.Business
{
    public static class AuthentificationBusiness
    {
        private static Repository _repo = new Repository();

        public static Response<UserResponse> Login(string login, string pwd, string lang)
        {
            Response<UserResponse> response = new Response<UserResponse>();
            try
            {
                LogManager.LogDebug(login, pwd, lang);
                string password = Hash.getHash(pwd);
                var user = _repo.Login(login, password);
                if (user != null)
                    response.Data = Bind.Bind_User(user);
                else
                    throw new CustomException(Resource.GetValue(lang, Resource.UserinfoError));
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
                response.ErrorMessage = Resource.GetValue(lang, Resource.TimeoutError);
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resource.GetValue(lang, Resource.TechnicalError);
            }
            return response;
        }

        public static Response<UserResponse> Register(string email, string username, string password, string firstname, string lastname, DateTime birthday, string lang)
        {
            var response = new Response<UserResponse>();
            LogManager.LogDebug(email, username, password, firstname, lastname, birthday, lang);
            try
            {
                var user = _repo.GetUserByEmail(email);
                if (user != null)
                    throw new CustomException(Resource.GetValue(lang, Resource.MailExisting));
                else
                {
                    string id = Guid.NewGuid().ToString();
                    string pwd = Hash.getHash(password);
                    string token = Hash.getHash(string.Format(Settings.Default.FormatToken, DateTime.Now.ToString("yyyy"), password, Settings.Default.Salt));
                    user = new User
                    {
                        Id = id,
                        Email = email,
                        IsActive = true,
                        Password = pwd,
                        RegistrationDate = DateTime.Now,
                        Username = username,
                        Token = token,
                        BirthdayDate = birthday,
                        Firstname = firstname,
                        Lastname = lastname
                    };
                    _repo.AddUser(user);
                    response.Data = Bind.Bind_User(user);
                }
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
                response.ErrorMessage = Resource.GetValue(lang, Resource.TimeoutError);
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resource.GetValue(lang, Resource.TechnicalError);
            }
            return response;
        }

        public static async Task<Response<bool>> Password(string email, string lang)
        {
            var response = new Response<bool>();
            try
            {
                var user = _repo.GetUserByEmail(email);
                if (user == null)
                    throw new CustomException(Resource.GetValue(lang, Resource.MailNotExisting));
                else
                {
                    var message = Resource.GetValue(lang, Resource.AskPassword);
                    message = string.Format(message, email);
                    await MailManager.Send(email, message, lang);
                    response.Data = true;
                }
            }
            catch (TimeoutException ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resource.GetValue(lang, Resource.TimeoutError);
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resource.GetValue(lang, Resource.TechnicalError);
            }
            return response;
        }
    }
}
