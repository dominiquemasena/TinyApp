const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; 


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

/// Helper Functions ///

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

const getUser = function(email) {
  console.log(`getuser email: ${email}`)
  for (let user in users) {
    if (users[user].email === email) {
      console.log(`user: ${users[user]}`)
      return users[user];
    } 
  } 
  return false
}

/// Databases {created URLs and users} ///

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "c4t3r2U" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aKadOwn1ng"}
};

const users = { 
  "dominiquemasena": {
    id: "dominiquemasena", 
    email: "dodo@example.com", 
    password: "purple-monkey-dinosaur"

  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"

  }
};


/// GET Routes ///

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Route TO VIEW PAGE TO CREATE NEW URL //
app.get("/urls", (req, res) => {
  const id = req.cookies["user"];
  const user = users[id];
  console.log("user id =", users);

  let templateVars = { urls: urlDatabase, user: user};
  res.render("urls_index", templateVars);
});

// Route TO VIEW LOG IN PAGE //
app.get("/login", (req, res) => {
  const id = req.cookies["user"];
  const user = users[id];
  let templateVars = { urls: urlDatabase,
    user: user};
  res.render("urls_login", templateVars);
});

// Route TO VIEW THE REGISTRATION PAGE //
app.get("/register", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
  let templateVars = { urls: urlDatabase, user: user};
  res.render("index_register", templateVars);
});

// Route TO VIEW PAGE TO CREATE NEW URL //
app.get("/urls/new", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
      if(!user) {
        return res.redirect("/login");
      }
  const templateVars = {
    user: user
  };
  res.render("urls_new", templateVars);
});

// Route TO VIEW PAGE WHERE CREATE URLs ARE DISPLAYED //
app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies["user"];
  const user = users["id"];
  let templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL, 
    user: user};
  res.render("urls_show", templateVars);
});

// Route TO VIEW PAGE WHERE URLs IS MODIFIED //
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


/// POST Routes///

// Route for the deletion of a URL //
app.post('/urls/:short/delete', (req,res) => {
  delete urlDatabase[req.params.short]
  res.redirect(`/urls/`);
})

// Route for the modification of a URL //
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls")
}); 

// Route for logging in to an account //
app.post("/login", (req, res) => {
  const email = req.body.email;
  if(getUser(email)){
    const user = getUser(email)
    res.cookie("user", user.id);
    res.redirect('/urls');
  } else {
    res.redirect('/register')
  }
});

// Route for signing up for an account //
app.post('/register', (req, res) => {
 
  const id = generateRandomString(); 
  const email = req.body.email;
  const password = req.body.password;

  
  if (!password || !email) {
    return res.status(400).send("400 Status Code: No password or email entered.")
  } 
  
  // const user = getUser(email);
  // if (user) {
  //   return res.status(400).send("400 Status Code: Duplicate user.")
  // } 

  // checking if the user already exists
  for (let user in users) {
    if (users[user].email === email) {
      return res.status(400).send("Email already exist. Register with different email.");
    }
  }

  const newUser = {id, email, password};
  console.log(`new user: ${newUser}`)
  users[id] = newUser;
  console.log(`db: ${users}`)
  res.cookie("user", id);
  res.redirect('/urls'); 
})

// Route for logging out of an account //
app.post("/logout", (req, res) => {
  // const id = req.body["id"]
  res.clearCookie("user");
  res.redirect('/urls');
});

// Route for generating a short URL from a long URL //

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // urlDatabase[shortURL] = req.body.longURL;
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: req.cookies["user"] };
  console.log(urlDatabase[shortURL])
  res.redirect(`/urls/${shortURL}`)
})



app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL);
  res.redirect(longURL);

})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});