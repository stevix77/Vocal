using System;
using System.Collections.Generic;

namespace Vocal.Model.DB
{
    /// <summary>
    /// Represent the element message shared between users
    /// </summary>
    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public MessageType ContentType { get; set; }
        public DateTime SentTime { get; set; }
        public DateTime ArrivedTime { get; set; }
        public People Sender { get; set; }
        public List<UserListen> Users { get; set; } = new List<UserListen>();
        public int? Duration { get; set; }
        public string TalkId { get; set; }
        public Message Parent { get; set; }
    }
}