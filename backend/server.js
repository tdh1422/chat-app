require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth", require("./routes/auth"));

app.get("/", (_, res) => res.send("Backend OK"));

app.listen(5000, () => console.log("Backend running on 5000"));