const db = require('../config/connection');

db.query(`SOURCE schema.sql`, (err,results) => {
    if(err) {
        console.log(err);
    }
    if(results) {
        console.log(results);
    }
});

db.query(`SOURCE seeds.sql`, (err,results) => {
    console.log(results);
});