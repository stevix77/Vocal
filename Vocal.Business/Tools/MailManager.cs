using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        public static void Send(string email, string text, string lang)
        {
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            SmtpClient client = new SmtpClient(Settings.Default.MailHost, Settings.Default.MailPort);
            client.Credentials = new NetworkCredential(Settings.Default.MailUsername, Settings.Default.MailPassword);
            client.EnableSsl = true;
            MailMessage mail = new MailMessage();
            mail.Subject = Resources_Language.AskPasswordSubject;
            mail.To.Add(email);
            mail.From = new MailAddress(Settings.Default.MailFrom);
            mail.Body = text;
            client.Send(mail);
        }
    }
}
