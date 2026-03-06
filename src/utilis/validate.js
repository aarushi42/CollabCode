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

const validateEditProfileRequest = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "skills",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileRequest,
};
