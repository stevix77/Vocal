using System;
using System.Collections.Generic;
using System.Text;

namespace Vocal.Model.DBO
{
    public class Talk
    {
        public string Id { get; set; }
        public List<People> Recipients { get; set; } = new List<People>();
        public List<Message> Messages { get; set; } = new List<Message>();


        public DateTime DateLastMessage { get; set; }
        public string Name { get; set; } = null;
        public bool IsArchived { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsReceivedMessage { get; set; }

    }
}
