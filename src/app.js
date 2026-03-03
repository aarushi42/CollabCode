const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Hello to test");
});

app.use("/app", (req, res) => {
  res.send("hello to app");
});

app.use((req, res) => {
  res.send("Hello to /");
});

app.listen(7777, () => {
  console.log("listening to port number 7777");
});
