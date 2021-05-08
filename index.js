const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "Sowmya@2000.", 
    database: "employeedb"
});

conn.connect(function(err) {
    if(err) console.log(err);
    else console.log("Database connected");
});

//  set views file
app.set('views',path.join(__dirname,'views'));
			
// set view engine 
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM employee";
    let query = conn.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('employee_index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            employee : rows
        });
    });
});

app.get('/add',(req, res)=>{
    res.render('add_employee',{
        title:'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});

app.post('/save',(req, res)=>{
    let data= {Name:req.body.Name, EmpCode:req.body.EmpCode, Salary:req.body.Salary};
    let sql="INSERT INTO employee SET ?";
    let query= conn.query(sql,data,(err, results)=>{
        if(err)
            throw err;
        res.redirect('/');
    });
});

app.get('/edit/:EmpID',(req, res)=>{
    const empId = req.params.EmpID;
    let sql=`SELECT * from employee where EmpID= ${empId}`;
    let query= conn.query(sql,(err,result)=>{
        if(err) 
            throw err;
        res.render('employee_edit',{
            title:'CRUD Operation using NodeJS / ExpressJS / MySQL',
            employee: result[0]
        });
    });
});

app.post('/update',(req, res)=>{
    const id = req.body.EmpID;
    let sql=`update employee SET Name='${req.body.Name}', EmpCode='${req.body.EmpCode}', Salary='${req.body.Salary}' where EmpID=`+id;
    let query= conn.query(sql,(err,results)=>{
        if(err)
            throw err;
        res.redirect('/');
    });
});

app.get('/delete/:EmpID',(req,res)=>{
    const empId=req.params.EmpID;
    let sql=`DELETE  from employee where EmpID= ${empId}`;
    let query= conn.query(sql,(err, result)=>{
        if(err) 
            throw err;
        res.redirect('/');
        });
    });


//server listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});


