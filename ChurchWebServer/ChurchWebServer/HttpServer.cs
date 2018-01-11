// MIT License - Copyright (c) 2016 Can Güney Aksakalli
// https://aksakalli.github.io/2014/02/24/simple-http-server-with-csparp.html

using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace ChurchWebServer
{
    public class HttpServer
    {
        private readonly string[] m_indexFiles =
        {
            "index.html",
            "index.htm",
            "default.html",
            "default.htm"
        };

        private static IDictionary<string, string> m_mimeTypeMappings = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase)
        {
            #region extension to MIME type list
            {".asf", "video/x-ms-asf"},
            {".asx", "video/x-ms-asf"},
            {".avi", "video/x-msvideo"},
            {".bin", "application/octet-stream"},
            {".cco", "application/x-cocoa"},
            {".crt", "application/x-x509-ca-cert"},
            {".css", "text/css"},
            {".deb", "application/octet-stream"},
            {".der", "application/x-x509-ca-cert"},
            {".dll", "application/octet-stream"},
            {".dmg", "application/octet-stream"},
            {".ear", "application/java-archive"},
            {".eot", "application/octet-stream"},
            {".exe", "application/octet-stream"},
            {".flv", "video/x-flv"},
            {".gif", "image/gif"},
            {".hqx", "application/mac-binhex40"},
            {".htc", "text/x-component"},
            {".htm", "text/html"},
            {".html", "text/html"},
            {".ico", "image/x-icon"},
            {".img", "application/octet-stream"},
            {".iso", "application/octet-stream"},
            {".jar", "application/java-archive"},
            {".jardiff", "application/x-java-archive-diff"},
            {".jng", "image/x-jng"},
            {".jnlp", "application/x-java-jnlp-file"},
            {".jpeg", "image/jpeg"},
            {".jpg", "image/jpeg"},
            {".js", "application/x-javascript"},
            {".mml", "text/mathml"},
            {".mng", "video/x-mng"},
            {".mov", "video/quicktime"},
            {".mp3", "audio/mpeg"},
            {".mpeg", "video/mpeg"},
            {".mpg", "video/mpeg"},
            {".msi", "application/octet-stream"},
            {".msm", "application/octet-stream"},
            {".msp", "application/octet-stream"},
            {".pdb", "application/x-pilot"},
            {".pdf", "application/pdf"},
            {".pem", "application/x-x509-ca-cert"},
            {".pl", "application/x-perl"},
            {".pm", "application/x-perl"},
            {".png", "image/png"},
            {".prc", "application/x-pilot"},
            {".ra", "audio/x-realaudio"},
            {".rar", "application/x-rar-compressed"},
            {".rpm", "application/x-redhat-package-manager"},
            {".rss", "text/xml"},
            {".run", "application/x-makeself"},
            {".sea", "application/x-sea"},
            {".shtml", "text/html"},
            {".sit", "application/x-stuffit"},
            {".swf", "application/x-shockwave-flash"},
            {".tcl", "application/x-tcl"},
            {".tk", "application/x-tcl"},
            {".txt", "text/plain"},
            {".war", "application/java-archive"},
            {".wbmp", "image/vnd.wap.wbmp"},
            {".wmv", "video/x-ms-wmv"},
            {".xml", "text/xml"},
            {".xpi", "application/x-xpinstall"},
            {".zip", "application/zip"},
        #endregion
        };
        private ManualResetEventSlim m_stopServer = new ManualResetEventSlim();
        private string m_rootDirectory;
        private HttpListener m_listener;
        private int m_port;
        private DatabaseInterface m_databaseInterface;

        /// <summary>
        /// Construct server with given port.
        /// </summary>
        /// <param name="path">Directory path to serve.</param>
        /// <param name="port">Port of the server.</param>
        public HttpServer(string path, int port)
        {
            Initialize(path, port);
            m_databaseInterface = new DatabaseInterface();
        }

        /// <summary>
        /// Construct server with suitable port.
        /// </summary>
        /// <param name="path">Directory path to serve.</param>
        public HttpServer(string path)
        {
            Initialize(path, 80);
            m_databaseInterface = new DatabaseInterface();
        }

        /// <summary>
        /// Stop server and dispose all functions.
        /// </summary>
        public void Stop()
        {
            m_stopServer.Set();
            m_listener.Stop();
        }

        private void Listen()
        {
            try
            {
                m_listener = new HttpListener();
                m_listener.Prefixes.Add("http://localhost:" + m_port.ToString() + "/");
                m_listener.Start();
                while (!m_stopServer.IsSet)
                {
                    try
                    {
                        HttpListenerContext context = m_listener.GetContext();
                        if (context.Request.HttpMethod == "GET")
                            HandleGet(context);
                        else if (context.Request.HttpMethod == "POST")
                            HandlePost(context);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private void HandleGet(HttpListenerContext context)
        {
            string filename = context.Request.Url.AbsolutePath;
            filename = filename.Substring(1); //remove slash

            if (string.IsNullOrEmpty(filename))
            {
                foreach (string indexFile in m_indexFiles)
                {
                    if (File.Exists(Path.Combine(m_rootDirectory, indexFile)))
                    {
                        filename = indexFile;
                        break;
                    }
                }
            }

            filename = Path.Combine(m_rootDirectory, filename);

            if (File.Exists(filename))
            {
                try
                {
                    Stream input = new FileStream(filename, FileMode.Open);

                    //Adding permanent http response headers
                    string mime;
                    context.Response.ContentType = m_mimeTypeMappings.TryGetValue(Path.GetExtension(filename), out mime) ? mime : "application/octet-stream";
                    context.Response.ContentLength64 = input.Length;
                    context.Response.AddHeader("Date", DateTime.Now.ToString("r"));
                    context.Response.AddHeader("Last-Modified", System.IO.File.GetLastWriteTime(filename).ToString("r"));

                    byte[] buffer = new byte[1024 * 16];
                    int nbytes;
                    while ((nbytes = input.Read(buffer, 0, buffer.Length)) > 0)
                        context.Response.OutputStream.Write(buffer, 0, nbytes);
                    input.Close();

                    context.Response.StatusCode = (int)HttpStatusCode.OK;
                    context.Response.OutputStream.Flush();
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    Console.WriteLine(ex);
                }

            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }

            context.Response.OutputStream.Close();
        }

        private void HandlePost(HttpListenerContext context)
        {
            switch (context.Request.Url.LocalPath.Substring(1))
            {
                case "getParents":
                    HandleGetParents(context);
                    break;
                case "getChildren":
                    HandleGetChildren(context);
                    break;
                case "getPerson":
                    HandleGetPerson(context);
                    break;
                case "getPersonList":
                    HandleGetPersonList(context);
                    break;
                default:
                    break;
            }
        }

        private void HandleGetChildren(HttpListenerContext context)
        {
            int id;
            if(!int.TryParse(context.Request.Url.Query.Substring(1), out id))
            {
                Console.WriteLine($"Invalid id in request. URL: {context.Request.RawUrl}");
                return;
            }

            try
            {
                var bytes = Encoding.ASCII.GetBytes(string.Join(";", m_databaseInterface.GetChildren(id)));
                context.Response.OutputStream.Write(bytes, 0, bytes.Count());

                context.Response.StatusCode = (int)HttpStatusCode.OK;
                context.Response.OutputStream.Flush();
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Console.WriteLine(ex);
            }

            context.Response.OutputStream.Close();
        }

        private void HandleGetParents(HttpListenerContext context)
        {
            int id;
            if (!int.TryParse(context.Request.Url.Query.Substring(1), out id))
            {
                Console.WriteLine($"Invalid id in request. URL: {context.Request.RawUrl}");
                return;
            }

            try
            {
                var bytes = Encoding.ASCII.GetBytes(string.Join(";", m_databaseInterface.GetParents(id)));
                context.Response.OutputStream.Write(bytes, 0, bytes.Count());

                context.Response.StatusCode = (int)HttpStatusCode.OK;
                context.Response.OutputStream.Flush();
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Console.WriteLine(ex);
            }

            context.Response.OutputStream.Close();
        }

        private void HandleGetPerson(HttpListenerContext context)
        {
            int id;
            if (!int.TryParse(context.Request.Url.Query.Substring(1), out id))
            {
                Console.WriteLine($"Invalid id in request. URL: {context.Request.RawUrl}");
                return;
            }

            try
            {
                var bytes = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(m_databaseInterface.GetPerson(id)));
                context.Response.OutputStream.Write(bytes, 0, bytes.Count());

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.OK;
                context.Response.OutputStream.Flush();
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Console.WriteLine(ex);
            }

            context.Response.OutputStream.Close();
        }

        private void HandleGetPersonList(HttpListenerContext context)
        {
            try
            {
                var bytes = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(m_databaseInterface.GetPersonList()));
                context.Response.OutputStream.Write(bytes, 0, bytes.Count());

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.OK;
                context.Response.OutputStream.Flush();
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Console.WriteLine(ex);
            }

            context.Response.OutputStream.Close();
        }

        private void Initialize(string path, int port)
        {
            m_rootDirectory = path;
            m_port = port;
            m_stopServer.Reset();
            Task.Run(() => Listen());
        }
    }
}