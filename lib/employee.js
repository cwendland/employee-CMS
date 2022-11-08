const connection = require('../config/connection');
const inquirer = require('inquirer');
const {employeeView} = require('../index');

const addEmployee = () => {
    inquirer.prompt([
        {
        name: "firstName", 
        type: "input", 
        message: "Please enter employee's first name.",
            validate: (input) => {
                if (!input) {return "Error, invalid first name.";}
                return true;
            },
        },
    {
        name: "lastName", 
        type: "input", 
        message: "Please enter the employee's last name.",
            validate: (input) => {
                if (!input) {return "Error, invalid last name.";}
            return true;
            },
        },
    {
        name: "positionId", 
        type: "input", 
        message: "Please enter position ID.",
        validate: (input) => {
            if (input=/^\d+$/) {
                return true;
            } else {return "Error, enter a valid position ID";}  
        },
    }
])
    .then(response => {
        connection.query("INSERT INTO employees SET ?",
        {first_name: response.firstName, 
        last_name: response.lastName, 
        position_id: parseInt(response.positionId)},
    (err, res) => {
        if (err) {
            console.log("Error, enter a valid position ID");
            addEmployee();
            return;
        }
        console.log(`Success ${response.firstName} ${response.lastName} has been added to the employee database.`);
        employeeView();
        });
    });
};

const getEmployees = () => {
    connection.query ( 
                    `SELECT
                    distinct (e.id),
                    CONCAT (e.first_name,' ',e.last_name) AS employee_name,
                    r.title as position_title,
                    d.name,
                    r.salary,
                    e.manager_id
                    FROM employee e
                    INNER JOIN positions r 
                    ON e.position_id = r.id
                    INNER JOIN departments d
                    ON r.department_id = d.id
                    ORDER BY e.id ASC LIMIT 100`, 
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        employeeView();
    })
};

const updateEmployeePosition = () => {
    connection.query(
                    `SELECT id, first_name, last_name
                    FROM employees`,
                (err, res) => {
                    if (err) throw err;
                    inquirer.prompt ([
                {
                    name: "employeeId",
                    type: "input",
                    message: "Enter the employee ID to be updated to position.",
                    validate: (input) => {
                    if (input=/^\d+$/) {
                        return true;
                    } else {return "Error, enter a valid employee ID";}
                    },
                },
                {
                name: "updatedPositionId",
                type: "input",
                message: "Enter new department ID number for the selected employee.",
                validate: (input) => {
                    if (input=/^\d+$/) {
                        return true;
                    } else {return "Error, enter a valid department ID";}
                    },
                },
            ])
            .then(response => {
                let updatedEmployeePosition = parseInt(response.employeeId);
                let updatedPositionId = parseInt(response.updatedPositionId);
            connection.query(`UPDATE employees SET position_id = ${updatedPositionId} WHERE id = ${updatedEmployeePosition}`,
                (err, res) => {
                if (err) {
                console.log("Error, enter a valid ID");
                updateEmployeePosition();
                return;
            }
            console.log(`Position was successfully updated.`);
            employeeView();
            });
        });
    });
};

const deleteEmployee = () => {
    let employees = [];
    connection.query(`SELECT id, first_name, last_name FROM employees`,
    (err, res) => {
    res.forEach(element => {
    employees.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });
inquirer.prompt ({
        name: "deletedEmployee", 
        type: "list", 
        message: "Select the employee to be deleted.", 
        choices: employees
    })
        .then(response => {
            let deletedEmployeeId = parseInt(response.deletedEmployee)
        connection.query(`DELETE FROM employees WHERE id = ${deletedEmployeeId}`,
            (err, res) => {
            console.table(response);
            console.log("Employee Deleted")
        employeeView();
            });
        });
    })
};
module.exports = {addEmployee, getEmployees, updateEmployeePosition, deleteEmployee};