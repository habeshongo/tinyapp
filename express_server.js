//Anytime we modify the server file, we must shut down and restart the server.

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helpers");
const { urlDatabase, users } = require("./database");

//This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "userId",
    keys: ["strings"],
  })
);

app.get("/", (req, res) => {
  if (!users[req.session.userId]) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Adding a new route handler for /urls.
app.get("/urls", (req, res) => {
  if (!users[req.session.userId]) {
    res.status(400).send("Please register or log in to use this site.");
  } else {
    const filtered_urls = urlsForUser(req.session.userId);
    const templateVars = {
      urls: filtered_urls,
      user: users[req.session.userId],
    };
    res.render("urls_index", templateVars);
  }
});

//This route handler will render the page with the form.
app.get("/urls/new", (req, res) => {
  if (!users[req.session.userId]) {
    res.status(400).send("Please register or log in to use this site.");
    return;
  }
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.userId],
  };
  res.render("urls_new", templateVars);
});

//Adding a new route to render the new template /urls/:id.
app.get("/urls/:id", (req, res) => {
  if (!users[req.session.userId]) {
    return res.status(400).send("Please register and/or login.");
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This url does not exist.");
  }

  if (urlDatabase[req.params.id].userID !== req.session.userId) {
    return res.status(400).send("This URL is not owned by you.");
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.userId],
  };
  res.render("urls_show", templateVars);
});

//This route renders the template for the register page to login with email and password.
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.userId] };
  if (users[req.session.userId]) {
    res.redirect("/urls");
  } else {
    res.render("register", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const URLdata = urlDatabase[req.params.id];
  if (!URLdata) {
    res.status(400).send("This URL does not exist.");
    return;
  }
  res.redirect(URLdata.longURL);
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.userId] };
  if (req.session.userId) {
    res.redirect("/urls");
  } else {
    res.render("login", templateVars);
  }
});

/* -----------------------------End of get routes--------------------------------------*/

app.post("/urls", (req, res) => {
  if (!users[req.session.userId]) {
    res
      .status(400)
      .send("Only registered users who are logged in can shorten URLs.");
  } else {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.session.userId,
    };
    res.redirect(301, `/urls/${id}`); // Response will redirect to the original web address.
  }
});

app.post("/urls/:id/delete", (req, res) => {
  if (!users[req.session.userId]) {
    return res.status(400).send("Please register and/or login.");
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This url does not exist.");
  }

  if (urlDatabase[req.params.id].userID !== req.session.userId) {
    return res.status(400).send("This URL is not owned by you.");
  }
  delete urlDatabase[req.params.id];
  return res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  if (!users[req.session.userId]) {
    return res.status(400).send("Please register and/or login.");
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This url does not exist.");
  }

  if (urlDatabase[req.params.id].userID !== req.session.userId) {
    return res.status(400).send("This URL is not owned by you.");
  }

  urlDatabase[req.params.id].longURL = req.body.longURL;
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Please fill out the information.");
  }

  const user = getUserByEmail(req.body.email, users);
  if (!user) {
    return res.status(400).send("User not found. Please register.");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).send("Password incorrect.");
  }

  req.session.userId = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
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
  const emailSearch = getUserByEmail(req.body.email, users);
  if (emailSearch === null) {
    const id = generateRandomString();
    users[id] = {
      id: id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };
    req.session.userId = id;
    res.redirect("/urls");
    return;
  } else {
    res.status(400).send("This user already exists. Please login.");
  }
});

/*The template for the login form asks for an email and password and sends a POST request to /login.*/
app.post("/login", (req, res) => {
  const emailSearch = getUserByEmail(req.body.email, users);
  if (emailSearch === null) {
    res.status(400).send("This user does not exist. Please register.");
  } else {
    req.session.userId = emailSearch.id;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
