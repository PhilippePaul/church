using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Net;
using System.IO;

namespace ChurchWebServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var stopServer = false;

            var httpServer = new HttpServer(@"C:\Users\Phil\Source\Repos\church");

            Console.ReadKey();
            stopServer = true;
        }
    }
}
