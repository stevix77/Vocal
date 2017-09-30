using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class InitBusiness
    {
        public static Response<InitResponse> Initialize(string userId, string lang)
        {
            var response = new Response<InitResponse>();
            try
            {
                LogManager.LogDebug(userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = new InitResponse();
                var actionSettings = new Action(() =>
                {
                    var resp = UserBusiness.GetSettings(userId, lang);
                    if (!resp.HasError)
                        response.Data.Settings = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.Settings.ToString(), resp.ErrorMessage));
                });
                var actionTalks = new Action(() =>
                {
                    var resp = TalkBusiness.GetTalks(userId, lang);
                    if (!resp.HasError)
                        response.Data.Talks = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.Talks.ToString(), resp.ErrorMessage));
                });
                var actionFriends = new Action(() =>
                {
                    var resp = FriendBusiness.GetFriends(userId, 0, 0, lang);
                    if (!resp.HasError)
                        response.Data.Friends = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.Friends.ToString(), response.ErrorMessage));
                });
                var actionFriendsAddedMe = new Action(() =>
                {
                    var resp = FriendBusiness.GetFriendsAddedMe(userId, lang);
                    if (!resp.HasError)
                        response.Data.FriendsAddedMe = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.FriendsAddedMe.ToString(), response.ErrorMessage));
                });
                Parallel.Invoke(actionFriends, actionSettings, actionTalks, actionFriendsAddedMe);
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
