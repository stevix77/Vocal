using System;

namespace Vocal.Model.DBO
{
    public class UserListen
    {
        public People Recipient { get; set; }
        public DateTime? ListenDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
