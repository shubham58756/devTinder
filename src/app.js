const express = require("express");
const app = express();

const rh1 = (req, res, next) => {
  console.log("route handler 1 called");
  req.user = "Rahul";
  next();
};

const rh2 = (req, res, next) => {
  console.log("route handler 2 called");
  if (!req.user) {
    next(new Error("User not found"));
  } else {
    next();
  }
};

const rh3 = (req, res) => {
  console.log("route handler 3 called");
  res.send("Hello " + req.user);
};

app.use("/user", [rh1, rh2, rh3]);

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(7777, () => {
  console.log("server is successfully listening on port 7777");
});
