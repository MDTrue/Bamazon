
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "Bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(  "you are connected")
    display()
});

function display() {
    var queryString ="SELECT * FROM products"
    connection.query(queryString,function(err,res){
        if (err) throw err;

        var table = new Table({
            head: ["ID","Product Name", "Department Name","Cost","Product Sales","Quantity"],
            colWidths: [10,25,25,10,25,10]
        })
        for(var j = 0;j < res.length; j++){
            table.push(
                [res[j].item_id, res[j].product_name, res[j].department_name, res[j].price, res[j].product_sales, res[j].stock_quantity],
            )
        }
        console.log(table.toString());
        manageCustomer()
    })
}
function manageCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "What is the ID of the item that you would like to purchase?"
        },{
            type: "input",
            name: "purchase_quantity",
            message: "...and how many would you like to purchase?"
        }

    ]).then(function(answers){
        // console.log(answers.item_id),
        var purchase_item_id = (answers.item_id)-1
        // console.log(answers.purchase_quantity)
        var purchase_quantity = answers.purchase_quantity
        var queryString ="SELECT * FROM products"
        connection.query(queryString,function(err,res){
            
            if(purchase_quantity > res[purchase_item_id].stock_quantity){
                console.log("sorry not enough in stock, please select again");
                display()
            }else{
                console.log("yes I can complete that purchase for you")
                var purchase_cost =  (res[purchase_item_id].price * purchase_quantity).toFixed(2)
                connection.query("UPDATE products SET ? WHERE ?",[
                    {stock_quantity:(res[purchase_item_id].stock_quantity-purchase_quantity)},
                    {item_id: answers.item_id}
                ],function(err,data){
                
                    if (err) throw err;
                    console.log("your purchase order has been generated. Your account will be billed "+purchase_cost)
                    
                    display()
                })
                var current_sales =(res[purchase_item_id]).product_sales
                connection.query("UPDATE products SET ? WHERE ?",[
                    {product_sales: current_sales + purchase_cost},
                    {item_id: answers.item_id}
                ], function(err, res){
                    if (err) throw err;
                    console.log("sales updated")

                })
            }
        })

       
    })
}
