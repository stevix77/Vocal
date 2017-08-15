
using System;

namespace Vocal.Model.Request
{
    public class SendMessageRequest : Request
    {
        public byte[] Content { get; set; }
        public DateTime SentTime { get; set; }
        public ulong IdTalk { get; set; }
       // public MessageType 

    }
}
