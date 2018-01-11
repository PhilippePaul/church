using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChurchWebServer
{
    public enum Gender { Male, Female };
    public class Person
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public string Email { get; set; } = string.Empty;
        public Address Address { get; set; } = new Address();
        public bool IsMember { get; set; }
    }
}
