const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstName: "aarushi",
    lastName: "Koirala",
  });
});

app.post("/user", (req, res) => {
  res.send("Data posted successfully");
});

app.patch("/user", (req, res) => {
  res.send("Data patched successfully");
});

app.put("/user", (req, res) => {
  res.send("Data put successfully");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully");
});
//the order is v important as it starts mapping from top and then to bottom

app.use("/test", (req, res) => {
  res.send("Hello to test"); //anything after /test is handled by this
});

app.use("/app", (req, res) => {
  res.send("hello to app"); //anything after /app is handled by this
});

app.use((req, res) => {
  res.send("Hello to /"); //anything after / is handled by this
});

app.listen(7777, () => {
  console.log("listening to port number 7777");
});
