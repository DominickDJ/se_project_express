const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth");

const {
  getItems,
  likeItem,
  dislikeItem,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItem,
  validateItemID,
} = require("../middlewares/validation");

// Route to get all clothing items
router.get("/items", getItems);

router.use(authMiddleware);

// Route to create a new clothing item
router.post("/items", validateClothingItem, createItem);

// Route to delete a clothing item by _id
router.delete("/items/:itemId", validateItemID, deleteItem);

// Likes
router.put("/items/:itemId/likes", validateItemID, likeItem);
router.delete("/items/:itemId/likes", validateItemID, dislikeItem);

module.exports = router;
