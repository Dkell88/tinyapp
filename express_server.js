//const { Template } = require("ejs");
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const morgan = require("morgan");
app.use(morgan('dev'));

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
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURl", (req, res) => {
  const templateVars = { shortURL: req.params.shortURl, longURL: urlDatabase[req.params.shortURl] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const randomChars = gererateRandomString();
  urlDatabase[randomChars] = req.body.longURL;
  res.redirect(`/urls/${randomChars}`);
});

app.post("/urls/:shortURl/delete", (req, res) => {
  delete urlDatabase[req.params.shortURl];
  res.redirect('/urls');
});

app.get("/u/:shortURl", (req ,res) => {
  const longURL = urlDatabase[req.params.shortURl];
  res.redirect(longURL);
});




app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


// app.get("/hello", (req,res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });