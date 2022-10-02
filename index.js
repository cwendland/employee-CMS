const { default: inquirer } = require("inquirer");
var loop = true;


while(quit) {
    inquirer
      .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        },
      ])
      .then((answers) => {
        switch(answers.action) {
            case 'View All Employees':
                getEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                getPositions();
                break;
            case 'Add Role':
                addPosition();
                break;
            case 'View All Departments':
                getDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Quit':
                loop = false;
                break;
            default:
                return new Error('Exiting: There was an unknown error.');
        }
      })
}