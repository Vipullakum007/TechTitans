const express = require('express');
const bodyParser = require('body-parser');
const body = require("body-parser")
const fs = require('fs');
const path = require("path")
const compiler = require("compilex")
const conn = require('./db');
const options = { stats: true }
compiler.init(options)

const app = express();
const port = 8000;
app.use(body.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/codemirror-5.65.16", express.static("codemirror-5.65.16"))
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get("/",function(req,res){
const fpath=path.join(__dirname,'index.html')
res.sendFile(fpath)
}) 
//Signup
app.get("/signup", function (req, res) {
    compiler.flush(function () {
        console.log("sign up page")
    })
    const filePath = path.join(__dirname, 'signup.html');
    res.sendFile(filePath)

})

app.post("/sighup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    conn.query("INSERT INTO user (username, password) VALUES (?, ?)", [username, password], (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            res.status(500).send("Error signing up");
        } else {
            res.redirect('/');
        }
    });

})
// login
app.get("/login", function (req, res) {
    //debug
    compiler.flush(function () {
        console.log("login page")
    })
    const filePath = path.join(__dirname, 'login.html');
    res.sendFile(filePath)

})

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    conn.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).send("Error logging in");
        } else if (results.length === 0) {
            res.status(401).send("Invalid username or password");
        } else {
            res.redirect('/');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});