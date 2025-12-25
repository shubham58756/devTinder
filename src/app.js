const express = require("express")
const connectDB = require("./config/database")
const User = require("./model/user")
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcryptjs")

const app = express()
app.use(express.json())

const ALLOWED_UPDATES = [
  "age",
  "photoURL",
  "about",
  "skills",
  "firstName",
  "lastName",
  "email",
  "gender"
]

const isUpdateAllowed = (updates) => {
  return updates.every((update) => ALLOWED_UPDATES.includes(update))
}

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body)

    const { password, ...rest } = req.body
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      ...rest,
      password: passwordHash
    })

    await user.save()
    const userObj = user.toObject()
    delete userObj.password
    res.status(201).json(userObj)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send("Email already exists")
    }
    if (err.name === "ValidationError") {
      return res.status(400).send(err.message)
    }
    res.status(500).send(err.message || "Error adding user")
  }
})

app.patch("/signup/:id", async (req, res) => {
  try {
    const updates = Object.keys(req.body)

    if (!isUpdateAllowed(updates)) {
      return res.status(400).send("Invalid updates!")
    }

    // If password is being updated, hash it before the update
    if (updates.includes("password")) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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

// Add RESTful alias
app.patch("/users/:id", async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    if (!isUpdateAllowed(updates)) return res.status(400).send("Invalid updates!")
    if (updates.includes("password")) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!user) return res.status(404).send("User not found")
    res.status(200).json(user)
  } catch (err) {
    if (err.name === "CastError") return res.status(400).send("Invalid user ID")
    res.status(500).send("Error updating user")
  }
})

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server running on port 7777")
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err)
  })
