//Anytime we modify the server file, we must shut down and restart the server.

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs")


app.use(express.urlencoded({ extended: true }));

/* This object urlDatabase will keep track of all the URLs and their shortened forms.
This is the data we'll want to show on the URLs page. 
Therefore, we need to pass along the urlDatabase to the template. */
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
app.get("/urls", (req, res) =>{
  const templateVars = {urls : urlDatabase };
    /*EJS automatically knows to look inside the views directory for any template files that have the extension .ejs. This means we don't need to tell it where to find them. It also means that we do not need to include the extension of the filename when referencing it.
  When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template. */
  res.render("urls_index", templateVars)
})

//This route handler will render the page with the form.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


//Adding a new route to render the new template /urls/:id.
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]/* What goes here? This was the question to figure out. */ };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(301, `/urls/${id}`); // Response will redirect to the original web address.
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  console.log('long', longURL);
  res.redirect(longURL);
  
});

app.post("/urls/:id/delete", (req, res) => {
  // When there is a "click"
  // it deletes the key and value from the object
  delete urlDatabase[req.params.id]
  return res.redirect('/urls')
})

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  return res.redirect('/urls')
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// A function that returns a string of 6 random alphanumeric characters.
function generateRandomString() {
  return Math.random().toString(20).substring(2, 8);
}
