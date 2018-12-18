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
    display()
});

function display() {
    var queryString = "SELECT * FROM products"
    connection.query(queryString, function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product Name", "Department Name", "Cost", "Product Sales", "Quantity"],
            colWidths: [10, 25, 25, 10, 20, 10]
        })
        for (var j = 0; j < res.length; j++) {
            table.push(
                [res[j].item_id, res[j].product_name, res[j].department_name, res[j].price,res[j].product_sales, res[j].stock_quantity],
            )
        }
        console.log(table.toString());
        inventorySupervisor()
    })
}
function inventorySupervisor(){
    inquirer.prompt([
        {
            type: "list",
            name: "supervisorOptions",
            message: "What would you like to do?",
            choices: ["View product sales by department","Create new department"]
        }
    ]).then(function(answer){
        switch (answer.supervisorOptions){
            case "View product sales by department":
            // console.log("view here");
            departmentDisplay()
            break;

            case "Create new department":
            console.log("create here");
            break;
        }
    })
}
function departmentDisplay(){
    var queryString = "SELECT products.product_sales, departments.department_id, departments.department_name, departments.over_head_costs FROM departments RIGHT JOIN products ON products.department_name = departments.department_name"
    connection.query(queryString,function(err,res){
        if(err)throw err;
        // console.log("res",res)
        var table = new Table({
            head: ["dept ID","dept Name","overhead","product sales","total profit"],
            colWidths: [20,20,12,20,20]
        })
        for(var j = 0; j<res.length; j++){
            table.push(
                [res[j].department_id, res[j].department_name, res[j].over_head_costs, res[j].product_sales,(res[j].product_sales - res[j].over_head_costs)]
            )
        }
        console.log(table.toString());
    })
}
