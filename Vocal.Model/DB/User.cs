using System;
using System.Collections.Generic;

namespace Vocal.Model.DB
{
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Picture { get; set; }
        public string Token { get; set; }
        public bool IsActive { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime BirthdayDate { get; set; }
        public List<Friend> Friends { get; set; } = new List<Friend>();
        public ResetPassword Reset { get; set; }
        public List<string> Signs { get; set; } = new List<string>();
    }
}
