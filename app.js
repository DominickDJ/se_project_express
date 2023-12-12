const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const limiter = require("./rateLimiter");
const errorHandler = require("./middlewares/errorHandler");

const { requestLogger, errorLogger } = require("./middlewares/Logger");

const app = express();

const routes = require("./routes/index");

const { NOT_FOUND } = require("./utils/NotFoundError");

const { PORT = 3001 } = process.env;

app.use(express.json());

// Cors (cross origin resource sharing {secure http requests})
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", false);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Security enhancment and limiting request rates (middlewares)
// Helmet
app.use(helmet());

// Rate limit
app.use(limiter);

// Loggers
app.use(requestLogger);

// Code Test **DONT FORGET TO REMOVE AFTER REVIEW**
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// User and Clothing Items Routes
app.use(routes);

// Middleware
app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

// Logger
app.use(errorLogger);

// Error Handlers
app.use(errors());
app.use(errorHandler);
