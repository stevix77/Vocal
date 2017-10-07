using System.Collections.Generic;

namespace Vocal.Model.DataBaseObject
{
    public class Group : IRecipient
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<User> Users {get; set; }

        public bool IsGroup { get => true; }
    }
}
