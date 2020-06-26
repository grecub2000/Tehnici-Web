// nodemon app.js

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const fs = require("fs");
const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());


// Create User
app.post("/users", (req, res) => {
    const usersList = readJSONFile();
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        score: req.body.score,
        date: req.body.date,
        id : uuid.v4.apply()
    }
    usersList.push(newUser);
    writeJSONFile(usersList);
    res.status(200).send(newUser);
});


// Read One User
app.get("/users/:id", (req, res) => {
  const usersList = readJSONFile();
  var id = req.params.id;
  console.log(id);
  var checkIfUserExists = false;
  usersList.forEach(user => {
      if(user.id === id) {
          checkIfUserExists = true;
          res.status(200).send(user);
      }
  });
  if(checkIfUserExists === false) {
      res.status(404).send("No user found!");
  }
});



// Read users
app.get("/users", (req, res) => {
  const usersList = readJSONFile();
  if(usersList != undefined){
    res.status(200).send(usersList);
  } else {
      res.status(404).send("No user found");
  }
});

// Read questions
app.get("/questions", (req, res) => {
  const qList = readJSONFileQuestions();
  if(qList != undefined){
    res.status(200).send(qList);
  } else {
      res.status(404).send("No question found");
  }
});

// Read ravase
app.get("/ravase", (req, res) => {
  const RList = readJSONFileRav();
  if(RList != undefined){
    res.status(200).send(RList);
  } else {
      res.status(404).send("No ravas found");
  }
});


// Update User
app.put("/users/:id", (req, res) => {
    var id = req.params.id;
    var checkIfUserExists = false;
    const usersList = readJSONFile();
    for(let i = 0; i < usersList.length; i++) {
        if(usersList[i].id === id) {
            usersList[i].username = req.body.username;
            usersList[i].password = req.body.password;
            usersList[i].name = req.body.name;
            usersList[i].email = req.body.email;
            usersList[i].score = req.body.score;
            usersList[i].date = req.body.date;
            checkIfUserExists = true;
            break;
        }
    }
    if(checkIfUserExists === true) {
        writeJSONFile(usersList);
        res.status(200).send("User updated!");
    } else {
        res.status(404).send("User not found!");
    }
});


// Delete User
app.delete("/users/:id", (req, res) => {
  const usersList = readJSONFile();
  var id = req.params.id;
  var checkIfUserExists = false;
  for(let i = 0; i < usersList.length; i++) {
      if(usersList[i].id === id) {
          checkIfUserExists = true;
          usersList.splice(i, 1); 
          break;
      }
  }
  if(checkIfUserExists === true) {
    writeJSONFile(usersList);
    res.status(200).send("User deleted!");
} else {
    res.status(404).send("User not found!");
}
});


// Functia de citire din fisierul users.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("users.json"))["users"];
}

function readJSONFileQuestions() {
  return JSON.parse(fs.readFileSync("questions.json"))["questions"];
}

function readJSONFileRav() {
  return JSON.parse(fs.readFileSync("ravase.json"))["ravase"];
}


// Functia de scriere in fisierul users.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "users.json",
    JSON.stringify({ users: content }, null, 4),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}


// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);