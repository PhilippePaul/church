using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace ChurchWebServer
{
    public class DatabaseInterface
    {
        private MySqlConnection connection;
        private string server;
        private string database;
        private string uid;
        private string password;

        public DatabaseInterface()
        {
            Initialize();
        }

        private void Initialize()
        {
            server = "localhost";
            database = "church";
            uid = "root";
            password = "MyNewPass";
            var connectionString = "SERVER=" + server + ";" + "DATABASE=" +
            database + ";" + "UID=" + uid + ";" + "PASSWORD=" + password + ";";

            connection = new MySqlConnection(connectionString);
        }

        private bool OpenConnection()
        {
            try
            {
                connection.Open();
                return true;
            }
            catch (MySqlException ex)
            {
                switch (ex.Number)
                {
                    case 0:
                        Console.WriteLine("Cannot connect to server.  Contact administrator");
                        break;

                    case 1045:
                        Console.WriteLine("Invalid username/password, please try again");
                        break;
                }
                return false;
            }
        }

        private bool CloseConnection()
        {
            try
            {
                connection.Close();
                return true;
            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public void Insert()
        {
            var query = "INSERT INTO tableinfo (name, age) VALUES('John Smith', '33')";

            if (OpenConnection())
            {
                try
                {
                    MySqlCommand cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void Update()
        {
            var query = "UPDATE tableinfo SET name='Joe', age='22' WHERE name='John Smith'";

            if (OpenConnection())
            {
                try
                {
                    MySqlCommand cmd = new MySqlCommand();
                    cmd.CommandText = query;
                    cmd.Connection = connection;
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void Delete()
        {
            var query = "DELETE FROM tableinfo WHERE name='John Smith'";

            if (OpenConnection())
            {
                try
                {
                    MySqlCommand cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        #region Get methods

        public List<string>[] Select()
        {
            var query = "SELECT * FROM tableinfo";

            var list = new List<string>[3];
            list[0] = new List<string>();
            list[1] = new List<string>();
            list[2] = new List<string>();

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    var dataReader = cmd.ExecuteReader();

                    while (dataReader.Read())
                    {
                        list[0].Add(dataReader["id"] + "");
                        list[1].Add(dataReader["name"] + "");
                        list[2].Add(dataReader["age"] + "");
                    }

                    dataReader.Close();
                }
                finally
                {
                    CloseConnection();
                }
            }
            return list;
        }

        public List<string> GetChildren(int id)
        {
            var query = "get_children_by_id";

            var list = new List<string>();

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("id", id);

                    var dataReader = cmd.ExecuteReader();

                    while (dataReader.Read())
                    {
                        list.Add($"{dataReader["firstname"]} {dataReader["lastname"]}");
                    }

                    dataReader.Close();
                }
                finally
                {
                    CloseConnection();
                }
            }
            return list;
        }

        public List<string> GetParents(int id)
        {
            var query = "get_parents_by_id";

            var list = new List<string>();

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("id", id);

                    var dataReader = cmd.ExecuteReader();

                    while (dataReader.Read())
                    {
                        list.Add($"{dataReader["firstname"]} {dataReader["lastname"]}");
                    }

                    dataReader.Close();
                }
                finally
                {
                    CloseConnection();
                }
            }
            return list;
        }

        public Person GetSpouse(int id)
        {
            var query = "get_spouse_by_id";

            var person = new Person();

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("id", id);

                    var dataReader = cmd.ExecuteReader();

                    if (dataReader.Read())
                    {
                        person.Id = (int)dataReader["idperson"];
                        person.FirstName = dataReader["firstname"].ToString();
                        person.LastName = dataReader["lastname"].ToString();
                        person.Age = (int)dataReader["age"];
                        person.Gender = (Gender)Convert.ToInt32(dataReader["gender"]);
                        person.Email = dataReader["email"].ToString();
                        person.IsMember = Convert.ToBoolean(dataReader["ismember"]);
                        person.Address.StreetAddress = dataReader["address1"].ToString();
                        person.Address.City = dataReader["city"].ToString();
                        person.Address.ProvinceState = dataReader["province_state"].ToString();
                        person.Address.Country = dataReader["country"].ToString();
                        person.Address.PostalCode = dataReader["postalcode"].ToString();
                    }

                    dataReader.Close();
                }
                finally
                {
                    CloseConnection();
                }
            }

            return person;
        }

        public Person GetPerson(int id)
        {
            var query = "get_person_by_id";

            var person = new Person();

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("id", id);

                    var dataReader = cmd.ExecuteReader();

                    if (dataReader.Read())
                    {
                        person.Id = (int)dataReader["idperson"];
                        person.FirstName = dataReader["firstname"].ToString();
                        person.LastName = dataReader["lastname"].ToString();
                        person.Age = (int)dataReader["age"];
                        person.Gender = (Gender)Convert.ToInt32(dataReader["gender"]);
                        person.Email = dataReader["email"].ToString();
                        person.IsMember = Convert.ToBoolean(dataReader["ismember"]);
                        person.Address.StreetAddress = dataReader["address1"].ToString();
                        person.Address.City = dataReader["city"].ToString();
                        person.Address.ProvinceState = dataReader["province_state"].ToString();
                        person.Address.Country = dataReader["country"].ToString();
                        person.Address.PostalCode = dataReader["postalcode"].ToString();
                    }

                    dataReader.Close();
                }
                finally
                {
                    CloseConnection();
                }
            }

            return person;
        }

        public List<Person> GetPersonList()
        {
            var query = "get_person_list";

            var personList = new List<Person>();

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    var dataReader = cmd.ExecuteReader();

                    while (dataReader.Read())
                    {
                        var person = new Person();
                        person.Id = (int)dataReader["idperson"];
                        person.FirstName = dataReader["firstname"].ToString();
                        person.LastName = dataReader["lastname"].ToString();
                        person.Age = (int)dataReader["age"];
                        person.Gender = (Gender)Convert.ToInt32(dataReader["gender"]);
                        person.Email = dataReader["email"].ToString();
                        person.IsMember = Convert.ToBoolean(dataReader["ismember"]);
                        person.Address.StreetAddress = dataReader["address1"].ToString();
                        person.Address.City = dataReader["city"].ToString();
                        person.Address.ProvinceState = dataReader["province_state"].ToString();
                        person.Address.Country = dataReader["country"].ToString();
                        person.Address.PostalCode = dataReader["postalcode"].ToString();
                        personList.Add(person);
                    }

                    dataReader.Close();
                }
                finally
                {
                    CloseConnection();
                }
            }

            return personList;
        }

        #endregion

        public int Count()
        {
            var query = "SELECT Count(*) FROM tableinfo";
            int Count = -1;

            if (OpenConnection())
            {
                var cmd = new MySqlCommand(query, connection);

                Count = int.Parse(cmd.ExecuteScalar() + "");

                CloseConnection();
            }
            return Count;
        }
    }
}
