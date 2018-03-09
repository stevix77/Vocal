using System;
using System.Threading.Tasks;
using Vocal.Business.Binder;
using Vocal.Business.Properties;
using Vocal.Business.Security;
using Vocal.Business.Tools;
using Vocal.Model.Business;
using Vocal.Model.Context;
using Vocal.Model.DB;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public class AuthentificationBusiness : BaseBusiness
    {
        public AuthentificationBusiness(DbContext context) : base(context)
        {
        }

        public Response<UserResponse> Login(string login, string pwd, string lang)
        {
            Response<UserResponse> response = new Response<UserResponse>();
            try
            {
                LogManager.LogDebug(login, pwd, lang);
                string password = Hash.getHash(pwd);
                login = login.ToLower();
                var user = _repository.Login(login, password);
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

        public Response<bool> ResetPassword(string password, string username, string token, string lang)
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
                    var user = _repository.GetUserByUsername(username);
                    user.Token = newToken;
                    user.Password = pwd;
                    _repository.UpdateUser(user);
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

        public Response<UserResponse> Register(string email, string username, string password, string firstname, string lastname, DateTime birthday, string lang)
        {
            var response = new Response<UserResponse>();
            LogManager.LogDebug(email, username, password, firstname, lastname, birthday, lang);
            try
            {
                var user = _repository.GetUserByEmail(email);
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
                    foreach (var pictureType in Enum.GetNames(typeof(PictureType)))
                    {
                        var p = (PictureType)Enum.Parse(typeof(PictureType), pictureType);
                        user.Pictures.Add(new Picture
                        {
                            Type = p,
                            Value = $"{Properties.Settings.Default.PictureUrl}/{pictureType}/{GetDefaultImage(p)}"
                        });
                    }
                    _repository.AddUser(user);
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

        public Response<bool> PasswordForgot(string email, string lang)
        {
            LogManager.LogDebug(email, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            var response = new Response<bool>();
            try
            {
                var user = _repository.GetUserByEmail(email);
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
                        user.Reset = new ResetPassword { Token = token, ValidityDate = DateTime.Now.AddMinutes(Properties.Settings.Default.ValidityToken) };
                        _repository.UpdateUser(user);
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

        public Response<bool> IsTokenValid(string username, string token, string lang)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(username, token, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var user = _repository.GetUserByUsername(username);
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

        private string GetDefaultImage(PictureType p)
        {
            if (p == PictureType.Profil)
                return Properties.Settings.Default.DefaultImageProfil;
            else if (p == PictureType.Talk)
                return Properties.Settings.Default.DefaultImageTalk;
            else
                return string.Empty;
        }
    }
}
