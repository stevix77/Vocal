using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class FriendBusiness
    {
        public static Response<List<UserResponse>> SearchFriends(List<string> emails, string lang)
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                LogManager.LogDebug(emails, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var list = Repository.Instance.SearchFriendsByEmails(emails);
                response.Data = Binder.Bind.Bind_Users(list);
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
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

        public static Response<List<UserResponse>> GetFriends(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                LogManager.LogDebug(userId, pageNumber, pageSize, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var list = Repository.Instance.GetFriends(userId, pageSize, pageNumber);
                response.Data = Binder.Bind.Bind_Users(list);
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
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

        public static Response<bool> AddFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(userId, ids, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = Repository.Instance.AddFriends(userId, ids);
                if (response.Data)
                    Task.Run(async () =>
                    {
                        var user = Repository.Instance.GetUserById(userId);
                        if(user != null)
                            await NotificationBusiness.SendNotification(ids, NotifType.AddFriend, user.Username);
                    });
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
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

        public static Response<bool> RemoveFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = Repository.Instance.RemoveFriends(userId, ids);
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
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

        public static Response<List<UserResponse>> GetFriendsAddedMe(string userId, string lang)
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                LogManager.LogDebug(userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var user = Repository.Instance.GetUserById(userId);
                var list = Repository.Instance.GetFriendsAddedMe(userId);
                response.Data = Binder.Bind.Bind_Users(user, list);
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
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
