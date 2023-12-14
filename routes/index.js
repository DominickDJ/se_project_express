const express = require("express");

const items = require("./clothingItems");
const users = require("./users");

const router = express.Router();

const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateAuthentication,
} = require("../middlewares/validation");

// Handlers
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserInfo, createUser);

router.use("/", items);
router.use("/", users);

module.exports = router;
