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

        public static Response<string> GetMessageById(string messageId, string userId, string lang)
        {
            var response = new Response<string>();
            try
            {
                LogManager.LogDebug(messageId, userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var mess = Repository.Instance.GetMessageById(messageId, userId);
                if (mess != null)
                    response.Data = mess.Content;
                else
                    throw new CustomException(Resources_Language.TalkNotExisting);
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

        public static Response<List<MessageResponse>> GetMessages(string talkId, DateTime? lastMessage, string userId, string lang)
        {
            var response = new Response<List<MessageResponse>>();
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                LogManager.LogDebug(talkId, lastMessage, userId, lang);
                var messages = Repository.Instance.GetMessages(talkId, lastMessage, userId);
                if (messages == null)
                    throw new CustomException(Resources_Language.TalkNotExisting);
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

        //public static Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        //{
        //    var response = new Response<SendMessageResponse> { Data = new SendMessageResponse { IsSent = false } };
        //    try
        //    {
        //        Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
        //        if (request != null)
        //        {
        //            LogManager.LogDebug(request);
        //            if (/*Repository.Instance.CheckIfAllUsersExist(request.IdsRecipient)*/ true)
        //            {
        //                if((MessageType)request.MessageType == MessageType.Vocal)
        //                {
        //                    var bs64 = request.Content.Split(',').LastOrDefault();
        //                    var file = Converter.ConvertToWav(bs64);
        //                    if (file == null)
        //                        throw new Exception();
        //                    request.Content = "data:audio/wav;base64," + Convert.ToBase64String(file);
        //                }

        //                if (string.IsNullOrEmpty(request.IdTalk))
        //                {
        //                    //create an talk for each user and add the new message into
        //                    CreateNewTalk(request, response);
        //                }
        //                else
        //                {
        //                    //retrieve all talks of the users in add the new message into
        //                    AddMessageToTalk(request, response);
        //                }
        //            }
        //            else
        //            {
        //                LogManager.LogError(new Exception("Weird. Some friend of this dude don't exist "));
        //                response.ErrorMessage = Resources_Language.TechnicalError;
        //            }
        //        }
        //        else
        //        {
        //            LogManager.LogError(new Exception("No Data"));
        //            response.ErrorMessage = Resources_Language.NoDataMessage;
        //        }
        //    }
        //    catch (TimeoutException tex)
        //    {
        //        LogManager.LogError(tex);
        //        response.ErrorMessage = Resources_Language.TimeoutError;
        //    }
        //    catch (CustomException cex)
        //    {
        //        LogManager.LogError(cex);
        //        response.ErrorMessage = cex.Message;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogManager.LogError(ex);
        //        response.ErrorMessage = Resources_Language.TechnicalError;
        //    }
        //    return response;
        //}


        public static Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            var response = new Response<SendMessageResponse> { Data = new SendMessageResponse { IsSent = false } };
            try
            {
                LogManager.LogDebug(request);
                Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
                if ((MessageType)request.MessageType == MessageType.Vocal)  // si mess vocal alors convertir
                {
                    var bs64 = request.Content.Split(',').LastOrDefault();
                    var file = Converter.ConvertToWav(bs64);
                    if (file == null)
                        throw new Exception();
                    request.Content = "data:audio/wav;base64," + Convert.ToBase64String(file);
                }
                request.IdsRecipient.Add(request.IdSender);
                if (string.IsNullOrEmpty(request.IdTalk))
                {
                    var talk = Repository.Instance.GetTalk(request.IdsRecipient);
                    if(talk == null) // aucun message entre ces idsRecipient
                    {
                        if (Repository.Instance.CheckIfAllUsersExist(request.IdsRecipient)) // vérifier si les ids existent en base
                            CreateNewTalk(request, response);
                        else
                            throw new Exception("AllUsers not exist");
                    }
                    else
                        AddMessageToTalk(request, response, talk);
                    
                }
                else
                {
                    var talk = Repository.Instance.GetTalk(request.IdsRecipient);
                    AddMessageToTalk(request, response, talk);
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
            var allUsers = Repository.Instance.GetUsersById(request.IdsRecipient);
            var sender = allUsers.SingleOrDefault(x => x.Id == request.IdSender);
            var dt = DateTime.Now;
            var talk = new Talk
            {
                Id = Guid.NewGuid().ToString(),
                Recipients = allUsers.Select(x => x.Id).ToList(),
                Duration = (MessageType)request.MessageType == MessageType.Vocal ? request.Duration.Value : 0,
                LastMessage = dt,
                Users = allUsers.Select(x => x.ToPeople()).ToList()
            };
            talk.Recipients.ForEach(x => { talk.ListArchive.Add(x, false); talk.ListDelete.Add(x, false); });
            allUsers.ForEach(x => talk.ListPictures.Add(x.Id, x.Pictures.SingleOrDefault(y => y.Type == PictureType.Talk).Value));
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = dt,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
                Users = allUsers.Where(x => x.Id != sender.Id).Select(x => new UserListen() { Recipient = x.ToPeople()/*, ListenDate = x == user.Id ? DateTime.Now : new DateTime?()*/ }).ToList(),
                Duration = request.Duration,
                TalkId = talk.Id
            };
            Repository.Instance.AddTalk(talk);
            Repository.Instance.AddMessage(m);
            response.Data.Talk = Bind.Bind_Talks(talk, m, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
            Task.Run(async () => {
                await HubService.Instance.SendMessage(response.Data, request.IdsRecipient); // envoi message via signalr
                var users = allUsers.Where(x => x.Id != request.IdSender);
                var titleNotif = GenerateTitleNotif(m, string.Join(",", users.Select(x => x.Username)));
                var messNotif = GenerateMessageNotif(m);
                await NotificationBusiness.SendNotification(users.Select(x => x.Id).ToList(), NotifType.Talk, messNotif, titleNotif, talk.Id);
            });
        }

        private static void AddMessageToTalk(SendMessageRequest request, Response<SendMessageResponse> response, Talk talk)
        {
            var allUsers = Repository.Instance.GetUsersById(request.IdsRecipient);
            var sender = allUsers.SingleOrDefault(x => x.Id == request.IdSender);
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = DateTime.Now,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
                Users = allUsers.Select(x => new UserListen { Recipient = x.ToPeople() }).ToList(),
                Duration = request.Duration, 
                TalkId = talk.Id
            };
            talk.Duration += m.ContentType == MessageType.Vocal ? m.Duration.GetValueOrDefault(0) : 0;
            talk.LastMessage = m.ArrivedTime;
            Repository.Instance.UpdateTalk(talk);
            Repository.Instance.AddMessage(m);
            response.Data.Talk = Bind.Bind_Talks(talk, m, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
            Task.Run(async () => {
                await HubService.Instance.SendMessage(response.Data, request.IdsRecipient); // envoi message via signalr
                var users = allUsers.Where(x => x.Id != request.IdSender);
                var titleNotif = GenerateTitleNotif(m, string.Join(",", users.Select(x => x.Username)));
                var messNotif = GenerateMessageNotif(m);
                await NotificationBusiness.SendNotification(users.Select(x => x.Id).ToList(), NotifType.Talk, messNotif, titleNotif, talk.Id);
            });
        }




        public static Response<ActionResponse> ArchiveTalk(UpdateTalkRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => Repository.Instance.ArchiveTalk(request.IdTalk, request.IdSender));
        }

        public static Response<ActionResponse> UnarchiveTalk(UpdateTalkRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => Repository.Instance.UnArchiveTalk(request.IdTalk, request.IdSender));
        }

        public static Response<ActionResponse> DeleteTalk(UpdateTalkRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => Repository.Instance.DeleteTalk(request.IdTalk, request.IdSender));
        }

        public static Response<ActionResponse> DeleteMessage(DeleteMessageRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => Repository.Instance.DeleteMessage(request.IdMessages, request.IdSender));
        }

        private static Response<ActionResponse> ActionOnTalk(Request request, Func<bool> action)
        {
            var response = new Response<ActionResponse> { Data = new ActionResponse { IsDone = false } };
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
                if (request != null)
                {
                    if (action())
                    {
                        response.Data.IsDone = true;
                        return response;
                    }
                    else
                    {
                        LogManager.LogError(new Exception("The talk was null. May be, the id talk doesn't exist or the user doesn't have the right on it"));
                        response.ErrorMessage = Resources_Language.TechnicalError;
                    }

                }
                else
                {
                    LogManager.LogError(new Exception("No Data"));
                    response.ErrorMessage = Resources_Language.NoDataMessage;
                }
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
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
