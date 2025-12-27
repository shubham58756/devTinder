const express = require("express")
const connectDB = require("./config/database")
const User = require("./model/user")
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middleware/auth")

const app = express()
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req)

    const { password, ...rest } = req.body
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      ...rest,
      password: passwordHash
    })

    await user.save()
    res.status(201).json(user)
  } catch (err) {
    if (err.code === 11000) return res.status(409).send("Email already exists")
    res.status(500).send("Error adding user")
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).send("Invalid credentials")


    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).send("Invalid credentials")
      

    const token = jwt.sign(
      { _id: user._id },
      "DEV@Tinder$790",
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true
      
    })

    res.status(200).json(user)
  } catch (err) {
    res.status(500).send("Login failed")
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.json(req.user)
  } catch (err) {
    res.status(500).send("Error fetching profile")
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user=req.user
  console.log("sending connection request")
  res.send("user.firstName+' sent connection request'");
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
