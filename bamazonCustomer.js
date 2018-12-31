var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user:"root",
    password: "root",
    database: "bamazon_db"
});

connection.connect();

var query = 'SELECT * from products;';
console.log(query);
connection.query(query, [], function (error, results, fields) {
    if(error) throw error;
    for(i=0;i<results.length;i++){
        console.log(results[i].item_id+', '+results[i].product_name+', '+results[i].department_name+', '+results[i].price+', '+results[i].stock_quantity);
    }
    connection.end();
  });

/*
inquirer.prompt([
   {
       type: "list",
       message: "Would you like to Bid or Post an item?",
       choices: ["Post an Item", "Bid on an Item"],
       name: "command"
   }
]).then(function(inquirerResponse){
   if(inquirerResponse.command === "Post an Item") {
       inquirer.prompt([
           {
               type: "input",
               message: "What is the name of your item for bid?",
               name: "name"
           },
           {
               type: "input",
               message: "Please provide a description of this item.",
               name: "description"
           },
           {
               type: "input",
               message: "What is the minimum starting bid?",
               name: "bid"
           }
       ]).then(function(postResponse){
           console.log(postResponse);
           console.log("post response description is:"+postResponse.description);
           var query = 'INSERT INTO items (name, description, bid) VALUES (?, ?, ?);';
           console.log(query); 
           connection.query(query, [postResponse.name,postResponse.description,postResponse.bid], function(err,response){
                if(err) throw err;
                console.log(response);
                connection.end();
            });
       })
       
   }
});
*/

/*
function postItem(){
 //   var query="SELECT * FROM songs WHERE ? = ?";
   // var query = "SELECT * FROM items"
    var query = 'INSERT INTO items (name, description, bid) VALUES (?, ?, ?);';
    console.log(query);
   // console.log("inquirer description is:"+postResponse.description);
  /*  connection.query(query, [], function(err,response){
        if(err) throw err;
        console.log(response);
        connection.end();
    
    });
    */
/*    connection.query(query,[action,whowhat] ,function(err,response){
        if(err) throw err;
        console.log(response);
        connection.end();
    });
*/


