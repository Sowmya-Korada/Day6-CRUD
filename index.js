const mysql = require("mysql");
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');

var app = express();

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sowmya@2000.',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine','ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));


app.listen(3000, () => console.log('Express server is running at port no : 3000'));

//get all employees
app.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err)
            res.render('employee_index',{
                title : 'CRUD Operation using NodeJS / Express / MySQL',
                employee : rows
            });
        else
            console.log(err);
            
    })
});

app.get('/add',(req,res) => {
    //res.send('new form creation')
    res.render('add_employee',{
     title : 'CRUD Operation using NodeJS / Express / MySQL'
   });
 });

app.post('/save',(req,res) => {
    let data = {EmpID:req.body.id ,Name: req.body.name, EmpCode: req.body.text, Salary: req.body.salary};
    let sql = "INSERT INTO employee SET ?";
    let query = mysqlconnection.query(sql,data,(err,results) =>{
        if(err) throw err;
        res.redirect('/')
    });
});

app.get('/edit/:EmpID',(req,res)=>{
    const ID = req.params.EmpID;
    console.log(ID)
    let sql = `Select * from employee where EmpID = ${ID}`;
    let query = mysqlconnection.query(sql,(err,result) => {
        if(err) throw err;
        res.render('employee_edit',{
            title: 'CRUD Operation using NodeJs / ExpressJs / MySQL',
            employee: result[0]
        })
    })
})

app.post('/update',(req,res) => {
    const ID = req.body.id;
    let sql = "update employee SET Name='"+req.body.name+"',  EmpCode='"+req.body.text+"',  Salary='"+req.body.salary+"' where EmpID ="+ID;
    let query = mysqlconnection.query(sql,(err,results) =>{
        if(err) throw err;
        res.redirect('/')
    });
});

app.get('/delete/:EmpID',(req,res)=>{
    const ID = req.params.EmpID;
    let sql = `DELETE from employee where EmpID = ${ID}`;
    let query = mysqlconnection.query(sql,(err,result) => {
        if(err) throw err;
        res.redirect('/')
    })
})



