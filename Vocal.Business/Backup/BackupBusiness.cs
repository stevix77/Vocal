using MongoDB.Bson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.DAL;

namespace Vocal.Business.Backup
{
    public class BackupBusiness
    {
        public static void ExportCollections()
        {
            try
            {
                while(true)
                {
                    var collections = Repository.Instance.GetAllCollections();
                    foreach (var item in collections)
                    {
                        var name = item.GetElement("name").Value.ToString();
                        var docs = Repository.Instance.GetDocuments(name);
                        if (docs.Count > 0)
                        {
                            var json = JsonConvert.SerializeObject(docs);
                            if (!Directory.Exists($"{Settings.Default.BackupPath}/export"))
                                Directory.CreateDirectory($"{Settings.Default.BackupPath}/export");
                            File.WriteAllText($"{Settings.Default.BackupPath}/export/{name}.json", json);
                        }
                    }
                    Thread.Sleep(1000 * 3600 * 6);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
