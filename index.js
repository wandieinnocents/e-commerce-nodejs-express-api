const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

const port = process.env.PORT;

// server creation
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// mongodb database connection
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", () => {
    console.log("Connected to MongoDB");
});
