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
    public static class FollowBusiness
    {
        
        public static Response<List<UserResponse>> GetFollowers(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            LogManager.LogDebug(userId, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var list = Repository.Instance.GetFollowers(userId, pageSize, pageNumber);
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

        public static Response<List<UserResponse>> GetFollowing(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            LogManager.LogDebug(userId, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var list = Repository.Instance.GetFollowing(userId, pageSize, pageNumber);
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

        public static Response<bool> Follow(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = Repository.Instance.Follow(userId, ids);
                Task.Run(async () =>
                {
                    var user = Repository.Instance.GetUserById(userId);
                    if(user != null)
                    {
                        await NotificationBusiness.SendNotification(ids, NotifType.Follow, user.Username);
                    }
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

        public static Response<bool> Unfollow(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = Repository.Instance.Unfollow(userId, ids);
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
