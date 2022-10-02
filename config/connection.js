const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    },
    console.log('Connected to the employees_db database')
);

module.exports = db;