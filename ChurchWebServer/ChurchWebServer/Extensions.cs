using System.IO;
using System.Text;

namespace ChurchWebServer
{
    public static class Extensions
    {
        public static void WriteUTF8String(this Stream stream, string str)
        {
            var bytes = Encoding.UTF8.GetBytes(str);
            stream.Write(bytes, 0, bytes.Length);
        }

        public static string ReadUTF8String(this byte[] bytes)
        {
            return Encoding.UTF8.GetString(bytes);
        }
    }
}
