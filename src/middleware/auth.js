const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    //validate the token
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedObj = jwt.verify(token, "mysecretpassword12");

    //find the user
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Please Log In Again");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
