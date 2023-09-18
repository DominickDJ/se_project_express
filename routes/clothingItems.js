const express = require("express");
const router = express.Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

// Route to get all clothing items
router.get("/items", getItems);

// Route to create a new clothing item
router.post("/items", createItem);

// Route to delete a clothing item by _id
router.delete("/items/:itemId", deleteItem);

//Middleware
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});
module.exports = router;
