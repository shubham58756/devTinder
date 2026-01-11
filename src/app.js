const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");


require("dotenv").config();


try {
  require("./utils/cronjob");
} catch (err) {
  console.warn("No cronjob module found, skipping cronjob.");
}

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
let paymentRouter;
try {
  paymentRouter = require("./routes/payment");
} catch (err) {
  paymentRouter = null;
  console.warn("./routes/payment not found, skipping payment routes.");
}

let initializeSocket;
try {
  initializeSocket = require("./utils/socket");
} catch (err) {
  initializeSocket = null;
  console.warn("./utils/socket not found, skipping socket initialization.");
}

let chatRouter;
try {
  chatRouter = require("./routes/chat");
} catch (err) {
  chatRouter = null;
  console.warn("./routes/chat not found, skipping chat routes.");
}

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
if (paymentRouter) app.use("/", paymentRouter);
if (chatRouter) app.use("/", chatRouter);

const server = http.createServer(app);
if (initializeSocket) initializeSocket(server);

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