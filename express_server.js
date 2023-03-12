//Anytime we modify the server file, we must shut down and restart the server.

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

//This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

/*------------------------------Helper functions---------------------------------------*/

// A function that returns a string of 6 random alphanumeric characters.
const generateRandomString = function () {
  return Math.random().toString(20).substring(2, 8);
};

/*This function is to find a user in the users object from its email */
const getUserByEmail = function (email) {
  for (const key in users) {
    const user = users[key];
    if (user.email === email) return user;
  }
  return null;
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

/* -------------------------End of the Helper Functions-----------------------------------*/

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Adding a new route handler for /urls.
app.get("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res.status(400).send("Please register or log in to use this site.");
  } else {
    const filtered_urls = urlsForUser(req.cookies.user_id);
    const templateVars = {
      urls: filtered_urls,
      user: users[req.cookies["user_id"]],
    };
    res.render("urls_index", templateVars);
  }
});

//This route handler will render the page with the form.
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_new", templateVars);
});

//Adding a new route to render the new template /urls/:id.
app.get("/urls/:id", (req, res) => {
  if (!req.cookies.user_id) {
    return res.status(400).send("Please register and/or login.");
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This url does not exist.");
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.status(400).send("This URL is not owned by you.");
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

//This route renders the template for the register page to login with email and password.
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  if (req.cookies.user_id) {
    res.redirect("/urls");
  } else {
    res.render("register", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    res.status(400).send("This URL does not exist.");
  }
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  if (req.cookies.user_id) {
    res.redirect("/urls");
  } else {
    res.render("login", templateVars);
  }
});

/* -----------------------------End of get routes--------------------------------------*/

app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res
      .status(400)
      .send("Only registered users who are logged in can shorten URLs.");
  } else {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id,
    };
    res.redirect(301, `/urls/${id}`); // Response will redirect to the original web address.
  }
});

app.post("/urls/:id/delete", (req, res) => {
  console.log("We are at delete:", req.params.id);
  if (!req.cookies.user_id) {
    return res.status(400).send("Please register and/or login.");
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This url does not exist.");
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.status(400).send("This URL is not owned by you.");
  }
  delete urlDatabase[req.params.id];
  return res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  if (!req.cookies.user_id) {
    return res.status(400).send("Please register and/or login.");
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This url does not exist.");
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.status(400).send("This URL is not owned by you.");
  }

  urlDatabase[req.params.id].longURL = req.body.longURL;
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Please fill out the information.");
  }

  const user = getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).send("User not found. Please register.");
  }

  if (user.password !== req.body.password) {
    return res.status(400).send("Password incorrect.");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

/*
The code below creates the endpoint that handles the registration form data.
This endpoint adds a new user object to the global users object.
The user object includes the user's id, email and password, similar to the example above.
*/
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Please fill in the required fields.");
  }
  const emailSearch = getUserByEmail(req.body.email);
  if (emailSearch === null) {
    const id = generateRandomString();
    users[id] = {
      id: id,
      email: req.body.email,
      password: req.body.password,
    };
    res.cookie("user_id", id);
    //console.log(users);
    res.redirect("/urls");
    return;
  } else {
    res.status(400).send("This user already exists. Please login.");
  }
});

/*The template for the login form asks for an email and password and sends a POST request to /login.*/
app.post("/login", (req, res) => {
  const emailSearch = getUserByEmail(req.body.email);
  if (emailSearch === null) {
    res.status(400).send("This user does not exist. Please register.");
  } else {
    const email = req.body.email;
    getUserByEmail(req.body.email);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
