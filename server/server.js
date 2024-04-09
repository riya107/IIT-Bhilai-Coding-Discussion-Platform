const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

const dbConnect=require('./dbconnection.js');

dbConnect();

// cors middleware
app.use(cors());

// Body parser Middleware
app.use(express.json());

// logger Middleware. --DEV mode.
app.use(require("./middleware/logger"));

// use routes.
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

// Port Variable
const PORT = process.env.PORT || 8000;

// listenting to server.
app.listen(PORT, () => console.log(`Server is started on PORT : ${PORT}`));
