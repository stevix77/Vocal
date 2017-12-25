using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Context;

namespace Vocal.Business.Business
{
    public class NotificationBusiness : BaseBusiness
    {
        public NotificationBusiness(DbContext dbContext, HubContext hubContext) : base(dbContext)
        {
            _notificationHub = NotificationHub.Init(hubContext);
        }

        internal NotificationBusiness(Repository repository, NotificationHub notificationHub) : base(repository)
        {
            _notificationHub = notificationHub;
        }

        public async Task<Response<string>> GetRegistrationId(string channel, string userId, string platform, string lang)
        {
            var response = new Response<string>();
            LogManager.LogDebug(channel, userId, platform, lang);
            try
            {
                var user = _repository.GetUserById(userId);
                if(user != null)
                {
                    if(true)
                    //if (!user.Devices.Exists(x => x.Channel == channel))
                    {
                        var registrationId = await _notificationHub.GetRegistrationId(channel);
                        var tag = $"{Properties.Settings.Default.TagUser}:{userId}";
                        user.Devices.Add(new Vocal.Model.DB.Device
                        {
                            RegistrationId = registrationId,
                            Platform = platform,
                            Channel = channel,
                            Tags = new List<string>() { tag },
                            Lang = lang
                        });
                        _repository.UpdateUser(user);
                        await _notificationHub.RegistrationUser(registrationId, channel, platform, tag);
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

        public async Task<Response<bool>> SendNotification(List<string> ids, int type, params string[] param)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(ids, type, param);
                var users = _repository.GetUsersById(ids);
                foreach (var item in users.Where(x => x.Settings.IsNotifiable))
                {
                    var tag = $"{Properties.Settings.Default.TagUser}:{item.Id}";
                    foreach (var d in item.Devices.Select(x => new {  x.Platform, x.Lang }).Distinct())
                    {
                        var payload = GetTemplate(type, d.Platform, d.Lang, param);
                        LogManager.LogDebug(string.Format("Payload {0}", payload));
                        var rep = await _notificationHub.SendNotification(d.Platform, tag, payload);
                        LogManager.LogDebug(JsonConvert.SerializeObject(rep));
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

        private string GetPayloadTalk(string platform)
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
            LogManager.LogDebug($"platform {platform} - payload {payload}");
            return payload;
        }

        private string GetPayloadAddFriends(string platform)
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
            LogManager.LogDebug($"platform {platform} - payload {payload}");
            return payload;
        }

        private string GetPayloadFollow(string platform)
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

        private string GetTemplate(int type, string platform, string lang, params string[] param)
        {
            string template = string.Empty;
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            string str = string.Empty;
            switch (type)
            {
                case (int)NotifType.AddFriend:
                    LogManager.LogDebug("0: {0} - 1: {1}", param.GetValue(0), param.GetValue(1));
                    str = GetPayloadAddFriends(platform);
                    template = string.Format(str, $"{param.GetValue(0).ToString()} {Resources_Language.TextNotifAddFriend}", param.GetValue(1).ToString(), type);
                    break;
                case (int)NotifType.Talk:
                    LogManager.LogDebug("0: {0} 1: {1} 2: {2}", param.GetValue(0), param.GetValue(1), param.GetValue(2));
                    str = GetPayloadTalk(platform);
                    var title = $"{param.GetValue(2)} @ {param.GetValue(1)}";
                    var mess = !string.IsNullOrEmpty(param.GetValue(3).ToString()) ? param.GetValue(3).ToString().Length > 20 ? param.GetValue(3).ToString().Substring(0, 20) : param.GetValue(3).ToString() : string.Empty;
                    template = string.Format(str, mess, title, param.GetValue(0).ToString(), type);
                    break;
                case (int)NotifType.Follow:
                    template = string.Format(GetPayloadFollow(platform), param.GetValue(0));
                    break;
                default:
                    break;
            }
            LogManager.LogDebug(string.Format("platform - {0} - template {1}", platform, template));
            return template;
        }

    }
}
