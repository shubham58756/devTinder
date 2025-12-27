<<<<<<< HEAD
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

require("./utils/cronjob");
=======
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
>>>>>>> parent of 5506315 (Auth,JWT and cookie)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

<<<<<<< HEAD
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);
=======
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
>>>>>>> parent of 5506315 (Auth,JWT and cookie)

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });