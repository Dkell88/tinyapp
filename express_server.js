//const { Template } = require("ejs");
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const morgan = require("morgan");
app.use(morgan('dev'));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const gererateRandomString = function(length, alphaNum) {
  let result = '';
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (!alphaNum) {
    chars = chars.slice(52);
  }
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const checkEmails = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return user;
    }
  }
  return false;
};

app.get("/", (req, res) => {
  res.send("Whatup Fam");
});

app.get("/urls/new", (req,res) => {
  const templateVars = {
    "user_id": req.cookies["user_id"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    "user_id": req.cookies["user_id"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURl", (req, res) => {
  const templateVars = {
    "user_id": req.cookies["user_id"],
    shortURL: req.params.shortURl,
    longURL: urlDatabase[req.params.shortURl]
  };
  console.log("(40) The short URL in url/:shortURl; ", req.params.shortURl);
  console.log("(41) These are the temp vars in url/:shortURl; ", templateVars);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURl", (req ,res) => {
  const longURL = urlDatabase[req.params.shortURl];
  res.redirect(longURL);
});



app.get("/register", (req, res) => {
  const templateVars = {
    "user_id": req.cookies["user_id"],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    "user_id": req.cookies["user_id"],
  };
  res.render("urls_login", templateVars);
});




app.post("/urls/:shortURl/delete", (req, res) => {
  delete urlDatabase[req.params.shortURl];
  res.redirect('/urls');
});

app.post("/urls/:shortURl/editButton", (req, res) => {
  console.log("(56) The short url for edit button post is:",req.params.shortURl);
  res.redirect(`/urls/${req.params.shortURl}`);
});

app.post("/urls/:shortURl/edit", (req, res) => {
  console.log("(61) The short url for edit post is:",req.params.shortURl);
  console.log("(61) The new long url for edit post is:",req.body.newLongURL);
  urlDatabase[req.params.shortURl] = req.body.newLongURL;
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const randomChars = gererateRandomString(6, true);
  urlDatabase[randomChars] = req.body.longURL;
  console.log("The short Url created is: ", randomChars);
  res.redirect(`/urls/${randomChars}`);
});
  
app.post("/login", (req, res) => {
  console.log("The login post");
  console.log("The login email", req.body.email);
  console.log("The login password", req.body.password);
  const user = checkEmails(req.body.email);
  if (user === false) {
    res.send("403 error, Email not found");
  } else if (users[user].password !== req.body.password) {
    res.send("403 error, password incorrect");
  } else if (users[user].password === req.body.password) {
    res.cookie('user_id', users[user].email);
    res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  console.log("Logout button pressed");
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.send("400 error, missing field");
    return;
  }
  console.log(checkEmails(req.body.email));
  if (checkEmails(req.body.email) !== false) {
    res.send("400 error, email already exists");
    return;
  }
  const randomChars = gererateRandomString(4, false);
  users[randomChars] = {
    id: randomChars,
    email: req.body.email,
    password: req.body.password
  };
  console.log(users);
  res.cookie('user_id', users[randomChars].email);
  res.redirect(`/urls`);
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

