using System;
using System.Collections.Generic;

namespace Vocal.Model.Request
{
    public class SendMessageRequest : Request
    {
        public string IdTalk { get; set; }
        public string Content { get; set; }
        public DateTime SentTime { get; set; }
        public int MessageType { get; set; } 
        public string IdSender { get; set; }
        public List<string> IdsRecipient { get; set; }
        public string IdMessageParent { get; set; }
    }
}
