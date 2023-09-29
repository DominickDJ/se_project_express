const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// User Routes
app.use(userRoutes);

// ClothingItems
app.use(itemRoutes);

// Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});
