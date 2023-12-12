const express = require("express");
const celebrate = require("celebrate");

const router = express.Router();
const { updateProfile } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateProfileUpdate } = require("../middlewares/validation");

router.patch(
  "/users/me",
  authMiddleware,
  celebrate(validateProfileUpdate),
  updateProfile,
);

module.exports = router;
