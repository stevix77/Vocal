using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Business.Binder;
using Vocal.Business.Properties;
using Vocal.Business.Signalr;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Model.Helpers;
using Vocal.Model.Request;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class TalkBusiness
    {
        public static Response<List<TalkResponse>> GetTalks(string userId, string lang)
        {
            var response = new Response<List<TalkResponse>>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, lang);
            try
            {
                var list = Repository.Instance.GetListTalk(userId);
                if (list == null)
                    throw new CustomException(Resources_Language.UserNotExisting);
                response.Data = Bind.Bind_Talks(list, userId);
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

        public static Response<List<MessageResponse>> GetMessages(string talkId, string userId, string lang)
        {
            var response = new Response<List<MessageResponse>>();
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                LogManager.LogDebug(talkId, userId, lang);
                var messages = Repository.Instance.GetMessages(talkId, userId);
                response.Data = Bind.Bind_Messages(messages);

                if(messages.Count > 0) Task.Run(() => UpdateListenUser(userId, talkId, messages));
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

        public static void UpdateListenUser(string userId, string talkId, List<Message> messages)
        {
            Repository.Instance.SetIsRead(userId, talkId, messages);
            HubService.Instance.UpdateTalk(talkId, Bind.Bind_Messages(messages));
        }

        public static Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            var response = new Response<SendMessageResponse> { Data = new SendMessageResponse { IsSent = false } };
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
                if (request != null)
                {
                    LogManager.LogDebug(request);
                    if (Repository.Instance.CheckIfAllUsersExist(request.IdsRecipient))
                    {
                        if((MessageType)request.MessageType == MessageType.Vocal)
                        {
                            var bs64 = request.Content.Split(',').LastOrDefault();
                            var file = Converter.ConvertToWav(bs64);
                            if (file == null)
                                throw new Exception();
                            request.Content = "data:audio/wav;base64," + Convert.ToBase64String(file);
                        }
                     
                        if (string.IsNullOrEmpty(request.IdTalk))
                        {
                            //create an talk for each user and add the new message into
                            CreateNewTalk(request, response);
                        }
                        else
                        {
                            //retrieve all talks of the users in add the new message into
                            AddMessageToTalk(request, response);
                        }
                    }
                    else
                    {
                        LogManager.LogError(new Exception("Weird. Some friend of this dude don't exist "));
                        response.ErrorMessage = Resources_Language.TechnicalError;
                    }
                }
                else
                {
                    LogManager.LogError(new Exception("No Data"));
                    response.ErrorMessage = Resources_Language.NoDataMessage;
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


        private static void CreateNewTalk(SendMessageRequest request, Response<SendMessageResponse> response)
        {
            var sender = Repository.Instance.GetUserById(request.IdSender);
            var allUsers = Repository.Instance.GetUsersById(request.IdsRecipient);
            allUsers.Add(sender);
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = DateTime.Now,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
                Users = allUsers.Select(x => new UserListen() { Recipient = x.ToPeople()/*, ListenDate = x == user.Id ? DateTime.Now : new DateTime?()*/ }).ToList()
            };
            var talk = new Talk() { Id = Guid.NewGuid().ToString() };
            talk.Messages.Add(m);
            talk.DateLastMessage = m.ArrivedTime;

            Repository.Instance.AddTalk(talk, allUsers.Select(x => x.Id).ToList());

            response.Data.Talk = Bind.Bind_Talk(talk, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
        }

        private static void AddMessageToTalk(SendMessageRequest request, Response<SendMessageResponse> response)
        {
            var sender = Repository.Instance.GetUserById(request.IdSender);
            var allUsers = Repository.Instance.GetUsersById(request.IdsRecipient);
            allUsers.Add(sender);
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = DateTime.Now,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
               Users = allUsers.Select(x => new UserListen() { Recipient = x.ToPeople()/*, ListenDate = x == user.Id ? DateTime.Now : new DateTime?()*/ }).ToList()
            };

            var talk = Repository.Instance.AddMessageToTalk(request.IdTalk, allUsers.Select(x => x.Id).ToList(), m);
            response.Data.Talk = Bind.Bind_Talk(talk, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
        }

        private static string GenerateTitleNotif(Message m, string vocalName)
        {
           return (m.ContentType == MessageType.Vocal) ?
                 $"{m.Sender.Username} @{vocalName} a envoyé un vocal" :
                 $"{m.Sender.Username} @{vocalName} a envoyé un message texte";
        }

        private static string GenerateMessageNotif(Message m)
        {
            return (m.ContentType == MessageType.Text) ?
                 m.Content.Length > 20
                    ? m.Content.Substring(0, 20)
                    : m.Content
                : string.Empty;
        }

        //private static async Task RegisterNotificationToTalk(List<User> allUser, string talkId)
        //{
        //    foreach(var item in allUser)
        //    {
        //        foreach(var device in item.Devices)
        //        {
        //            await NotificationHub.Instance.RegistrationUser(device.RegistrationId, device.Channel, device.Platform, string.Format(Properties.Settings.Default.TagTalk, talkId))
        //        }
        //    }
        //}
    }
}
