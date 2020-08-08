/// Helper Functions ///

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

// const urlsForUser = (id) => {
//   let newURLs = [];
//   for (let urlInfo in urlDatabase) {
//     if (id === urlDatabase[url].userID) {
//       newURLs.push({
//         shortURL: urlInfo,
//         longURL: urlDatabase[url].longURL
//       })
//     }
//   }
//   return newURLs;
// };

const getUser = function(email, password) {
  for (let user in users) {
    if ((users[user].email === email) && (users[user].password === password))  {
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

module.exports = { urlDatabase, users, generateRandomString, getUser };
