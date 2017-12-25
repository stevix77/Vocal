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
using Vocal.Model.Context;
using Vocal.Model.DB;
using Vocal.Model.Helpers;
using Vocal.Model.Request;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public class TalkBusiness : BaseBusiness
    {
        readonly NotificationBusiness _notificationBusiness;

        public TalkBusiness(DbContext context, HubContext hubContext) : base(context, hubContext)
        {
            _notificationBusiness = new NotificationBusiness(_repository, _notificationHub);
        }

        internal TalkBusiness(Repository repository, NotificationHub notificationHub) : base(repository, notificationHub)
        {
            _notificationBusiness = new NotificationBusiness(_repository, _notificationHub);
        }

        public Response<List<TalkResponse>> GetTalks(string userId, string lang)
        {
            var response = new Response<List<TalkResponse>>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, lang);
            try
            {
                var list = _repository.GetListTalk(userId);
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

        public Response<string> GetMessageById(string messageId, string userId, string lang)
        {
            var response = new Response<string>();
            try
            {
                LogManager.LogDebug(messageId, userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var mess = _repository.GetMessageById(messageId, userId);
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

        public Response<List<MessageResponse>> GetMessages(string talkId, DateTime? lastMessage, string userId, string lang)
        {
            var response = new Response<List<MessageResponse>>();
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                LogManager.LogDebug(talkId, lastMessage, userId, lang);
                var messages = _repository.GetMessages(talkId, lastMessage, userId);
                if (messages == null)
                    throw new CustomException(Resources_Language.TalkNotExisting);
                response.Data = Bind.Bind_Messages(messages);

                if(messages.Count > 0) Task.Run(async () => await UpdateListenUser(userId, talkId, messages));
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

        public async Task UpdateListenUser(string userId, string talkId, List<Message> messages)
        {
            _repository.SetIsRead(userId, talkId, messages);
            await HubService.Instance.UpdateTalk(talkId, Bind.Bind_Messages(messages));
        }
        public Response<bool> IsSendable(string userId, List<string> users, string lang)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(userId, users, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var recipients = _repository.GetUsersById(users);
                response.Data = recipients.TrueForAll(x => !x.Settings.Blocked.Exists(y => y.Id == userId) && (x.Settings.Contact == Contacted.Everybody || (x.Settings.Contact == Contacted.Friends && x.Friends.Exists(y => y.Id == userId))));
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

        public Response<SendMessageResponse> SendMessage(SendMessageRequest request)
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
                if (string.IsNullOrEmpty(request.IdTalk))
                {
                    request.IdsRecipient.Add(request.IdSender);
                    var talk = _repository.GetTalk(request.IdsRecipient);
                    if(talk == null) // aucun message entre ces idsRecipient
                    {
                        if (_repository.CheckIfAllUsersExist(request.IdsRecipient)) // vérifier si les ids existent en base
                            CreateNewTalk(request, response);
                        else
                            throw new Exception("AllUsers not exist");
                    }
                    else
                        AddMessageToTalk(request, response, talk);
                }
                else
                {
                    var talk = _repository.GetTalkById(request.IdTalk);
                    AddMessageToTalk(request, response, talk);
                }
                if (response.Data.IsSent)
                    SendNotif(response.Data, request.IdSender);
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

        private void CreateNewTalk(SendMessageRequest request, Response<SendMessageResponse> response)
        {
            var allUsers = _repository.GetUsersById(request.IdsRecipient);
            var sender = allUsers.SingleOrDefault(x => x.Id == request.IdSender);
            var dt = DateTime.Now;
            var talk = new Talk
            {
                Id = Guid.NewGuid().ToString(),
                Recipients = allUsers.Select(x => x.Id).ToList(),
                Duration = (MessageType)request.MessageType == MessageType.Vocal && request.Duration.HasValue && request.Duration.Value > 0 ? request.Duration.Value : 0,
                LastMessage = dt,
                Users = allUsers.Select(x => x.ToPeople()).ToList()
            };
            talk.Recipients.ForEach(x => { talk.ListArchive.Add(x, false); talk.ListDelete.Add(x, false); });
            allUsers.ForEach(x => talk.ListPictures.Add(x.Id, x.Pictures.SingleOrDefault(y => y.Type == PictureType.Talk)?.Value));
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = dt,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
                Users = allUsers.Where(x => x.Id != sender.Id).Select(x => new UserListen() { Recipient = x.ToPeople()/*, ListenDate = x == user.Id ? DateTime.Now : new DateTime?()*/ }).ToList(),
                Duration = (MessageType)request.MessageType == MessageType.Vocal ? talk.Duration : 0,
                TalkId = talk.Id
            };
            _repository.AddTalk(talk);
            _repository.AddMessage(m);
            response.Data.Talk = Bind.Bind_Talks(talk, m, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
        }

        private void AddMessageToTalk(SendMessageRequest request, Response<SendMessageResponse> response, Talk talk)
        {
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = DateTime.Now,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = talk.Users.SingleOrDefault(x => x.Id == request.IdSender),
                Users = talk.Users.Select(x => new UserListen { Recipient = x }).ToList(),
                Duration = (MessageType)request.MessageType == MessageType.Vocal && request.Duration.HasValue && request.Duration.Value >= 0 ? request.Duration.Value : new int?(), 
                TalkId = talk.Id
            };
            talk.Duration += m.ContentType == MessageType.Vocal && m.Duration.HasValue ? m.Duration.Value : 0;
            talk.LastMessage = m.ArrivedTime;
            _repository.UpdateTalk(talk);
            _repository.AddMessage(m);
            response.Data.Talk = Bind.Bind_Talks(talk, m, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
        }
        public Response<ActionResponse> ArchiveTalk(UpdateTalkRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => _repository.ArchiveTalk(request.IdTalk, request.IdSender));
        }

        public Response<ActionResponse> UnarchiveTalk(UpdateTalkRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => _repository.UnArchiveTalk(request.IdTalk, request.IdSender));
        }

        public Response<ActionResponse> DeleteTalk(UpdateTalkRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => _repository.DeleteTalk(request.IdTalk, request.IdSender));
        }

        public Response<ActionResponse> DeleteMessage(DeleteMessageRequest request)
        {
            LogManager.LogDebug(request);
            return ActionOnTalk(request, () => _repository.DeleteMessage(request.IdMessages, request.IdSender));
        }

        private Response<ActionResponse> ActionOnTalk(Request request, Func<bool> action)
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
        
        private void SendNotif(SendMessageResponse response, string senderId)
        {
            Task.Run(async () => {
                var users = response.Talk.Users.Where(x => x.Id != senderId);
                await HubService.Instance.SendMessage(response, response.Talk.Users.Select(x => x.Id).ToList()); // envoi message via signalr
                //var titleNotif = GenerateTitleNotif(response.Message, );
                var messNotif = GenerateMessageNotif(response.Message);
                var vocalName = string.Join(",", users.Select(x => x.Username)); 

                await _notificationBusiness.SendNotification(users.Select(x => x.Id).ToList(), (int)NotifType.Talk, response.Talk.Id, vocalName, response.Message.User.Username, response.Message.ContentType == (int)MessageType.Text ? response.Message.Content : string.Empty);
            });
        }

        private static string GenerateTitleNotif(MessageResponse m, string vocalName)
        {
           return (m.ContentType == (int)MessageType.Vocal) ?
                 $"{m.User.Username} @{vocalName} a envoyé un vocal" :
                 $"{m.User.Username} @{vocalName} a envoyé un message texte";
        }

        private static string GenerateMessageNotif(MessageResponse m)
        {
            return (m.ContentType == (int)MessageType.Text) ?
                 m.Content.Length > 20
                    ? m.Content.Substring(0, 20)
                    : m.Content
                : string.Empty;
        }
    }
}
