const q = require('mysql2');

const con = q.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"users"
});


module.exports = con;