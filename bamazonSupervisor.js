var inquirer = require("inquirer");
var mysql = require("mysql");

var consoleTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

function salesByDepartment(){
    console.log("I'm in! 1");
    var salesByDepartmentQuery = "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) FROM departments d, products p WHERE d.department_name = p.department_name GROUP BY d.department_name;";
    console.log(salesByDepartmentQuery);
    connection.query(salesByDepartmentQuery, [], function(error, results) {
      if (error) throw error;
      console.table(results);
 /*     console.table([
        {
          name: 'foo',
          age: 10
        }, {
          name: 'bar',
          age: 20
        }
      ]); */
      connection.end();
    });

}

function createNewDepartment(){
    console.log("I'm in! 2");
    connection.end();
}

function selectAction() {
inquirer
    .prompt([
    {
        type: "list",
        message: "What do you want to do?",
        name: "action",
        choices:["View Product Sales by Department","Create New Department"]
    }
    ])
    .then(function(response) {
    console.log("Your choice is:");
    console.log(response.action);
    switch (response.action){
        case 'View Product Sales by Department':
            console.log('1');
            salesByDepartment();
            break;
        case 'Create New Department':
            console.log('2');
            createNewDepartment();
            break;
        default:
            console.log('error');
            connection.end();
    }
    });
}

connection.connect();

selectAction();