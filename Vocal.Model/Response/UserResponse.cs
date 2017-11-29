
using System.Collections.Generic;

namespace Vocal.Model.Response
{
    public class UserResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public List<PictureResponse> Pictures { get; set; } = new List<PictureResponse>();
    }
}
