using Microsoft.Azure.NotificationHubs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vocal.Model.Context;

namespace Vocal.DAL
{
    public class NotificationHub
    {
        static HubContext _config;
        static NotificationHub _instance;

        NotificationHubClient Hub { get; set; }

        NotificationHub()
        {
            Hub = NotificationHubClient.CreateClientFromConnectionString(_config.DefaultFullSharedAccessSignature, _config.Hubname, true);
        }

        public static NotificationHub Init(HubContext config)
        {
            if (_instance != null)
            {
                return _instance;
            }
            _config = config;
            _instance = new NotificationHub();
            return _instance;
        }

        public async Task<string> GetRegistrationId(string channel)
        {
            string registrationId = string.Empty;
            if(!string.IsNullOrEmpty(channel))
            {
                await DeleteRegistrations(channel);
                registrationId = await Hub.CreateRegistrationIdAsync();
            }
            return registrationId;
        }
        
        public async Task<RegistrationDescription> GetRegistration(string registrationId)
        {
            return await Hub.GetRegistrationAsync<RegistrationDescription>(registrationId);
        }

        public async Task RegistrationUser(string registrationId, string channel, string platform, string tag)
        {
            var description = GetRegistrationDescriptionByPlatform(platform, channel);
            if (description.Tags == null)
                description.Tags = new HashSet<string>() { tag };
            else
                description.Tags.Add(tag);
            description.RegistrationId = registrationId;
            await Hub.CreateOrUpdateRegistrationAsync(description);
        }
        
        private async Task DeleteRegistrations(string channel)
        {
            var registrations = await Hub.GetRegistrationsByChannelAsync(channel, 100);
            foreach (var item in registrations)
                await Hub.DeleteRegistrationAsync(item);
        }

        private RegistrationDescription GetRegistrationDescriptionByPlatform(string platform, string channel)
        {
            RegistrationDescription registration = null;
            switch (platform)
            {
                case "gcm":
                    registration = new GcmRegistrationDescription(channel);
                    break;
                case "apns":
                    registration = new AppleRegistrationDescription(channel);
                    break;
                case "mpns":
                    registration = new MpnsRegistrationDescription(channel);
                    break;
                case "wns":
                    registration = new WindowsRegistrationDescription(channel);
                    break;
                default:
                    registration = null;
                    break;
            }
            return registration;
        }

        private Notification GenerateNotif(string platform, string mess)
        {
            Notification notification = null;
            switch (platform)
            {
                case "gcm":
                    notification = new GcmNotification(mess);
                    break;
                case "apns":
                    notification = new AppleNotification(mess);
                    break;
                case "mpns":
                    notification = new MpnsNotification(mess);
                    break;
                case "wns":
                    notification = new WindowsNotification(mess);
                    break;
                default:
                    notification = null;
                    break;
            }
            return notification;
        }

        public async Task<object> SendNotification(string platform, string tag, string payload)
        {
            var notif = GenerateNotif(platform, payload);
            var result = await Hub.SendNotificationAsync(notif, tag);
            return new { result.Failure, Notificationid = result.NotificationId, result.State, result.Success, result.Results };
        }
    }
}
