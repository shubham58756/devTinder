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
      console.error("Signup error:", err)
      // Handle duplicate key (unique email) and validation errors explicitly
      if (err.code === 11000) {
        return res.status(409).send("Email already exists")
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send(err.message)
      }
      res.status(500).send(err.message || "Error adding user")
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

app.patch("/signup/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(user)
  } catch (err) {
    res.status(500).send("Error updating user")
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
