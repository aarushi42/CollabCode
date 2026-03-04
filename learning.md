app.use("/", userAuth);

app.get(
"/RH",
[
(req, res, next) => {
console.log("responding 1");
next();
},
(req, res, next) => {
console.log("responding 2");
next();
},
],
(req, res, next) => {
console.log("responding 3");
next();
},
(req, res, next) => {
console.log("responding 4");
next();
},
(req, res, next) => {
console.log("responding 5");
res.send("request received");
// next();
},
);

app.get("/user", (req, res) => {
throw new Error();
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

app.use("/", (err, req, res, next) => {
if (err) {
res.status(500).send("an error occured");
}
});
