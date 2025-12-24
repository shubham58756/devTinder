const express = require("express")
const connectDB = require("./config/database")
const User = require("./model/user")

const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
  console.log(req.body)

  try {
    const user = new User(req.body)
    await user.save()
    res.send("User added successfully")
  } catch (err) {
    res.status(400).send("Error adding user")
  }
})

connectDB()
  .then(() => {
    console.log("Database connection established")
    app.listen(7777, () => {
      console.log("Server is listening on port 7777")
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err)
  })
