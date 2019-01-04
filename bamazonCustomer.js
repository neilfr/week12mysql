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
//  console.log(productInfoQuery);
  connection.query(productInfoQuery, [productId], function(error, results) {
    if (error) throw error;
//    console.log(results[0].product_name);
    var newStockLevel = results[0].stock_quantity - orderQty;
    if (newStockLevel < 0) {
      console.log("Insufficient quantity!");
    } else {
//      console.log("We have enough!");
      var purchaseCost = results[0].price * orderQty;
      console.log("The total cost of your purchase is: $" + purchaseCost);
      console.log("The new stock level is: " + newStockLevel);
      var updateStockAndSalesQuery =
        "UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE item_id = ?";
//      console.log(updateStockAndSalesQuery);
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
//      console.log("product id you entered is:");
//      console.log(response.productId);
//      console.log("the quantity ordered is:");
//      console.log(response.orderQty);
      processOrder(response.productId, response.orderQty);
    });
}

function displayStock() {
  var displayStockQuery = "SELECT * from products;";
//  console.log(displayStockQuery);
  connection.query(displayStockQuery, [], function(error, results) {
    if (error) throw error;
    console.table(results);
    getOrder();
  });
}

connection.connect();

displayStock();