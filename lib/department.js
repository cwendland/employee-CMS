const db = require('../config/connection');

const addDepartment = () => {
    db.query('SELECT * FROM departments', (err,results) => {
        if(!results) {
            console.table(results);
        } else {
            console.warn(err);
        }
    });
}

const getDepartments = () => {
    inquirer
      .prompt([
        {
            type: 'input',
            message: 'What is the department being added?',
            name: 'newDepartment'
        },
      ])
      .then((answer) => {
        db.query(`INSERT INTO departments (name) VALUES (${answer.newDepartment})`, (err,results) => {
            console.log(`Added ${answer.newDepartment} to the database`);
        });
      });
}

module.exports = {addDepartment, getDepartments};