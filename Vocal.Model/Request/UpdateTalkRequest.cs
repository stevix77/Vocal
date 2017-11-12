namespace Vocal.Model.Request
{
    using System;

    public class UpdateTalkRequest : Request
    {
        public string IdTalk { get; set; }
        public DateTime SentTime { get; set; }
        public string IdSender { get; set; }
    }
}
