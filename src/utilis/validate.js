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

  const { firstName, lastName, about, age, gender, skills, photoUrl } =
    req.body;

  if (firstName && (firstName.length < 3 || firstName.length > 50)) {
    throw new Error("Length of First Name is Invalid ");
  }

  if (lastName && (lastName.length < 3 || lastName.length > 50)) {
    throw new Error("Length of Last Name is Invalid ");
  }

  if (about && about.length > 200) {
    throw new Error("Length of about is Invalid ");
  }

  if (age < 18 || age > 100) {
    throw new Error("You canot access our services");
  }

  const isGenderAllowed = ["male", "female", "other"].includes(gender);
  if (gender && !isGenderAllowed) {
    throw new Error("Gender Invalid");
  }

  if (skills) {
    if (skills.length > 10) {
      throw new Error("Only 10 skills allowed");
    }

    for (let skill of skills) {
      if (skill.length > 20) {
        throw new Error("Each skill must not exceed 20 characters");
      }
    }
  }

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid Url");
  }

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileRequest,
};
