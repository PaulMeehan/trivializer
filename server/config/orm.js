const connection = require("./connection.js");

const orm = {

  selectAll: (tableName, cb) => {
    var strSQL = "select * from ??";
    connection.query(strSQL, [tableName], (err, results) => {
      if (err) throw err;
      cb(results);
    });
  },


};

module.exports = orm;