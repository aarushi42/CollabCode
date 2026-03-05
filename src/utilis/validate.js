const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("The name is not valid!");
  }
  if (!emailId) {
    throw new Error("EmailId cannot be empty!");
  }
  if (!password) {
    throw new Error("Enter a password!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid Email Id");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password");
  }
};

module.exports = {
  validateSignUpData,
};
