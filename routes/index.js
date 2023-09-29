const express = require("express");
const { login, createUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

const router = express.Router();

// Handlers
router.post("/signin", login);
router.post("/signup", createUser);
router.get("./users/me", authMiddleware, getCurrentUser);
router.patch("./users/me", authMiddleware, updateProfile);
router.get("./items", getItems);
router.use(authMiddleware);

router.listen(3000, () => {
  console.log("Server is running on port 3000");
});
module.exports = router;
