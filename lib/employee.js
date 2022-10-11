const db = require('../config/connection');
const inquirer = require('inquirer');

const addEmployee = () => {
    let departments;
    let positions;
    db.query('SELECT name FROM departments', (err, results) => {
        departments = results;
    });
    db.query('SELECT name FROM positions', (err, results) => {
        positions = results;
    });
    inquirer
      .prompt([
        {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'What is the employee\'s role?',
            name: 'role',
            choices: positions
        },
      ])
}

const getEmployees = () => {

}

const updateEmployee = () => {

}

module.exports = {addEmployee, getEmployees, updateEmployee};