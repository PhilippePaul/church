using System;
using System.IO;
using System.Net;
using System.Text;

namespace ChurchWebServer
{
    public static class Extensions
    {
        public static string ReadUTF8String(this byte[] bytes)
        {
            return Encoding.UTF8.GetString(bytes);
        }

        public static void Write(this HttpListenerResponse response, Exception ex)
        {
            var bytes = Encoding.UTF8.GetBytes(ex.Message);
            response.OutputStream.Write(bytes, 0, bytes.Length);
        }

        public static void Write(this HttpListenerResponse response, string str)
        {
            var bytes = Encoding.UTF8.GetBytes(str);
            response.OutputStream.Write(bytes, 0, bytes.Length);
        }
    }
}
