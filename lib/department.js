const connection = require('../config/connection');
const inquirer = require('inquirer');
const employeeView = require('../index');

const addDepartment = () => {
    inquirer.prompt ({
        name: "newDepartment", 
        type: "input", 
        message: "Please enter the name for the department.",
            validate: (input) => {
        if (!input) {return "Error❗ Please enter valid department name❗";}
        return true;
        },
    })
    .then(response => {
        connection.query("INSERT INTO departments SET ?",
        {name: response.newDepartment},
            (err, res) => {
                if (err) throw err;
                console.log(`Success ✅ ${response.newDepartment} department added successfully ✅.`);
        employeeView();
        });
    });
};

const getDepartments = () => {
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err; 
        console.table(res); 
        employeeView();
    });
};

module.exports = {addDepartment, getDepartments};