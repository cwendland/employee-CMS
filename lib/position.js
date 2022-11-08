const inquirer = require('inquirer');
const connection = require('../config/connection');
const {employeeView} = require('../index');

const addPosition = () => {
    inquirer.prompt ([
        {
        name: 
        "positionTitle", 
        type: "input", 
        message: "Please enter position title.",
            validate: (input) => {
                if (!input) {return "Error, invalid title.";}
            return true;
            },
        },
    {
        name: 
        "positionSalary", 
        type: "input", 
        message: "Please enter a salary for the position.",
            validate: (input) => {
            if (input=/^\d+$/) {
                return true;
            } else {return "Error, invalid salary.";}
        },
        },
    {
        name: "departmentId", 
        type: "input", 
        message: "Enter department ID number for new position.",
        validate: (input) => {
            if (input=/^\d+$/) {
                return true;
            } else {return "Error, invalid department ID.";}
        },
    }
])
.then(response => {
    connection.query("INSERT INTO positions SET ?",
    {
        title: response.positionTitle,
        salary: parseInt(response.positionSalary),
        department_id: parseInt(response.departmentId)
    },
    (err, res) => {
        if (err) throw err;
        console.log(`Success ${response.positionTitle} position has been added.`);
        employeeView();
        });
    });
};

const getPositions = () => {
    connection.query(`SELECT * FROM positions`, (err, res) => {
        if (err) throw err; console.table(res); employeeView();
    });
};

module.exports = {addPosition, getPositions};