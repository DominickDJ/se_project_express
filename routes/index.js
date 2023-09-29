const express = require("express");
const { login, createUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

const router = express.Router();

// POST handlers
router.post("/signin", login);
router.post("/signup", createUser);
router.get("./users/me", authMiddleware, getCurrentUser);
router.patch("./users/me", authMiddleware, updateProfile);

router.use(authMiddleware);

router.get("/items", (req, res) => {
  // Handle the /items route logic
});

router.get("/protected-route", (req, res) => {
  // Handle the protected route logic
});

router.listen(3000, () => {
  console.log("Server is running on port 3000");
});
module.exports = router;
