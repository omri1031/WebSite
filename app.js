//import
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const usersSignup = [];

// SQL setup
var mysql = require("mysql");
var DBhost = "localhost";
var DBuser = "root";
var DBpassword = "";
var DBdatabase = "userDB";

// Sql connection
var con = mysql.createConnection({
  host: DBhost,
  user: DBuser,
  password: DBpassword,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS userDB", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
  var sql =
    "CREATE TABLE IF NOT EXISTS userDB.users (ID INT,Name VARCHAR(45),FamilyName VARCHAR(45),Email VARCHAR(45),PromoCode VARCHAR(45),Country VARCHAR(45) NULL,City VARCHAR(45) NULL,Street VARCHAR(45) NULL,ZipCode VARCHAR(45) NULL,Password VARCHAR(45) NULL,Spare1 VARCHAR(45) NULL,Spare2 VARCHAR(45) NULL,Spare3 INT NULL,Spare INT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

//Create static files
app.use(express.static(__dirname));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Create file routing
app.get("/sign-in", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/sign-up", (req, res) => {
  res.sendFile(__dirname + "/signUp.html");
});
app.get("/reset-password", (req, res) => {
  res.sendFile(__dirname + "/reset.html");
});
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/dash.html");
});

app.post("/sign-in", function (req, res) {
  let email = req.body.email;
  let pass = req.body.psw;
  index = usersSignup.findIndex((x) => x.user === email && x.pass === pass);
  if (index != -1) {
    if (email == "Admin@g.com" && pass == "Admin") {
      res.redirect("/contact");
    }
    res.send(
      `Welcome!` + JSON.stringify(email) + "Password:" + JSON.stringify(pass)
    );
    console.log("Hello");
  } else {
    res.send("User not found");
    console.log("User not found");
  }
});
app.use(express.json());
app.use(express.urlencoded());

app.post("/sign-up", function (req, res) {
  var Fname = req.body.firstName;
  var Lname = req.body.lastName;
  var pass = req.body.Password;
  var email = req.body.email;
  var pCode = req.body.promoCode;
  console.log(req.body);

  con.connect(function (err) {
    console.log("Connected from signup post!");
    con.query(
      "SELECT * FROM userDB.users WHERE email='" + email + "'",
      function (err, result) {
        if (err) throw err;
        console.log(result.length);
        if (result.length == 0) {
          var sql =
            "INSERT INTO userDB.users ('Name','FamilyName','Email','Password','PromoCode') VALUES ('" +
            Fname +
            "','" +
            Lname +
            "','" +
            email +
            "',SHA1('" +
            pass +
            "'),'" +
            pCode +
            "')";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
        }
      }
    );
  });
  res.redirect("/sign-in");
  console.log(usersSignup);
  var mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Sign up to CS site",
    text: "That was easy!2",
  };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });
});
app.get("/api/users", function (req, res) {
  var user_id = req.param("id");
  var token = req.param("token");
  var geo = req.param("geo");
  res.send(user_id + " " + token + " " + geo);
});
app.post("/api/users", function (req, res) {
  var user_id = req.body.id;
  var token = req.body.token;
  var geo = req.body.geo;
  res.send(user_id + " " + token + " " + geo);
});

// Node mailer
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "omric12@gmail.com",
    pass: "nmrt esqs slwq elav",
  },
});

// End node mailer

app.listen(port, () =>
  console.log(`listening on port http://www.localhost:${port}/`)
);
