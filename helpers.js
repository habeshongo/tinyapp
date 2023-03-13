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

module.exports = { getUserByEmail };
