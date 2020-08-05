const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL/edit", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username};
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  // console.log(req.cookies);
  let templateVars = { urls: urlDatabase,
  username: req.cookies.username};
  res.render("urls_index", templateVars);
});



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
  const username = req.body.username
  // console.log('username: ', username)
  res.cookie("username", username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  const username = req.body.username
  // console.log('username: ', username)
  res.clearCookie("username", {path: "username"});
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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

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