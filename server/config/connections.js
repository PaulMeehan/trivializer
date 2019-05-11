// Include dependencies
const mysql = require("mysql");
require("dotenv").config();

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DATABASE_PW,
    database: 'trivializer_db'
  });
}

// Connect to the database.
connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected as id: ${connection.threadId}`);
});

module.exports = connection;