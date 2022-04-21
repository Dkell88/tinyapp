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
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ481W"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "aJ481W"
  },
  "8TmxF4": {
    longURL: "http://www.facebook.com",
    userID: "s5hhdg"
  }
};

const users = {
  "aJ481W": {
    id: "aJ481W",
    email: "user@example.com",
    password: "123456"
  },

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

const urlsForUser = function(id) {
  let returnedURLs = {
    authorized: {},
    unauthorized: {}
  };
  console.log("ID: ", id);
  for (const URL in urlDatabase) {
    console.log("Id within for loop: ",urlDatabase[URL].userID);
    if (urlDatabase[URL].userID === id) {
      returnedURLs.authorized[URL] = urlDatabase[URL];
    } else returnedURLs.unauthorized[URL] = urlDatabase[URL];
  }
  console.log("Returned URLs");
  console.log(returnedURLs);
  return returnedURLs;
};

app.get("/", (req, res) => {
  res.send("Whatup Fam");
});

app.get("/urls", (req, res) => {
  let URLsToTemplate = urlDatabase;
  if (req.cookies.user_id !== undefined) {
    URLsToTemplate = urlsForUser(users[req.cookies.user_id].id);
  }
  for (const url in URLsToTemplate.authorized) {
    console.log(url);
  }

  const templateVars = {
    id: req.cookies.user_id ,
    "user": users[req.cookies.user_id],
    urls: URLsToTemplate
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  const templateVars = {
    id: req.cookies.user_id ,
    "user": users[req.cookies.user_id]
  };
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  } else res.redirect("/login");
});


app.get("/urls/:shortURl", (req, res) => {
  const templateVars = {
    id: req.cookies.user_id ,
    "user": users[req.cookies.user_id],
    shortURL: req.params.shortURl,
    longURL: urlDatabase[req.params.shortURl].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    id: req.cookies.user_id ,
    "user": users[req.cookies.user_id],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    id: req.cookies.user_id,
    "user": users[req.cookies.user_id],
  };
  res.render("urls_login", templateVars);
});

app.get("/u/:shortURl", (req ,res) => {
  const longURL = urlDatabase[req.params.shortURl].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURl/delete", (req, res) => {
  console.log("Delete url, user: ", req.cookies.user_id);
  console.log("Delete url, user permitted: ", urlDatabase[req.params.shortURl].userID);
  if (urlDatabase[req.params.shortURl].userID === req.cookies.user_id) {
    console.log("Delete url, " + req.cookies.user_id + "can delete the file");
    delete urlDatabase[req.params.shortURl];
  }
  res.redirect('/urls');
});

app.post("/urls/:shortURl/editButton", (req, res) => {
  res.redirect(`/urls/${req.params.shortURl}`);
});

app.post("/urls/:shortURl/edit", (req, res) => {
  console.log("Edit url, user: ", req.cookies.user_id);
  console.log("Edit url, user permitted: ", urlDatabase[req.params.shortURl].userID);
  if (urlDatabase[req.params.shortURl].userID === req.cookies.user_id) {
    console.log("Edit url, Yes " + req.cookies.user_id + " can edit");
    urlDatabase[req.params.shortURl].longURL = req.body.newLongURL;
  }
  res.redirect('/urls');
});

app.post("/urls_new", (req, res) => {
  const randomChars = gererateRandomString(6, true);
  urlDatabase[randomChars] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };
  //console.log(urlDatabase);
  res.redirect(`/urls/${randomChars}`);
});
  
app.post("/login", (req, res) => {
  const user = checkEmails(req.body.email);
  if (user === false) {
    return res.status(403).send("<html><h3>403 error, Email not found</h3></html>");
  } if (users[user].password !== req.body.password) {
    return res.status(403).send("<html><h3>403 error, password incorrect</h3></html>");
  } if (users[user].password === req.body.password) {
    res.cookie('user_id', users[user].id);
    res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("<html><h3>400 error, missing field</h3></html>");
  }
  if (checkEmails(req.body.email) !== false) {
    return res.status(400).send("<html><h3>400 error, email already exists</h3></html>");
  }
  const randomChars = gererateRandomString(4, false);
  users[randomChars] = {
    id: randomChars,
    email: req.body.email,
    password: req.body.password
  };
  //console.log(users);
  res.cookie('user_id', users[randomChars].id);
  res.redirect(`/urls`);
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//<!--<% if(user.id === urls[url].userID) { %> -->
