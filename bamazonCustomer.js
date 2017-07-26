// Require mySQL node package
var mysql = require('mysql');

// Link to mySQL DB
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Wildcat32!',
    database: 'Bamazon'
});

// Connect to DB
connection.connect(function(err) {
        if (err) throw err;
        console.log("connected as id" + connection.threadId);

// Display all items from DB and throw error if necessary 
connection.query("SELECT * FROM products", function(err, res) {
     if (err) throw err;
     console.log(res);
 });
    });

// Show User message
console.log('Check out our selection...\n');

// Set up table header
console.log('  ID  |      Product Name      |  Department Name  |   Price  | In Stock');
console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')

// Loop through DB and show items
for(var i = 0; i < res.length; i++){

// convert ID to string
var item_id = res[i].item_id + ''; 
item_id = padText("  ID  ", item_id);
// convert product name to string
var product_name = res[i].product_name + '';
product_name = padText("      Product Name      ", product_name);
// convert department name to string
var department_name = res[i].department_name + '';
department_name = padText("  Department Name  ", department_name);
// convert price to string
var price = '$' + res[i].price.toFixed(2) + '';
price = padText("   Price  ", price);
// convert stock quantity to string
var stock_quantity = res[i].stock_quantity + '';
// Log table entry
console.log(item_id + '|' + product_name + '|' + department_name + '|' + price + '|    ' + stock_quantity);
};  

// After the table is shown, ask the user to buy something
prompt.start();
console.log('\nWhich item do you want to buy?');
prompt.get(['buyItemID'], function (err, result) {
    
// Show Item ID selected
var buyItemID = result.buyItemID;
console.log('You selected Item # ' + buyItemID + '.');

// Ask for quantity after item selected
console.log('\nHow many do you wish to buy?')
prompt.get(['buyItemQuantity'], function (err, result) {

// Show quantity selected
var buyItemQuantity = result.buyItemQuantity;
console.log('You selected to buy ' + buyItemQuantity + ' of these.');

// Once the customer has placed the order, check if store has enough of the product to meet the request
connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
if(err) throw err; // Error Handler
        
// Check if the item Id was valid (i.e. something was returned from mySQL)
if(res[0] == undefined){
console.log('Sorry... We found no items with Item ID "' +  buyItemID + '"');
connection.end();
}
// Compare inventory for Valid Item ID
else{
var bamazonQuantity = res[0].StockQuantity;
// Update DB with reduced inventory if inventory is available
if(bamazonQuantity >= buyItemQuantity){
var newInventory = parseInt(bamazonQuantity) - parseInt(buyItemQuantity); // ensure we have integers for subtraction & database
connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: newInventory}, {ItemID: buyItemID}], function(err, res){
if(err) throw err;
}); 


// Portray user purchase total 
var customerTotal;
connection.query('SELECT Price FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
              
var buyItemPrice = res[0].Price;
customerTotal = buyItemQuantity*buyItemPrice.toFixed(2);
console.log('\nYour total is $' + customerTotal + '.');

// Purchase item department
connection.query('SELECT DepartmentName FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
var itemDepartment = res[0].DepartmentName;
                
// Department revenue
connection.query('SELECT TotalSales FROM Departments WHERE ?', [{DepartmentName: itemDepartment}], function(err, res){
var totalSales = res[0].TotalSales;
var totalSales = parseFloat(totalSales) + parseFloat(customerTotal);

connection.query('UPDATE Departments SET ? WHERE ?', [{TotalSales: totalSales}, {DepartmentName: itemDepartment}], function(err, res){
if(err) throw err;
console.log('Transaction Completed. Thank you!')
connection.end();
                });
            });
        }); 
    }); 
}

// Insufficient inventory
else{
    console.log('Sorry... We only have ' +  bamazonQuantity + ' of those items. Order cancelled.');
    connection.end(); 
}
    }
}); 

    });
  }); 
};