const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const { gererateRandomString, getUserByEmail, urlsForUser } = require("./helpers");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//-------------------- Define "Database" values --------------------//
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

//-------------------- GET Method Calls --------------------//
app.get("/urls", (req, res) => {
  let user = "none";
  //If the cookie of user ID (not undefined) exists then use it as the user name
  if (req.session.userIdCookie !== undefined) user = users[req.session.userIdCookie].id;
  //Determine what URLs are displayed, determine is the user has read or write permission
  const URLsToTemplate = urlsForUser(user, urlDatabase);
  const templateVars = {
    user: users[req.session.userIdCookie],
    urls: URLsToTemplate
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  const templateVars = {
    user: users[req.session.userIdCookie],
  };
  //If there is a user logged in then display the new url temptate if not redirect to the login page
  if (req.session.userIdCookie) {
    res.render("urls_new", templateVars);
  } else res.redirect("/login");
});

app.get("/urls/:shortURl", (req, res) => {
  const templateVars = {
    user: users[req.session.userIdCookie],
    shortURL: req.params.shortURl,
    longURL: urlDatabase[req.params.shortURl].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userIdCookie],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userIdCookie],
  };
  res.render("urls_login", templateVars);
});

//-------------------- POST Method Calls --------------------//
app.post("/urls_new", (req, res) => {
  const randomChars = gererateRandomString(6, true);
  urlDatabase[randomChars] = {
    longURL: req.body.longURL,
    userID: req.session.userIdCookie
  };
  res.redirect(`/urls/${randomChars}`);
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  //If the getUserByEmail returns false then the email isn't registered
  if (user === false) {
    return res.status(403).send("<html><h3>403 uthentication error, please check email and password were entered correctly*</h3></html>");
  //Password is incorrect
  } if (!bcrypt.compareSync(req.body.password, users[user].password)) {
    return res.status(403).send("<html><h3>403 error, authentication error, please check email and password were entered correctly</h3></html>");
  }
  //Password is correct
  if (bcrypt.compareSync(req.body.password, users[user].password)) {
    req.session.userIdCookie = users[user].id;
    res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  //Was the password and email feild filled?
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("<html><h3>400 error, missing field</h3></html>");
  }
  //Check to see if the email already exists
  if (getUserByEmail(req.body.email, users) !== false) {
    return res.status(400).send("<html><h3>400 error, email already exists</h3></html>");
  }
  const randomChars = gererateRandomString(6, true);
  users[randomChars] = {
    id: randomChars,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  };
  req.session.userIdCookie = users[randomChars].id;
  res.redirect(`/urls`);
});

//-------------------- PUT Method Calls --------------------//
app.put("/urls/:shortURl", (req, res) => {
  if (urlDatabase[req.params.shortURl].userID === req.session.userIdCookie) {
    urlDatabase[req.params.shortURl].longURL = req.body.newLongURL;
  }
  res.redirect('/urls');
});
//-------------------- DELETE Method Calls --------------------//
app.delete("/urls/:shortURl", (req, res) => {
  if (urlDatabase[req.params.shortURl].userID === req.session.userIdCookie) {
    delete urlDatabase[req.params.shortURl];
  }
  res.redirect('/urls');
});


//-------------------- Start Server --------------------//
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});