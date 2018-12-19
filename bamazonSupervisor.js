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
    displayDepts()
});

function displayDepts() {
    var queryString = "SELECT * FROM departments"
    connection.query(queryString, function (err, res) {
        if (err) throw err;
// console.log(res)
        var table = new Table({
            head: ["ID", "Department Name", "Overhead Cost"],
            colWidths: [10, 25, 10,]
        })
        for (var j = 0; j < res.length; j++) {
            table.push(
                [res[j].department_id, res[j].department_name, res[j].over_head_costs,]
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
            choices: ["View product sales by department","Create new department","Exit the application"]
        }
    ]).then(function(answer){
        switch (answer.supervisorOptions){
            case "View product sales by department":
            // console.log("view here");
            departmentDisplay()
            break;

            case "Create new department":
            newDept()
            // console.log("create here");
            break;

            case "Exit the application":
            console.log("Have a nice day");
            connection.end()
        }
    })
}
function departmentDisplay(){
    var queryString = "SELECT products.product_sales, departments.department_id, departments.department_name, departments.over_head_costs FROM departments RIGHT JOIN products ON products.department_name = departments.department_name GROUP BY departments.department_id"
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
        inventorySupervisor()
    })
}
function newDept(){
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What department would you like to add?"
        }

        
    ]).then(function(answers){
            connection.query("INSERT INTO departments SET ?",
            {
                department_name: answers.department_name,
                over_head_costs: 0,
                // product_name: "placeholder",
                // price: 0,
                // stock_quanitity: 0,
                // procuct_sales: 0,
            })
            displayDepts()
    })

}
