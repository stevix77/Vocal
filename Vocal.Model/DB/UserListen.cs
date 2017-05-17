using System;
using System.Collections.Generic;
using System.Text;

namespace Vocal.Model.DB
{
    public class UserListen
    {
        public string UserId { get; set; }
        public DateTime? ListenDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
