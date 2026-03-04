const express = require("express");
const app = express();
const connectDB = require("./config/database");

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
