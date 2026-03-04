const express = require("express");
const app = express();
const { userAuth } = require("./middleware/auth");

app.listen(7777, () => {
  console.log("listening to port number 7777");
});
