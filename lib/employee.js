const db = require('../config/connection');
const inquirer = require('inquirer');

const addEmployee = () => {
    let departments;
    let positions;
    db.query('SELECT name FROM departments', (err, results) => {
        departments = results;
    });
    db.query('SELECT name FROM positions', (err, results) => {
        departments = results;
    });
    inquirer
      .prompt([
        {
            type: 'input',
            message: 'What is their first name?',
            name: 'newDepartment'
        },
      ])
}

const getEmployees = () => {

}

const updateEmployee = () => {

}

module.exports = {addEmployee, getEmployees, updateEmployee};