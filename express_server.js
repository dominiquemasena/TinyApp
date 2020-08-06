const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
// const cookieSession = require('cookie-session')
const app = express();
const PORT = 8080; // default port 8080
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(cookieSession({
//   name: 'session',
//   keys: ['one', 'two']
// }))
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "dominiquemasena": {
    id: "dominiquemasena", 
    email: "dodo@example.com", 
    password: "purple-monkey-dinosaur"
    // password: bcrypt.hashSync("purple-monkey-dinosaur", salt)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
    // password: bcrypt.hashSync("dishwasher-funk", salt)
  }
};

/// GET ///

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL/edit", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    id: req.cookies["id"]};
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  console.log(req.cookies["id"]);
  let templateVars = { urls: urlDatabase,
  id: req.cookies["id"]
};
  res.render("urls_index", templateVars);
});

/// POST ///

app.post('/urls/:short/delete', (req,res) => {
  delete urlDatabase[req.params.short]
  res.redirect(`/urls/`);
})

//* */
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls")
}); 
//* */

// app.post("/urls/:shortURL/login", (req, res) => {
// res.cookie
//   res.redirect("/urls")
// }); 
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   res.cookie(username, req.body.username )
//   res.redirect("/urls")
// })

app.post("/login", (req, res) => {
  const id = req.body["id"];
  // console.log("username:", username)
  // console.log('username: ', username)
  res.cookie("id", id);
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
 
  const newUser = {}
  const id = generateRandomString(); 
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  users[id] = newUser;
  console.log("email:", req.body.email); // email is undefined why is that?
  console.log("body", req.body);

  if (newUser.password === "" || newUser.email === "") {
    return res.status(400).send("400 Status Code: No password or email entered")
  } 

  for (let user in users){
    if (user.email) {
      return res.status(400).send("400 Status Code: This email is already registered. Please log in.")
    }
  }
  res.cookie("id", id);
  res.redirect('/urls');
  
})

app.post("/logout", (req, res) => {
  const id = req.body["id"]
  // console.log('username: ', username)
  res.clearCookie("id", {path: "id"});
  res.redirect('/urls');
});
// app.post("/urls/:shortURL", (req, res) => {
//   let shortURL = req.params.shortURL;
//   let longURL = req.body.longURL;
//   urlDatabase[shortURL] = longURL;
//   res.redirect("/urls")
// });

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase[shortURL])
  res.redirect(`/urls/${shortURL}`)
})
//generating random string 

app.post("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase.shortURL;
  console.log(urlDatabase[shortURL])
  res.redirect(longURL);

})
//req.params 

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase,
    id: req.cookies["id"]};
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase,
    id: req.cookies["id"]};
  res.render("index_register", templateVars);
});


// urlDatabase.insert()
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



// app.post('/urls/:short/edit', (req,res) => {
//   let shortURL = req.params.shortURL;
  
//   //  urlDatabase[req.params.short]
//   res.redirect(`/urls/`);
// })


{/* <form method="POST" action="/urls/<%=url%>/delete">
                <button type="submit" class="btn btn-primary">Delete</button>    
              </form> */}

// app.post('/urls/:short/edit', (req, res) => {
//   let shortURL = req.params.shortURL;
//   let longURL = req.body.longURL;
//   urlDatabase[shortURL] = longURL;
//   res.redirect(`/urls/`)
// });

// app.post('/urls/:short/edit', (req,res) => {
//   const longURL = urlDatabase[req.params.short];
//   res.redirect(`/urls/`);
// })
{/* <form method="POST" action="/urls/<%=url%>/edit">
<button type="submit" class="btn btn-primary">Edit</button>    
</form> */}