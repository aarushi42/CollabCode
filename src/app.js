const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utilis/validate");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validating the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(401).send("ERROR " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create a JWT token
      const token = await user.getJWT();

      //Add the token to cookie and send the response to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
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
