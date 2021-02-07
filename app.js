var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 5555;
const usersSignup = [];
const { Client } = require("pg");
//Configure encryption
const encryption = require("./encryption");

//Create static files
app.use(express.static(__dirname));

// Sql Database set-up
conn =
  process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/users";

const con = new Client({
  connectionString: conn,
  ssl: process.env.DATABASE_URL ? true : false,
});

con
  .connect()
  .then(() => console.log("Connected"))
  .then(() =>
    con.query(
      "CREATE TABLE IF NOT EXISTS users (ID INT,Name VARCHAR(45),FamilyName VARCHAR(45),Email VARCHAR(45),PromoCode VARCHAR(45),Country VARCHAR(45) NULL,City VARCHAR(45) NULL,Street VARCHAR(45) NULL,ZipCode VARCHAR(45) NULL,Password VARCHAR(256) NULL,Spare1 VARCHAR(45) NULL,Spare2 VARCHAR(45) NULL,Spare3 INT NULL,Spare INT NULL)"
    )
  );
con.query(
  "CREATE TABLE IF NOT EXISTS promocode (ID INT UNIQUE,PromoCode VARCHAR(45) DEFAULT '',Description VARCHAR(45) DEFAULT '')"
);
var text = "insert into promocode (ID,PromoCode,Description) values($1,$2,$3)";
var valu = ["1", "3XCRt", "10% discount"];
var valu1 = ["2", "4DFG", "My desc."];
var valu2 = ["3", "6DSQW", "My new description"];
con.query(text, valu, (err, res) => {
  if (err) console.log(err);
});
con.query(text, valu1, (err, res) => {
  if (err) console.log(err);
});
con.query(text, valu2, (err, res) => {
  if (err) console.log(err);
});

// Create file routing
app.get("/", (req, res) => {
  res.redirect("/sign-in");
});
app.get("/sign-in", (req, res) => {
  res.sendFile(__dirname + "/html/login.html");
});

app.get("/sign-up", (req, res) => {
  res.sendFile(__dirname + "/html/signup.html");
});
app.get("/reset-password", (req, res) => {
  res.sendFile(__dirname + "/html/reset.html");
});
app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/dash.html");
});

app.post("/sign-in", async function (req, resol) {
  let email = req.body.email;
  let pass = req.body.psw;
  ////////////////////////
  console.log(email + " " + pass);
  var text = "select password from users where Email=$1";
  var r = [email];
  await con.query(text, r, (err, res) => {
    if (res.rows.length == 0) {
      resol.send("No such user exists");
    } else {
      if (pass == encryption.decrypt(res.query.password)) console.log("HERE");
      resol.redirect("/sign-up");
    }
  });
});
/////////////////////////

app.post("/sign-up", function (req, res) {
  console.log(req.body);
  var Fname = req.body.firstName;
  var Lname = req.body.lastName;
  var pass = req.body.Password;
  var email = req.body.email;
  var pCode = req.body.promoCode;
  var encPass = encryption.encrypt(pass);

  con.query("select * from users where email=$1", [email], (err, res) => {
    var result = JSON.stringify(res.rows[1]);
    if (result != null) {
      console.log("User exists");
    } else {
      con.query(
        "INSERT INTO users (Name,FamilyName,Email,PromoCode,Password) values($1,$2,$3,$4,$5)",
        [Fname, Lname, email, pCode, encPass]
      );
    }
  });
  console.log(Fname + " " + Lname + " " + email + " " + encPass + " " + pCode);
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
  console.log(`listening on port ${process.env.DATABASE_URL}:${port}/`)
);
