const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/secrets');
const TrySchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "thisisourlittlesecret.";
TrySchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const item1 = mongoose.model('passwords', TrySchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.post("/register", function (req, res) {
    const newUser = new item1({
        email: req.body.username,
        password: req.body.password
    });


    newUser.save().then(function () {
        res.redirect('login');
    }).catch(function (err) {
        console.log(err);
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    item1.findOne({ email: username }).then(function (foundUser) {
        if (foundUser) {
            if (foundUser.password === password) {
                res.redirect('list');
            }
        }
    }).catch(function (err) {
        console.log(err);
    }); 
});



app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});


const todolist = new mongoose.Schema({
    name: String
});


const item = mongoose.model('task',todolist);
const todo = new item({
    name:"Create some videos"
});

const todo2 = new item({
    name:"Learn DSA"
});

const todo3 = new item({
    name:"Learn React"
});

const todo4 = new item({
    name:"Take rest"
});

//todo.save();
//todo2.save();
//todo3.save();
//todo4.save();

app.get("/list",function(req,res){
    
    item.find({}).then(function(foundItems){  
        res.render("list",{dayej : foundItems});
    });
});

app.post("/list",function(req,res){
    const itemName = req.body.ele1;
    const todo5 = new item ({
        name:itemName
    });
    todo5.save();
    res.redirect("/list"); 
});

app.post("/delete",function(req,res){
    const checked = req.body.checkbox;

    item.findByIdAndRemove(checked).then(function(){
        console.log("Task Deleted Successfully");
        res.redirect("/list");
    });
});

app.listen(3000, function () {
    console.log('Server started.');
});
