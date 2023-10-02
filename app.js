const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require("./rateLimiter");

const app = express();

const routes = require("./routes/index");

const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;

app.use(express.json());

// Cors
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helmet
app.use(helmet());

// Rate limit
app.use(limiter);

// User Routes
app.use(routes);

// ClothingItems
app.use(routes);

// Middleware
app.use((res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});
