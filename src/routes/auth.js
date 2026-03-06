const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utilis/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  //manual
  // res.cookies("token", null, {
  // expires: new Date(Date.now()),
  // });
  res.clearCookie("token");
  res.send("Logout Successful!!");
});

module.exports = authRouter;
