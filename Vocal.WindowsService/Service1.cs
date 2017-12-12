using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Backup;

namespace Vocal.WindowsService
{
    public partial class Service1 : ServiceBase
    {
        private System.Threading.Thread t;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                t = new System.Threading.Thread(BackupBusiness.ExportCollections);
                t.Start();
            }
            catch (Exception)
            {
                
            }
        }

        protected override void OnStop()
        {
            try
            {
                t.Abort();
            }
            catch (Exception)
            {
                
            }
        }
    }
}
