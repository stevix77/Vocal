using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Model.Response;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Business.Tools;
using Vocal.Business.Properties;
using Vocal.DAL;

namespace Vocal.Business.Business
{
    public static class NotificationBusiness
    {
        public static async Task<Response<string>> GetRegistrationId(string channel, string userId, string platform, string lang)
        {
            var response = new Response<string>();
            LogManager.LogDebug(channel, userId, platform, lang);
            try
            {
                var user = Repository.Instance.GetUserById(userId);
                if(user != null)
                {
                    if(true)
                    //if (!user.Devices.Exists(x => x.Channel == channel))
                    {
                        var registrationId = await NotificationHub.Instance.GetRegistrationId(channel);
                        var tag = $"{Properties.Settings.Default.TagUser}:{userId}";
                        user.Devices.Add(new Vocal.Model.DB.Device
                        {
                            RegistrationId = registrationId,
                            Platform = platform,
                            Channel = channel,
                            Tags = new List<string>() { tag },
                            Lang = lang
                        });
                        Repository.Instance.UpdateUser(user);
                        await NotificationHub.Instance.RegistrationUser(registrationId, channel, platform, tag);
                        response.Data = registrationId;
                    }
                }
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

        public static async Task<Response<bool>> SendNotification(List<string> ids, NotifType type, params string[] param)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(ids, type, param);
            try
            {
                foreach (var id in ids)
                {
                    var u = Repository.Instance.GetUserById(id);
                    var tag = $"{Properties.Settings.Default.TagUser}:{id}";
                    foreach (var ptf in u.Devices.Select(x => x.Platform).Distinct())
                    {
                        var payload = string.Format(GetTemplate(type, ptf, param));
                        await NotificationHub.Instance.SendNotification(ptf, tag, payload);
                    }
                }
                response.Data = true;
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

        private static string GetPayloadTalk(string platform)
        {
            string payload = string.Empty;
            switch (platform)
            {
                case "gcm":
                    payload = PayloadSettings.Default.TalkAndroid;
                    break;
                case "apns":
                    payload = PayloadSettings.Default.TalkiOs;
                    break;
                case "wns":
                    payload = PayloadSettings.Default.TalkWindows;
                    break;
                default:
                    break;
            }
            return payload;
        }

        private static string GetPayloadAddFriends(string platform)
        {
            string payload = string.Empty;
            switch (platform)
            {
                case "gcm":
                    payload = PayloadSettings.Default.AddFriendsAndroid;
                    break;
                case "apns":
                    payload = PayloadSettings.Default.AddFriendsiOs;
                    break;
                case "wns":
                    payload = PayloadSettings.Default.AddFriendsWindows;
                    break;
                default:
                    break;
            }
            return payload;
        }

        private static string GetPayloadFollow(string platform)
        {
            string payload = string.Empty;
            switch (platform)
            {
                case "gcm":
                    payload = PayloadSettings.Default.FollowAndroid;
                    break;
                case "apns":
                    payload = PayloadSettings.Default.FollowiOs;
                    break;
                case "wns":
                    payload = PayloadSettings.Default.FollowWindows;
                    break;
                default:
                    break;
            }
            return payload;
        }

        private static string GetTemplate(NotifType type, string platform, params string[] param)
        {
            string template = string.Empty;
            switch (type)
            {
                case NotifType.AddFriend:
                    template = string.Format(GetPayloadAddFriends(platform), param.GetValue(0));
                    break;
                case NotifType.Talk:
                    template = string.Format(GetPayloadTalk(platform), param.GetValue(0), param.GetValue(1), param.GetValue(2));
                    break;
                case NotifType.Follow:
                    template = string.Format(GetPayloadFollow(platform), param.GetValue(0));
                    break;
                default:
                    break;
            }
            return template;
        }

    }
}
