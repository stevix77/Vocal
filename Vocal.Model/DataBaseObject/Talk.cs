using System;

namespace Vocal.Model.DataBaseObject
{
    public class Talk
    {
        public Message Message { get; set; }
        public DateTime date { get; set; }
        public IRecipient Contact { get; set; }
        public string IdContact { get; set; }
        public bool IsArchived { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsReceivedMessage { get; set; }
    }
}
