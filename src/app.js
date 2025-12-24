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
    res.status(201).send("User added successfully")
  } catch (err) {
    res.status(400).send("Error adding user")
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).send("Error fetching users")
  }
})

app.patch("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(400).send("Error updating user")
  }
})

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server is listening on port 7777")
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err)
  })
