const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");

const { userAuth } = require("../middleware/auth");
const { validateEditProfileRequest } = require("../utilis/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileRequest(req)) {
      throw new Error("Invalid update Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    //check password
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    const isCurrentPasswordCorrect =
      await loggedInUser.validatePassword(currentPassword);

    if (!isCurrentPasswordCorrect) {
      throw new Error("The password entered is incorrect");
    }

    const isNewPasswordStrong = validator.isStrongPassword(newPassword);
    if (!isNewPasswordStrong) {
      throw new Error("Enter a strong password");
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHashed;

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}'s password updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }

  //allow update
});

module.exports = profileRouter;
