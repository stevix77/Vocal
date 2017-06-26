using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Vocal.WebApi.Models
{
    public class PasswordReset
    {
        [Required(ErrorMessageResourceName = "PasswordRequired")]
        [RegularExpression("{8,}", ErrorMessageResourceName = "PasswordRegex")]
        public string Password { get; set; }
        [Required(ErrorMessageResourceName = "PasswordRequired")]
        public string Username { get; set; }
        [Required(ErrorMessageResourceName = "PasswordRequired")]
        public string Token { get; set; }
    }
}
