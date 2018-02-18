using System;

namespace ChurchWebServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var httpServer = new HttpServer(@"C:\Users\Phil\Source\Repos\church\ChurchWebServer");

            Console.ReadKey();
        }
    }
}
