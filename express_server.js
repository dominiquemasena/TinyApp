const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

const { urlDatabase, users, generateRandomString} = require("./helper");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

/// GET ROUTES ///
app.get("/", (req, res) => { 
    const id = req.cookies["user"];
    const user = users[id];
    const templateVars = { urls: urlDatabase,
      user: user};
    res.render("urls_login", templateVars);
  });

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// ROUTES TO CREATE NEW URL //

app.get("/urls", (req, res) => {
  
  const id = req.cookies["user"];
  const user = users[id];
  const templateVars = { urls: urlDatabase, user: user};
  if (!id) {
    return res.redirect("/login");
  } else {
    res.render("urls_index", templateVars);
  }
});
      
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user"]};
  res.redirect(`/urls/${shortURL}`);
});

// ROUTES FOR THE LOG IN PAGE //
app.get("/login", (req, res) => {
  const id = req.cookies["user"];
  const user = users[id];
  const templateVars = { urls: urlDatabase,
    user: user};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  if (getUser(email)) {
    const user = getUser(email);
    res.cookie("user", user.id);
    res.redirect("/urls");
  } else {
    res.redirect("/register");
  }
});

// ROUTES FOR THE REGISTRATION PAGE //
app.get("/register", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
  const templateVars = { urls: urlDatabase, user: user};
  res.render("index_register", templateVars);
});

app.post("/register", (req, res) => {
 
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  
  if (!password || !email) {
    return res.status(400).send("400 Status Code: No password or email entered.");
  }

  for (const user in users) {
    if (users[user].email === email) {
      return res.status(400).send("Email already exist. Register with different email.");
    }
  }

  const newUser = {id, email, password};
  users[id] = newUser;
  res.cookie("user", id);
  res.redirect("/urls");
});

// ROUTES FOR THE CREATION OF A NEW URL //
app.get("/urls/new", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
  const templateVars = {
    user: user
  };
  if (!id) {
    return res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// ROUTES WHERE CREATED URLs ARE DISPLAYED //
app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
  const templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: user};
  res.render("urls_show", templateVars);
});

// ROUTES WHERE URLs ARE MODIFIED //
app.get("/urls/:shortURL/edit", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: user
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

// ROUTE FOR THE DELETION OF URLS //
app.post("/urls/:short/delete", (req,res) => {
  delete urlDatabase[req.params.short];
  res.redirect(`/urls/`);
});

// ROUTES FOR LOGGING OUT OF AN ACCOUNT //
app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/urls");
});

// ROUTES FOR GENERATING A SHORT A URL FROM A LONG URL //
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});