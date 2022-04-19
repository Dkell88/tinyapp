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

const gererateRandomString = function() {
  let result = '';
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 6; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Whatup Fam");
});

app.get("/urls/new", (req,res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURl", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
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
  const randomChars = gererateRandomString();
  urlDatabase[randomChars] = req.body.longURL;
  console.log("The short Url created is: ", randomChars);
  res.redirect(`/urls/${randomChars}`);
});
  
app.post("/login", (req, res) => {
  console.log("The short Url created is: ", req.body.username);
  res.cookie('username', req.body.username);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  console.log("Logout button pressed");
  res.clearCookie('username');
  res.redirect(`/urls`);
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


// app.get("/hello", (req,res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });