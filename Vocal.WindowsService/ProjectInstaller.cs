using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.Linq;
using System.Threading.Tasks;

namespace Vocal.WindowsService
{
    [RunInstaller(true)]
    public partial class ProjectInstaller : System.Configuration.Install.Installer
    {
        public ProjectInstaller()
        {
            InitializeComponent();
            serviceInstaller1.DisplayName = "Vocal Backup";
            serviceInstaller1.ServiceName = "VocalBackup";
        }

        public override void Install(IDictionary stateSaver)
        {
            serviceInstaller1.DisplayName = "Vocal Backup";
            serviceInstaller1.ServiceName = "VocalBackup";
            base.Install(stateSaver);
        }


    }
}
