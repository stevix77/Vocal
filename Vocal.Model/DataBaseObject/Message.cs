using System;
using System.Collections.Generic;

namespace Vocal.Model.DataBaseObject
{
    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public MessageType ContentType { get; set; }
        public DateTime SentTime { get; set; }
        public DateTime ArrivedTime { get; set; }
        public User User { get; set; }
        public List<UserListen> Users { get; set; }

        public Guid MessageParent { get; set; }
        /////time
        public short Year { get; set; }
        public byte Month { get; set; }
        public byte Date { get; set; }
        public byte Hour { get; set; }
        public byte Minute { get; set; }
        /////Environment
        //public TypeDevice TypeDeviceSendWith { get; set; }
    }
}
