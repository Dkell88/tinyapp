const bcrypt = require('bcryptjs');
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

module.exports = { urlDatabase, users };