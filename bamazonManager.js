var inquirer = require("inquirer");
var mysql = require("mysql");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

function displayStock() {
    var displayStockQuery = "SELECT * from products;";
    connection.query(displayStockQuery, [], function(error, results) {
      if (error) throw error;
      console.table(results);
    });
    connection.end();
  }

  function displayLowStock() {
    var displayLowStockQuery = "SELECT * from products WHERE stock_quantity <5;";
    connection.query(displayLowStockQuery, [], function(error, results) {
      if (error) throw error;
      console.table(results);
    });
    connection.end();
  }

function addInventory() {
    var productListQuery = "SELECT product_name from products;";
    var productList=[];
    connection.query(productListQuery, [], function(error, results) {
      if (error) throw error;
      for (i = 0; i < results.length; i++) { 
        productList[i]=results[i].product_name;
      }
      pickProduct(productList);
    });
}

function pickProduct(productList){
    inquirer
    .prompt([
      {
        type: "list",
        message: "Add inventory to which product?",
        name: "product",
        choices: productList
      },
      {
        type:"input",
        message: "How many would you like to add?",
        name: "addQty"
      }
    ])
    .then(function(response) {
      var addStockQuery = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?;'
      connection.query(addStockQuery, [response.addQty, response.product]);
      connection.end();
    });
}

function addProduct(){
    var departmentListQuery = "SELECT department_name from departments;";
    var departmentList=[];
    connection.query(departmentListQuery, [], function(error, results) {
      if (error) throw error;
      for (i = 0; i < results.length; i++) { 
        departmentList[i]=results[i].department_name;
      }
      pickDepartment(departmentList);
    });
  }

function pickDepartment(departmentList){
  inquirer
  .prompt([
    {
      type:"input",
      message: "What is the name of the product you would like to add?",
      name: "productName"
    },
    {
      type: "list",
      message: "Which department does the product belong in?",
      name: "productDepartment",
      choices:departmentList
    },
    {
      type:"input",
      message: "What is the price of the product?",
      name: "productPrice"
    },
    {
      type:"input",
      message: "What is the initial stock quantity?",
      name: "productStock"
    }
  ])
  .then(function(response) {
    var newProductQuery = 'INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales ) VALUES (?, ?, ?, ?, 0);';
    connection.query(newProductQuery, [response.productName, response.productDepartment, response.productPrice, response.productStock]);
    connection.end();
  });
}

function selectAction() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What do you want to do?",
          name: "action",
          choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
        }
      ])
      .then(function(response) {
        switch (response.action){
            case 'View Products for Sale':
                displayStock();
                break;
            case 'View Low Inventory':
                displayLowStock();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            default:
                console.log('error');
                connection.end();
        }
      });
  }

  
connection.connect();

selectAction();