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
    console.log("you are connected")
    inventoryManager()
});

function display() {
    var queryString = "SELECT * FROM products"
    connection.query(queryString, function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product Name", "Department Name", "Cost", "Quantity"],
            colWidths: [10, 25, 25, 10, 10]
        })
        for (var j = 0; j < res.length; j++) {
            table.push(
                [res[j].item_id, res[j].product_name, res[j].department_name, res[j].price, res[j].stock_quantity],
            )
        }
        console.log(table.toString());
        inventoryManager()
    })
}
function inventoryManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "managerOptions",
            message: "What would you like to do",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Stock a new product"]
        }
    ]).then(function (answer) {
        switch (answer.managerOptions) {
            case "View products for sale":
                // console.log("youre in")
                display();
                break;

            case "View low inventory":
                viewLow();
                break;

            case "Add to inventory":
                addInventory();
                break;

            case "Stock a new product":
                addProduct();
                break;
        }
    })
}

function viewLow() {
    var queryString = "SELECT * FROM products"
    connection.query(queryString, function (err, res) {
        if (err) throw err;
        for (j = 0; j < res.length; j++) {
            if (res[j].stock_quantity < 5) {
                console.log(
                    res[j].product_name, res[j].stock_quantity
                )
            }
        }

        inventoryManager()
    })
}
function addInventory() {
    var queryString = "SELECT * FROM products"
    connection.query(queryString, function (err, res) {
        var choices = [];
        for (j = 0; j < res.length; j++) {
            choices.push(res[j].product_name)
        }
   
    inquirer.prompt([
        {
            type: "list",
            name: "stock_refill",
            choices: choices,
            message: "What product would you like to refill?"
            
        }, {
            type: "input",
            name: "refill_amount",
            message: "How much would you like to add?"
            
        }
    ]).then(function (answers) {
        var remaining_inventory
        for (j = 0; j < res.length; j++){
            if(res[j].product_name === answers.stock_refill){
                remaining_inventory = res[j].stock_quantity;  
            }
        }
        connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: remaining_inventory + parseInt(answers.refill_amount)
        }, {
            product_name: answers.stock_refill
        }],
        function (err, res) {
            console.log("inventory added")
            display()
        })
    })
})
}
function addProduct(){
    inquirer.prompt([
        {
            type:"input",
            name: "product_name",
            message: "What product would you like to add?"
        },{
            type: "input",
            name: "department_name",
            message: "What category shoule I file that under"
        },{
            type: "input",
            name: "price",
            message: "How much would you like to charge?"
        },{
            type: "input",
            name: "stock_quantity",
            message: "How many would you like to put into stock"
        }
    ]).then (function(answers){
        connection.query("INSERT INTO products SET ?",
        {
            product_name: answers.product_name,
            department_name: answers.department_name,
            price: answers.price,
            stock_quantity: parseInt(answers.stock_quantity)
        })
        display()
    })
}
