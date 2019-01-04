var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

function displayStock() {
    var displayStockQuery = "SELECT * from products;";
    console.log(displayStockQuery);
    connection.query(displayStockQuery, [], function(error, results) {
      if (error) throw error;
      console.log("ID, Name, Department, Price, Stock");
      for (i = 0; i < results.length; i++) {
        console.log(
          results[i].item_id +
            ", " +
            results[i].product_name +
            ", " +
            results[i].department_name +
            ", $" +
            results[i].price +
            ", " +
            results[i].stock_quantity
        );
      }
    });
    connection.end();
  }

  function displayLowStock() {
    var displayLowStockQuery = "SELECT * from products WHERE stock_quantity <5;";
    console.log(displayLowStockQuery);
    connection.query(displayLowStockQuery, [], function(error, results) {
      if (error) throw error;
      console.log("ID, Name, Department, Price, Stock");
      for (i = 0; i < results.length; i++) {
        console.log(
          results[i].item_id +
            ", " +
            results[i].product_name +
            ", " +
            results[i].department_name +
            ", $" +
            results[i].price +
            ", " +
            results[i].stock_quantity
        );
      }
    });
    connection.end();
  }

function addInventory() {
    var productListQuery = "SELECT product_name from products;";
    var productList=[];
    console.log(productListQuery);
    connection.query(productListQuery, [], function(error, results) {
      if (error) throw error;
      for (i = 0; i < results.length; i++) { 
        console.log(
          results[i].product_name
        );
        productList[i]=results[i].product_name;
      }
      pickProduct(productList);
    });
}

function pickProduct(productList){
    for (i=0;i<productList.length;i++){
      console.log("product "+i+" is "+productList[i]);
    }
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
      console.log("The product you chose is:");
      console.log(response.product);
      console.log("And you want to increment the stock by:");
      console.log(response.addQty);
      var addStockQuery = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?;'
      connection.query(addStockQuery, [response.addQty, response.product]);
      connection.end();
    });
}

function addProduct(){
    var departmentListQuery = "SELECT department_name from departments;";
    var departmentList=[];
    console.log(departmentListQuery);
    connection.query(departmentListQuery, [], function(error, results) {
      if (error) throw error;
      for (i = 0; i < results.length; i++) { 
        console.log(
          results[i].department_name
        );
        departmentList[i]=results[i].department_name;
      }
      pickDepartment(departmentList);
    });
  }

function pickDepartment(departmentList){
  console.log("add a product!");
  console.log("departmentList contains:");
  console.log(departmentList);
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
    console.log("The product you want to add is:");
    console.log(response.productName);
    console.log("The product department is:");
    console.log(response.productDepartment);
    console.log("The product price is:");
    console.log(response.productPrice);
    console.log("The initial stock quantity is:");
    console.log(response.productStock);
    var newProductQuery = 'INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales ) VALUES (?, ?, ?, ?, 0);';
    console.log(newProductQuery);
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
        console.log("Your choice is:");
        console.log(response.action);
        switch (response.action){
            case 'View Products for Sale':
                console.log('1');
                displayStock();
                break;
            case 'View Low Inventory':
                console.log('2');
                displayLowStock();
                break;
            case 'Add to Inventory':
                console.log('3');
                addInventory();
                break;
            case 'Add New Product':
                console.log('4');
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