using System;

namespace Vocal.Model.DB
{
    public class UserListen
    {
        public People Recipient { get; set; }
        public DateTime? ListenDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
