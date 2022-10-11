const { default: inquirer } = require('inquirer');
const db = require('../config/connection');

const addPosition = () => {
    let departments;
    db.query('SELECT name FROM departments', (err, results) => {
        departments = results;
    });
    inquirer
      .prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'What department does the role belong to?',
            choices: departments,
            name: 'dep'
        }
      ])
      .then((answer) => {
        let dep_id;
        db.query(`SELECT id FROM departments WHERE 'name' = ?`, answer.dep,(err,results) => {
            dep_id = results;
        });
        db.query(`INSERT INTO positions (name, salary, department_id) VALUES (${answer.name}, ${answer.salary}, ${dep_id})`, (err,results) => {
            console.log(`Added ${answer.name} to the database`);
        });
      });
}

const getPositions = () => {
    db.query('SELECT * FROM positions', (err,results) => {
        if(!results) {
            console.table(results);
        } else {
            console.warn(err);
        }
    });
}

module.exports = {addPosition, getPositions};