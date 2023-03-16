/*------------------------------Objects that are used---------------------------------------*/

/* This object urlDatabase will keep track of all the URLs and their shortened forms.
This is the data we'll want to show on the URLs page.
Therefore, we need to pass along the urlDatabase to the template. */
const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "b2xVn2" },
  hsm5xK: { longURL: "http://www.google.com", userID: "hsm5xK" },
};

/*
Users is an object which will be used to store and access the users in the app.
*/
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/* ------------------------------------------------------------*/
module.exports = { urlDatabase, users };
