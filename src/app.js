const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

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
  const data = req.body;
  const user = new User(data);

  try {
    if (data?.skills.length > 10) {
      throw new Error("Only 10 skills can be added");
    }

    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(401).send("ERROR " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "password",
      "age",
      "skills",
      "about",
      "gender",
      "photoUrl",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Only 10 skills can be added");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(500).send("ERROR - " + err.message);
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
