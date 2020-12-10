//global var to check password conditions
var FLAGS = [false, false, false, false, false];
//global array for correct error message
var errors = [
  "Atleast one small char",
  "Atleast one capital char",
  "Atleast one number",
  "Atleast one special char",
  "Atleast 6 chars",
];
function validFunc() {
  var myInput = document.getElementById("Password");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var spechar = document.getElementById("spechar");
  var length = document.getElementById("length");

  //Display message box
  document.getElementById("message").style.display = "block";

  // When the user clicks outside of the password field, hide the message box
  myInput.onblur = function () {
    document.getElementById("message").style.display = "none";
  };

  // When the user starts to type something inside the password field
  myInput.onkeyup = function () {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
      FLAGS[0] = true;
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
      FLAGS[1] = true;
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
      FLAGS[2] = true;
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= 6) {
      length.classList.remove("invalid");
      length.classList.add("valid");
      FLAGS[3] = true;
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
    // Validate Special Char
    var specialChar = /[!,@,#,$,%,^,&,*]/g;
    if (myInput.value.match(specialChar)) {
      spechar.classList.remove("invalid");
      spechar.classList.add("valid");
      FLAGS[4] = true;
    } else {
      spechar.classList.remove("valid");
      spechar.classList.add("invalid");
    }
  };
}
// Check for valid pass and print alert accordingly
function alerts() {
  var cnt = 0;
  var i;
  var errorMsg = "";
  for (i = 0; i < FLAGS.length; i++) {
    if (FLAGS[i]) {
      cnt++;
    } else {
      errorMsg += "\n" + errors[i];
    }
  }
  if (cnt != 5) {
    return errorMsg;
  }
}
// Sign Up funcs
function displayForm() {
  var email = document.getElementById("email").value;
  var pass = document.getElementById("Password").value;
  var pass2 = document.getElementById("RePassword").value;
  if (pass != pass2) {
    document.getElementById("MBody").innerHTML = "Passwords Does Not Match!";
  }
  document.getElementById("MBody").innerHTML =
    "Email: " + email + "<br>password: " + pass;
}

// Contact Us Funcs
function verifyContact() {
  var subject = document.getElementById("selectSubject").value;
  var fromEmail = document.getElementById("email").value;
  var fromName = document.getElementById("name").value;
  var msg = document.getElementById("freeText").value;
  var body = "";
  body += "From: " + fromName + " -> " + fromEmail + "%0AMessage:%0A" + msg;
  var mailto = "mailto:test@test.com?subject=" + subject + "&body=" + body;
  window.open(mailto);
}
