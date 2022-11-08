const inquirer = require("inquirer");
const connection = require('./config/connection');

connection.connect(function(err) {
    if (err) throw err;
    employeeView();
});
  
const employeeView = () => {
    inquirer
      .prompt ({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                    "View Departments", 
                    "Add Department", 
                    "View Positions", 
                    "Add Position", 
                    "View Employees",
                    "Add Employee",
                    "Update Employee Position",
                    "Delete Employee",
                    "Exit"
                    ]
    })
//SELECTION OF APP PROCESSES FROM MENU//
      .then(function(input) {
        switch (input.action) {
            case "Add Department": 
            addDepartment(); 
            break;
            case "Add Position": 
            addPosition(); 
            break;
            case "Add Employee": 
            addEmployee(); 
            break;
            case "View Departments": 
            getDepartments(); 
            break;
            case "View Positions": 
            getPositions(); 
            break;
            case "View Employees": 
            getEmployees(); 
            break;
            case "Update Employee Position": 
            updateEmployeePosition(); 
            break;
            case "Delete Employee": 
            deleteEmployee(); 
            break;            
            case "Exit": 
            connection.end(); 
            break;
        }
      });
}

const addDepartment = () => {
    inquirer.prompt ({
        name: "newDepartment", 
        type: "input", 
        message: "Please enter the name for the department.",
            validate: (input) => {
        if (!input) {return "Error, invalid name";}
        return true;
        },
    })
    .then(response => {
        connection.query("INSERT INTO departments SET ?",
        {name: response.newDepartment},
            (err, res) => {
                if (err) throw err;
                console.log(`Success, added ${response.newDepartment} department.`);
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
                    FROM employees e
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



module.exports = employeeView;