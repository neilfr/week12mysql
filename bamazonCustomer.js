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

function processOrder(productId, orderQty) {
  var productInfoQuery = "Select * from products where item_id = ?;";
  connection.query(productInfoQuery, [productId], function(error, results) {
    if (error) throw error;
    var newStockLevel = results[0].stock_quantity - orderQty;
    if (newStockLevel < 0) {
      console.log("Insufficient quantity!");
    } else {
      var purchaseCost = results[0].price * orderQty;
      console.log("The total cost of your purchase is: $" + purchaseCost);
      console.log("The new stock level is: " + newStockLevel);
      var updateStockAndSalesQuery =
        "UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE item_id = ?";
      connection.query(updateStockAndSalesQuery, [newStockLevel, purchaseCost ,productId]);
    }
    connection.end();
  });
}

function getOrder() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the ID of the product you wish to purchase",
        name: "productId"
      },
      {
        type: "input",
        message: "How many units would you like to purchase?",
        name: "orderQty"
      }
    ])
    .then(function(response) {
      processOrder(response.productId, response.orderQty);
    });
}

function displayStock() {
  var displayStockQuery = "SELECT * from products;";
  connection.query(displayStockQuery, [], function(error, results) {
    if (error) throw error;
    console.table(results);
    getOrder();
  });
}

connection.connect();

displayStock();