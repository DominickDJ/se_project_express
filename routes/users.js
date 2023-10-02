const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

const router = express.Router();

router.get("./users/me", authMiddleware, getCurrentUser);
router.patch("./users/me", authMiddleware, updateProfile);

module.exports = router;
