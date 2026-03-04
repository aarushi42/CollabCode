const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//getting a user on the basis of condition
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("error occured" + err);
  }
});

//get all the user
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("error occured again");
  }
});

app.post("/signup", async (req, res) => {
  //creating a new instance of User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(401).send("error saving the user" + err.message);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(500).send("error occured again");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("error occured again");
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
