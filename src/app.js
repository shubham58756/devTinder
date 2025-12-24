const express = require("express")
const connectDB = require("./config/database")
const User = require("./model/user")

const app = express()
app.use(express.json())

app.get("/signup", (req, res) => {
  res.send("Signup page")
})

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.send("User added successfully")
  } catch (err) {
    res.status(400).send("Error adding user")
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).send("Error fetching users")
  }
})

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server is listening on port 7777")
    })
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err)
    process.exit(1)
  })
