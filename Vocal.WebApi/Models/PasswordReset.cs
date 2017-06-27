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
        [Required(ErrorMessageResourceName = "PasswordRequired", ErrorMessageResourceType = typeof(Business.Properties.Resources_Language))]
        [RegularExpression("^.{8,}", ErrorMessageResourceName = "PasswordRegex", ErrorMessageResourceType = typeof(Business.Properties.Resources_Language))]
        public string Password { get; set; }
    }
}
