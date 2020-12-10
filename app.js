//import
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const usersSignup = [];

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

app.post("/sign-up", function (req, res) {
  let email = req.body.email;
  let pass = req.body.psw;
  console.log("new user");
  usersSignup.push({
    user: email,
    pass: pass,
  });

  res.redirect("/sign-in");
  console.log(usersSignup);
  var mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Sign up to CS site",
    text: "That was easy!2",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
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
