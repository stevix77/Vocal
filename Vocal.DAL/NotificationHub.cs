using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.NotificationHubs;
using Vocal.Model.DB;
using Vocal.DAL.Properties;

namespace Vocal.DAL
{
    public class NotificationHub
    {
        public static NotificationHub Instance = new NotificationHub();

        private NotificationHubClient Hub { get; set; }

        private NotificationHub()
        {
            Hub = NotificationHubClient.CreateClientFromConnectionString(Settings.Default.DefaultFullSharedAccessSignature,
                                                                         "<hub name>");
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

        public async Task RegistrationUser(string channel, string platform, string tag)
        {
            var description = GetRegistrationDescriptionByPlatform(platform, channel);
            description.Tags.Add(tag);
            await Hub.CreateOrUpdateRegistrationAsync(description);
        }

        public async Task SendNotification(List<Device> devices, string tag, string text)
        {
            foreach(var item in devices)
            {
                string mess = GenerateTextNotif(item.Platform, text);
                var notif = GenerateNotif(item.Platform, mess);
                await Hub.SendNotificationAsync(notif, tag);
            }
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
                    notification = new WindowsNotification(mess);
                    break;
                case "wns":
                    notification = new MpnsNotification(mess);
                    break;
                default:
                    notification = null;
                    break;
            }
            return notification;
        }

        private string GenerateTextNotif(string platform, string text)
        {
            string textNotif = string.Empty;
            switch (platform)
            {
                case "gcm":
                    textNotif = string.Format("{\"data\" : {\"msg\" : \"{0}\" }}", text);
                    break;
                case "apns":
                    textNotif = string.Format("{\"aps\" : {\"alert\" : \"{0}\" }}", text);
                    break;
                case "mpns":
                    textNotif = string.Format("<toast><visual><binding template = \"ToastText01\"><text id=\"1\">{0}</text></binding></visual></toast>", text);
                    break;
                case "wns":
                    textNotif = "<?xml version=\"1.0\" encoding=\"utf-8\"?><wp:Notification xmlns:wp=\"WPNotification\"><wp:Toast><wp:Text1>" + text + "</wp:Text1></wp:Toast></wp:Notification>";
                    break;
                default:
                    textNotif = null;
                    break;
            }
            return textNotif;
        }
    }
}
