const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const { gererateRandomString, getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
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
const TesturlDatabase = {
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


describe('getUserByEmail', function() {
  it('Should return aJ481W as a user when passed the user@example1.com email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "aJ481W";
    assert.strictEqual(user, expectedUserID);
  });
  it('Should return gjJ5yh as a user whane passed the user@example2.com email', function() {
    const user = getUserByEmail("user@example2.com", testUsers);
    const expectedUserID = "gjJ5yh";
    assert.strictEqual(user, expectedUserID);
  });
  it('Should equate as not equal when comparing sdgfsg as a user when passed the user@example2.com email', function() {
    const user = getUserByEmail("user@example2.com", testUsers);
    const expectedUserID = "sdgfsg";
    assert.notEqual(user, expectedUserID);
  });
  it('Should equate as false when passed an empty email', function() {
    const user = getUserByEmail("", testUsers);
    assert.isFalse(user);
  });
});

describe('gererateRandomString', function() {
  it('Should return a string length of 6', function() {
    const string = gererateRandomString(6, true);
    assert.strictEqual(string.length, 6);
  });
  it('Should return only numbers when AlphaNum is false', function() {
    const string = gererateRandomString(6, false);
    const number = Number(string);
    assert.isFalse(isNaN(number));
  });
  it('Should return a string (NaN) when AlphaNum is true', function() {
    const string = gererateRandomString(6, true);
    const number = Number(string);
    assert.isTrue(isNaN(number));
  });
});

describe('urlsForUser', function() {
  it('Should return 2 urls that are authorized for the user: aJ481W', function() {
    const user = 'aJ481W';
    const object = urlsForUser(user,TesturlDatabase);
    let count = 0;
    for (const objs in object.authorized) {
      count ++;
    }
    assert.strictEqual(count, 2);
  });
  it('Should return 1 url that is unauthorized for the user: aJ481W', function() {
    const user = 'aJ481W';
    const object = urlsForUser(user,TesturlDatabase);
    let count = 0;
    for (const objs in object.unauthorized) {
      count ++;
    }
    assert.strictEqual(count, 1);
  });
});

