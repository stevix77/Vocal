
namespace Vocal.Model.DataBaseObject
{
    public class Talk
    {
        public Message Message { get; set; }
        public IRecipient Contact { get; set; }
        public bool IsArchived { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsReceivedMessage { get; set; }
    }
}
