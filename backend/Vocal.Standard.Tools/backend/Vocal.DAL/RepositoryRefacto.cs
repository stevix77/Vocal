using MongoDB.Driver;
using Vocal.Model.DataBaseObject;
using System.Collections.Generic;
using System.Linq;

namespace Vocal.DAL
{
    public sealed partial class Repository
    {
        #region Talk

        /// <summary>
        /// Donne la conversation avec un user ou un groupe 
        /// ex: la liste des messages avec Kris
        /// </summary>
        public List<Talk> GetTalkRefacto(string userId, string recipientId)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            return user.Talks.Where(x => x.IdContact == recipientId).ToList();
        }

        /// <summary>
        /// Donne la liste des conversations de l'user
        /// j'avoue pas du tout optimisé
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<Talk> GetListTalkRefacto(string userId)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            return user.Talks.GroupBy(x => x.IdContact, (key, g) => g.OrderBy(d => d.date).First()).ToList();
        }

       
        #endregion
    }
}
