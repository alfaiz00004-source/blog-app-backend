//app.js
require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const blogRoutes = require("./routes/blogRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cookies = require("cookie-parser");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(cookies());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use(errorHandler);

module.exports = { app };
