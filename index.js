const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/UserModel");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(5);

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





PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server Listening On Port -> ${PORT}`);
});
