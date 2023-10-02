const express = require("express");
const { login, createUser } = require("../controllers/users");
const items = require("./clothingItems");
const users = require("./users");

const router = express.Router();

// Handlers
router.post("/signin", login);
router.post("/signup", createUser);

router.use("/", items);
router.use("/", users);

module.exports = router;
