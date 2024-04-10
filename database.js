const mysql = require('mysql');

// Create a connection to the MySQL server
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sia123'
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL server as ID ' + connection.threadId);
  
  // Execute the SQL query to create the database
  const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS SampleDb";
  connection.query(createDatabaseQuery, (error, results) => {
    if (error) {
      console.error('Error creating database: ' + error.message);
      return;
    }
    console.log('Database created successfully');
    
    // Close the connection after creating the database
    connection.end();
  });
});

module.exports = connection;
