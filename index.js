const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();

app.use(express.json()); // Json data get and send
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome our slack API");
});

const port = process.env.port || 5000;
const mongooseURI = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port}`);
});

mongoose
  .connect(mongooseURI)
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((error) =>
    console.log("Connection failed with error: ", error.message),
  );
