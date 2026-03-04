const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //creating a new instance of User model
  const user = new User({
    firstName: "Aarushi",
    lastName: "Koirala",
    emailId: "koiaarushi@42.com",
    password: "aarushi@12",
  });

  try {
    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(401).send("error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("connected successfully");
    app.listen(7777, () => {
      console.log("listening to port number 7777");
    });
  })
  .catch((err) => {
    console.log("can't connect");
  });
