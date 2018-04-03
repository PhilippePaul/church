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
            var connectionString = $"SERVER={server};DATABASE={database};UID={uid};PASSWORD={password};CHARSET=utf8;";

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

        public int CreatePerson(Person person)
        {
            int id = -1;
            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand("create_person", connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("fn", person.FirstName);
                    cmd.Parameters.AddWithValue("ln", person.LastName);
                    cmd.Parameters.AddWithValue("bd", person.BirthDate);
                    cmd.Parameters.AddWithValue("gender", person.Gender);
                    cmd.Parameters.AddWithValue("address", person.Address.Id);
                    cmd.Parameters.AddWithValue("email", person.Email);
                    cmd.Parameters.AddWithValue("member", person.IsMember);
                    cmd.Parameters.AddWithValue("creationdate", DateTime.Now);

                    var dataReader = cmd.ExecuteReader();
                    if (dataReader.Read())
                    {
                        id = Convert.ToInt32(dataReader["id"]);
                    }
                }
                finally
                {
                    CloseConnection();
                }
            }

            return id;
        }

        public void UpdatePerson(Person person)
        {
            var query = $"UPDATE church.person SET firstname='{person.FirstName}', lastname='{person.LastName}', birthdate='{person.BirthDate.ToString("yyyy-MM-dd")}', gender='{(int)person.Gender}', email='{person.Email}', ismember='{(person.IsMember ? 1 : 0).ToString()}' WHERE idperson={person.Id}";

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void DeletePerson(int personId)
        {
            if (OpenConnection())
            {
                try
                {
                    //Delete relationships
                    var query = $"DELETE FROM church.person_relationship WHERE person_id={personId} OR relative_id={personId}";
                    var cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();

                    //Delete Address
                    var person = GetPerson(personId);
                    query = $"DELETE FROM church.address WHERE idaddress={person.Address.Id}";
                    cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();

                    //Delete person
                    query = $"DELETE FROM church.person WHERE idperson={personId}";
                    cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void UpdateAddress(Address address)
        {
            var query = $"UPDATE church.address SET address1='{address.StreetAddress}', city='{address.City}', country='{address.Country}', province_state='{address.ProvinceState}', postalcode='{address.PostalCode}' WHERE idaddress={address.Id}";

            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand(query, connection);
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void AddParentsRelationship(int personId, List<int> parentsId)
        {
            if (OpenConnection())
            {
                try
                {
                    foreach (var id in parentsId)
                    {
                        //Parent: person_id
                        //Child: relative_id
                        //relationship_type=1
                        var query = $"INSERT INTO church.person_relationship (person_id, relative_id, relationship_type) VALUES ({id}, {personId}, 1)";
                        var cmd = new MySqlCommand(query, connection);
                        cmd.ExecuteNonQuery();
                    }
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void AddChildrenRelationship(int personId, List<int> childrenId)
        {
            if (OpenConnection())
            {
                try
                {
                    foreach (var id in childrenId)
                    {
                        //Parent: person_id
                        //Child: relative_id
                        //relationship_type=1
                        var query = $"INSERT INTO church.person_relationship (person_id, relative_id, relationship_type) VALUES ({personId}, {id}, 1)";
                        var cmd = new MySqlCommand(query, connection);
                        cmd.ExecuteNonQuery();
                    }
                }
                finally
                {
                    CloseConnection();
                }
            }
        }

        public void RemoveParents(int personId, List<int> parentsId)
        {

        }

        public void RemoveChildren(int personId, List<int> childrenId)
        {

        }

        public int CreateAddress(Address address)
        {
            int id = -1;
            if (OpenConnection())
            {
                try
                {
                    var cmd = new MySqlCommand("create_address", connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("address1", address.StreetAddress);
                    cmd.Parameters.AddWithValue("city", address.City);
                    cmd.Parameters.AddWithValue("province_state", address.ProvinceState);
                    cmd.Parameters.AddWithValue("country", address.Country);
                    cmd.Parameters.AddWithValue("postalcode", address.PostalCode);

                    var dataReader = cmd.ExecuteReader();
                    if (dataReader.Read())
                    {
                        id = Convert.ToInt32(dataReader["id"]);
                    }
                }
                finally
                {
                    CloseConnection();
                }
            }

            return id;
        }

        #region Get methods

        public List<Person> GetChildren(int id)
        {
            var query = "get_children_by_id";

            var list = new List<Person>();

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
                        list.Add(ExtractPerson(dataReader));
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

        public List<Person> GetParents(int id)
        {
            var query = "get_parents_by_id";

            var list = new List<Person>();

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
                        list.Add(ExtractPerson(dataReader));
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
                        person = ExtractPerson(dataReader);
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
                        person = ExtractPerson(dataReader);
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
                        personList.Add(ExtractPerson(dataReader));
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

        private Person ExtractPerson(MySqlDataReader dataReader)
        {
            var person = new Person();
            person.Id = (int)dataReader["idperson"];
            person.FirstName = dataReader["firstname"].ToString();
            person.LastName = dataReader["lastname"].ToString();
            person.BirthDate = (DateTime)dataReader["birthdate"];
            person.Gender = (Gender)Convert.ToInt32(dataReader["gender"]);
            person.Email = dataReader["email"].ToString();
            person.IsMember = Convert.ToBoolean(dataReader["ismember"]);
            person.Address = ExtractAddress(dataReader);
            return person;
        }

        private Address ExtractAddress(MySqlDataReader dataReader)
        {
            var address = new Address();
            address.Id = (int)dataReader["idaddress"];
            address.StreetAddress = dataReader["address1"].ToString();
            address.City = dataReader["city"].ToString();
            address.ProvinceState = dataReader["province_state"].ToString();
            address.Country = dataReader["country"].ToString();
            address.PostalCode = dataReader["postalcode"].ToString();

            return address;
        }

        #endregion
    }
}
