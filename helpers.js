/*------------------------------Helper functions---------------------------------------*/

/*This function is to find a user in the users object from its email */
const getUserByEmail = function (email, users) {
  for (const key in users) {
    const user = users[key];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// A function that returns a string of 6 random alphanumeric characters.
const generateRandomString = function () {
  return Math.random().toString(20).substring(2, 8);
};

/*This function returns the URLs where the userID is equal to the id of the currently logged-in user.*/
const urlsForUser = function (id) {
  /*This empty object was created to filter and store the websites from the urlDatabase that match the id (cookie) of the present user*/
  const newObj = {};
  for (const key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      newObj[key] = urlDatabase[key];
    }
  }
  return newObj;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };
