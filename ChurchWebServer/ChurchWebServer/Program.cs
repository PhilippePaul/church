using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Net;

namespace ChurchWebServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var stopServer = false;
            Task.Run(() =>
            {
                using (var httpListener = new HttpListener())
                {
                    httpListener.Prefixes.Add("http://localhost:8080/PortailEBETM");
                    httpListener.Start();
                    while (!stopServer)
                    {
                        httpListener.AuthenticationSchemes = AuthenticationSchemes.Basic;
                        var context = httpListener.GetContext();
                        Task.Run(() => HandleConnection(context));
                    }
                }
            });

            Console.ReadKey();
            stopServer = true;
        }

        private static void HandleConnection(HttpListenerContext context)
        {

        }
    }
}
