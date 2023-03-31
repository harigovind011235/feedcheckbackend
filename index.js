const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/UserModel");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(5);
const secretKey = "hdjdfgkk485739dnf";

app.get("/", (req, res) => {
  res.send("Server Running Fine on '/'");
});

mongoose.connect(
  "mongodb+srv://harigovind3020:bgIoTHKeInOBaFIP@cluster0.u5yuznl.mongodb.net/feedcheckdb?retryWrites=true&w=majority"
);


app.post("/register", async (req, res) => {
  try {
    const { username, password, employeename, employeeID, isadmin } = req.body;
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      employeename,
      employeeID,
      isadmin,
    });
    if (userDoc) {
      res.send("Success");
    }
  } catch (e) {
    res.status(400).json(`Cant Create User -> ${e}`);
    console.log(`error in register -> ${e}`);
  }
});

app.get("/users", async (req, res) => {
  try {
    const userDocs = await User.find({});
    if (userDocs) {
      res.status(200).json(userDocs);
    } else {
      res.json({ message: "Cant get users" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username: username });

    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secretKey, {}, (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json("ok");
        });
      } else {
        res.status(400).json("Wrong credentials");
      }
    } else {
      res.json("Invalid Username");
    }
  } catch (e) {
    res.status(400).json(`Error In Login -> ${e}`);
  }
});


app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token){
    jwt.verify(token, secretKey, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
      });
  }
  else{
      res.status(400).json("Token Missing");
    }

});


app.post("/logout", (req, res) => {
  res.cookie("token", "").json("Successfully Logout");
});


PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server Listening On Port -> ${PORT}`);
});
