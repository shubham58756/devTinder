const express = require("express");
const app = express();

app.use("/user", (req, res) => {
  console.log("route handler 1 called");
  res.send("route handler 1");
},
()=>{
  // route handler 2
  console.log("route handler 2 called");
  res.send("route handler 2");
});

app.listen(7777, () => {
  console.log("server is successfully listening on port 7777");
});
