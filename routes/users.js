const express = require("express");

const router = express.Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateProfileUpdate } = require("../middlewares/validation");

router.patch("/users/me", authMiddleware, validateProfileUpdate, updateProfile);
router.get("/users/me", authMiddleware, getCurrentUser, updateProfile);

module.exports = router;
