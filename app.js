const express = require("express");

const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Temporary authorization
app.use((req, res, next) => {
  req.user = {
    _id: "65089e0e309ffab9c8b45c80",
  };
  next();
});

// User Routes
app.use(userRoutes);

// ClothingItems
app.use(itemRoutes);

// Middleware
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});
