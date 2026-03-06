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

//finding by email and updating
app.patch("/user", async (req, res) => {
const emailId = req.body.emailId;
const data = req.body;
try {
const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
returnDocument: "after",
});
res.send("user updated successfully");
} catch (err) {
res.status(500).send("error occured again");
}
});

//getting a user on the basis of condition
app.get("/user", async (req, res) => {
const userEmail = req.body.emailId;

try {
const users = await User.find({ emailId: userEmail });
if (users.length === 0) {
res.status(404).send("User not Found");
} else {
res.send(users);
}
} catch (err) {
res.status(500).send("error occured" + err);
}
});

//get all the user
app.get("/feed", async (req, res) => {
try {
const users = await User.find({});
res.send(users);
} catch (err) {
res.status(500).send("error occured again");
}
});

app.patch("/user/:userId", async (req, res) => {
const userId = req.params?.userId;
const data = req.body;
try {
const ALLOWED_UPDATES = [
"password",
"age",
"skills",
"about",
"gender",
"photoUrl",
];
const isUpdateAllowed = Object.keys(data).every((k) =>
ALLOWED_UPDATES.includes(k),
);
if (!isUpdateAllowed) {
throw new Error("Update Not Allowed");
}
if (data?.skills.length > 10) {
throw new Error("Only 10 skills can be added");
}
const user = await User.findByIdAndUpdate({ \_id: userId }, data, {
returnDocument: "after",
runValidators: true,
});
res.send("user updated successfully");
} catch (err) {
res.status(500).send("ERROR - " + err.message);
}
});

app.delete("/user", async (req, res) => {
const userId = req.body.userId;
try {
const user = await User.findByIdAndDelete(userId);
res.send("user deleted successfully");
} catch (err) {
res.status(500).send("error occured again");
}
});
