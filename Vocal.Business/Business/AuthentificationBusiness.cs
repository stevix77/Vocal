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
        public static Response<UserResponse> Login(string login, string pwd, string lang)
        {
            Response<UserResponse> response = new Response<UserResponse>();
            try
            {
                LogManager.LogDebug(login, pwd, lang);
                string password = Hash.getHash(pwd);
                login = login.ToLower();
                var user = Repository.Instance.Login(login, password);
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

        public static Response<bool> ResetPassword(string password, string username, string token, string lang)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(password, username, token, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var isTokenValid = IsTokenValid(username, token, lang);
                if (!isTokenValid.HasError && isTokenValid.Data)
                {
                    var pwd = Hash.getHash(password);
                    var newToken = Hash.getHash(string.Format(Properties.Settings.Default.FormatToken, username, password, Properties.Settings.Default.Salt));
                    var user = Repository.Instance.GetUserByUsername(username);
                    var listupdate = new List<UpdateModel>();
                    listupdate.Add(new UpdateModel { Obj = newToken, UpdateType = UpdateType.Field, Type = typeof(string), Field = "Token" });
                    listupdate.Add(new UpdateModel { Obj = pwd, UpdateType = UpdateType.Field, Type = typeof(string), Field = "Password" });
                    Repository.Instance.Update(user, listupdate);
                    //Repository.Instance.UpdateUser(user);
                    response.Data = true;
                }
                else
                    throw new CustomException(isTokenValid.ErrorMessage);
            }
            catch (TimeoutException ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TimeoutError;
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
        }

        public static Response<UserResponse> Register(string email, string username, string password, string firstname, string lastname, DateTime birthday, string lang)
        {
            var response = new Response<UserResponse>();
            LogManager.LogDebug(email, username, password, firstname, lastname, birthday, lang);
            try
            {
                var user = Repository.Instance.GetUserByEmail(email);
                if (user != null)
                    throw new CustomException(Resource.GetValue(lang, Resource.MailExisting));
                else
                {
                    string id = Guid.NewGuid().ToString();
                    string pwd = Hash.getHash(password);
                    string token = Hash.getHash(string.Format(Properties.Settings.Default.FormatToken, username, password, Properties.Settings.Default.Salt));
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
                    Repository.Instance.AddUser(user);
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

        public static Response<bool> PasswordForgot(string email, string lang)
        {
            LogManager.LogDebug(email, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            var response = new Response<bool>();
            try
            {
                var user = Repository.Instance.GetUserByEmail(email);
                if (user == null)
                    throw new CustomException(Resources_Language.MailNotExisting);
                else
                {
                    var token = Guid.NewGuid().ToString();
                    var url = $"{Properties.Settings.Default.UrlUpdatePassword}/{user.Username}?token={token}&lang={lang}";
                    var message = string.Format(Resources_Language.AskPassword, url, url);
                    MailManager.Send(email, message, lang);
                    response.Data = true;
                    Task.Run(() =>
                    {
                        var updatelist = new List<UpdateModel>()
                        {
                            new UpdateModel { UpdateType = UpdateType.Field, Type = typeof(ResetPassword), Field = "Reset", Obj = new ResetPassword { Token = token, ValidityDate = DateTime.Now.AddMinutes(Properties.Settings.Default.ValidityToken) } }
                        };
                        Repository.Instance.Update(user, updatelist);
                    });
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

        public static Response<bool> IsTokenValid(string username, string token, string lang)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(username, token, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var user = Repository.Instance.GetUserByUsername(username);
                if (user != null)
                {
                    if (user.Reset != null && user.Reset.IsActive && user.Reset.Token == token && user.Reset.ValidityDate.ToLocalTime() > DateTime.Now)
                        response.Data = true;
                    else
                        throw new CustomException(Resources_Language.InvalidToken);
                }
                else
                    throw new CustomException(Resources_Language.UsernameNotExisting);
            }
            catch (TimeoutException ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TimeoutError;
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
        }
    }
}
