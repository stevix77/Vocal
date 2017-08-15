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
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(emails, lang);
            try
            {
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

        public static Response<bool> AddFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = Repository.Instance.AddFriends(userId, ids);
                Task.Run(async () =>
                {
                    var user = Repository.Instance.GetUserById(userId);
                    if(user != null)
                    {
                        var mess = $"{user.Username} {Resources_Language.TextNotifAddFriend}";
                        await SendNotif(ids, mess);
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

        private static async Task SendNotif(List<string> ids, string mess)
        {
            foreach(var item in ids)
            {
                var tag = $"{Settings.Default.TagUser}:{item}";
                await NotificationBusiness.SendNotification(new List<string> { item }, tag, mess);
            }
        }
    }
}
