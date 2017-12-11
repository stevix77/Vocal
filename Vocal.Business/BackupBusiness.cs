using MongoDB.Bson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.DAL;

namespace Vocal.Business
{
    public class BackupBusiness
    {
        public static void ExportCollections()
        {
            try
            {
                var collections = Repository.Instance.GetAllCollections();
                foreach (var item in collections)
                {
                    var name = item.GetElement("name").Value.ToString();
                    var docs = Repository.Instance.GetDocuments(name);
                    if (docs.Count > 0)
                    {
                        var json = JsonConvert.SerializeObject(docs);
                        if (!Directory.Exists("export"))
                            Directory.CreateDirectory("export");
                        File.WriteAllText($"export/{name}.json", json);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
