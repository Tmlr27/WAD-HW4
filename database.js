const Pool = require('pg').Pool; 
 
const pool = new Pool({ 
    user: "postgres", 
    password: "mypassword", 
    database: "homeworkwad", 
    host: "localhost", 
    port: "5432" 
}); 
 
module.exports = pool;