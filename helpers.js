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

const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return false;
};

const urlsForUser = function(id, database) {
  let returnedURLs = {
    authorized: {},
    unauthorized: {}
  };
  for (const URL in database) {
    if (database[URL].userID === id) {
      returnedURLs.authorized[URL] = database[URL];
    } else returnedURLs.unauthorized[URL] = database[URL];
  }
  return returnedURLs;
};
module.exports = { gererateRandomString, getUserByEmail, urlsForUser };