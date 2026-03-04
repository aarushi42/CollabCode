const userAuth = (req, res, next) => {
  const token = "abcde";
  if (token !== "abcde") {
    res.status(401).send("unauthorised access");
  } else {
    next();
  }
};

module.exports = {
  userAuth,
};
