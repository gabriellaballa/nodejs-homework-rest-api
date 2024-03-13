/** @format */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  });

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", (req, res, next) => {
  res.status(200).send("You are on the main page");
});

module.exports = app;
