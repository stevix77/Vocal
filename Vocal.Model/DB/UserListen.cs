using System;

namespace Vocal.Model.DB
{
    public class UserListen
    {
        public People Recipient { get; set; }
        public DateTime? ListenDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; }
        public bool IsReceivedMessage { get; set; }
    }
}
