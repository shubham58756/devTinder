const express = require("express")
const connectDB = require("./config/database")
const User = require("./model/user")

const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send("Email already exists")
    }
    if (err.name === "ValidationError") {
      return res.status(400).send(err.message)
    }
    res.status(500).send("Error adding user")
  }
})

app.patch("/signup/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!user) {
      return res.status(404).send("User not found")
    }

    res.status(200).json(user)
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send("Invalid user ID")
    }
    res.status(500).send("Error updating user")
  }
})
const ALLOWED_UPDATES = ["age", "photoURL", "about", "skills", "firstName", "lastName", "email","gender"]
isUpdateAllowed = (updates) => {
  return updates.every((update) => ALLOWED_UPDATES.includes(update))
  if(!isUpdateAllowed(updates)) {
    return res.status(400).send("Invalid updates!")
  }
}

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server running on port 7777")
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err)
  })
