const express = require("express");

const router = express.Router();
const {
  getItems,
  likeItem,
  dislikeItem,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
const authMiddleware = require("../middlewares/auth");

// Route to get all clothing items
router.get("/items", getItems);

router.use(authMiddleware);

// Route to create a new clothing item
router.post("/items", createItem);

// Route to delete a clothing item by _id
router.delete("/items/:itemId", deleteItem);

// Likes
router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;
