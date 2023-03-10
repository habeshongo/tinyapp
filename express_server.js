//Anytime we modify the server file, we must shut down and restart the server.

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

//This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* This object urlDatabase will keep track of all the URLs and their shortened forms.
This is the data we'll want to show on the URLs page. 
Therefore, we need to pass along the urlDatabase to the template. */
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  console.log(req.cookies["user_id"]);
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  /*EJS automatically knows to look inside the views directory for any template files that have the extension .ejs. This means we don't need to tell it where to find them. It also means that we do not need to include the extension of the filename when referencing it.
  When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template. */
  res.render("urls_index", templateVars);
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
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

//This route render the template for the register page to login with email and password.
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(301, `/urls/${id}`); // Response will redirect to the original web address.
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  // When there is a "click"
  // it deletes the key and value from the object
  delete urlDatabase[req.params.id];
  return res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  return res.redirect("/urls");
});

/*
The code below creates the endpoint that handles the registration form data.
This endpoint adds a new user object to the global users object.
The user object includes the user's id, email and password, similar to the example above.
*/
app.post("/register", (req, res) => {
  const id = generateRandomString();
  users[id] = {
    id: id,
    email: req.body.email,
    password: req.body.password,
  };
  res.cookie("user_id", id);
  console.log(users);
  return res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// A function that returns a string of 6 random alphanumeric characters.
function generateRandomString() {
  return Math.random().toString(20).substring(2, 8);
}
