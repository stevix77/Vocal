using System;

namespace Vocal.Model.DB
{
    public class ResetPassword
    {
        public string Token { get; set; }
        public DateTime ValidityDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
