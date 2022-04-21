//const { Template } = require("ejs");
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const morgan = require("morgan");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { gererateRandomString, getUserByEmail, urlsForUser } = require("./helpers");
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(methodOverride('_method'));
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

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
    password: bcrypt.hashSync("123456", 10)
  },
  "gjJ5yh": {
    id: "gjJ5yh",
    email: "user@example2.com",
    password: bcrypt.hashSync("987654", 10)
  }
};



app.get("/", (req, res) => {
  res.send("Whatup Fam");
});

app.get("/urls", (req, res) => {
  let URLsToTemplate = urlDatabase;
  // if (req.cookies.user_id !== undefined) {
  //   URLsToTemplate = urlsForUser(users[req.cookies.user_id].id);
  // }
  if (req.session.userIdCookie !== undefined) {
    URLsToTemplate = urlsForUser(users[req.session.userIdCookie].id, urlDatabase);
  }
  for (const url in URLsToTemplate.authorized) {
    console.log(url);
  }

  const templateVars = {
    //id: req.cookies.user_id ,
    //"user": users[req.cookies.user_id],
    id: req.session.userIdCookie ,
    "user": users[req.session.userIdCookie],
    urls: URLsToTemplate
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  const templateVars = {
    //id: req.cookies.user_id ,
    //"user": users[req.cookies.user_id],
    //id: req.session.userIdCookie ,
    "user": users[req.session.userIdCookie],
  };
  //if (req.cookies["user_id"]) {
  if (req.session.userIdCookie) {
    res.render("urls_new", templateVars);
  } else res.redirect("/login");
});


app.get("/urls/:shortURl", (req, res) => {
  const templateVars = {
    //id: req.cookies.user_id ,
    //"user": users[req.cookies.user_id],
    //id: req.session.userIdCookie ,
    "user": users[req.session.userIdCookie],
    shortURL: req.params.shortURl,
    longURL: urlDatabase[req.params.shortURl].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    //id: req.cookies.user_id ,
    //"user": users[req.cookies.user_id],
    //id: req.session.userIdCookie ,
    "user": users[req.session.userIdCookie],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    //id: req.cookies.user_id,
    //"user": users[req.cookies.user_id],
    //id: req.session.userIdCookie,
    "user": users[req.session.userIdCookie],
  };
  res.render("urls_login", templateVars);
});

app.get("/u/:shortURl", (req ,res) => {
  const longURL = urlDatabase[req.params.shortURl].longURL;
  res.redirect(longURL);
});

app.delete("/urls/:shortURl", (req, res) => {
  if (urlDatabase[req.params.shortURl].userID === req.session.userIdCookie) {
    delete urlDatabase[req.params.shortURl];
  }
  res.redirect('/urls');
});

app.put("/urls/:shortURl", (req, res) => {

  //if (urlDatabase[req.params.shortURl].userID === req.cookies.user_id) {
  if (urlDatabase[req.params.shortURl].userID === req.session.userIdCookie) {
    urlDatabase[req.params.shortURl].longURL = req.body.newLongURL;
  }
  res.redirect('/urls');
});

app.post("/urls_new", (req, res) => {
  const randomChars = gererateRandomString(6, true);
  urlDatabase[randomChars] = {
    longURL: req.body.longURL,
    //userID: req.cookies.user_id
    userID: req.session.userIdCookie
  };
  //console.log(urlDatabase);
  res.redirect(`/urls/${randomChars}`);
});
  
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (user === false) {
    return res.status(403).send("<html><h3>403 error, Email not found</h3></html>");
  } if (!bcrypt.compareSync(req.body.password, users[user].password)) {
    return res.status(403).send("<html><h3>403 error, password incorrect</h3></html>");
  } //if (users[user].password === req.body.password) {
  if (bcrypt.compareSync(req.body.password, users[user].password)) {
    console.log("Yes passwords matched");
    //res.cookie('user_id', users[user].id);
    req.session.userIdCookie = users[user].id;
    res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  //res.clearCookie('user_id');
  req.session = null;
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("<html><h3>400 error, missing field</h3></html>");
  }
  if (getUserByEmail(req.body.email, users) !== false) {
    return res.status(400).send("<html><h3>400 error, email already exists</h3></html>");
  }
  const randomChars = gererateRandomString(4, false);
  users[randomChars] = {
    id: randomChars,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  };
  //console.log(users);
  //res.cookie('user_id', users[randomChars].id);
  req.session.userIdCookie = users[randomChars].id;
  res.redirect(`/urls`);
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//<!--<% if(user.id === urls[url].userID) { %> -->

//IS THIS NEEDED?***********
// app.post("/urls/:shortURl/editButton", (req, res) => {
//   res.redirect(`/urls/${req.params.shortURl}`);
// });
