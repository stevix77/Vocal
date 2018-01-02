namespace Vocal.Model.Request
{
    using System;
    using System.Collections.Generic;

    public class DeleteMessageRequest : Request
    {
        public string IdTalk { get; set; }
        public List<string> IdMessages { get; set; }
        public DateTime SentTime { get; set; }
        public string IdSender { get; set; }
    }
}
