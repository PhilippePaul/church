using System;
using System.Collections.Generic;

namespace ChurchWebServer
{
    public enum Gender { Male, Female };
    public class Person
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public string Email { get; set; } = string.Empty;
        public Address Address { get; set; } = new Address();
        public bool IsMember { get; set; }
        public DateTime CreationDate { get; set; }
    }

    public class PersonInfo
    {
        public List<int> Parents { get; set; }
        public List<int> Children { get; set; }
        public Person Person { get; set; }
    }
}
