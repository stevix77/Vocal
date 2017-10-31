using System;
using System.Collections.Generic;

namespace Vocal.Model.Response
{
    public class TalkResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<UserResponse> Users { get; set; } = new List<UserResponse>();
        public DateTime DateLastMessage { get; set; }
        public bool HasNewMessage { get; set; }
    }
}
