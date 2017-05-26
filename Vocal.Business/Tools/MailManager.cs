using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;

namespace Vocal.Business.Tools
{
    /// <summary>
    /// Classe qui permet la gestion de l'envoi d'emails
    /// </summary>
    public static class MailManager
    {
        /// <summary>
        /// Envoi d'un email
        /// </summary>
        /// <param name="email">Adresse email du destinataire</param>
        /// <param name="text">Corps du message</param>
        /// <param name="lang">Langue</param>
        /// <returns></returns>
        public static async Task Send(string email, string text, string lang)
        {
            SmtpClient client = new SmtpClient(Settings.Default.MailHost, Settings.Default.MailPort);
            MailMessage mail = new MailMessage();
            mail.Subject = Resource.GetValue(lang, Resource.AskPasswordSubject);
            mail.To.Add(email);
            mail.From = new MailAddress(Settings.Default.MailFrom);
            await client.SendMailAsync(mail);
        }
    }
}
