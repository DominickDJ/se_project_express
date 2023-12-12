const express = require("express");
const { celebrate } = require("celebrate");

const items = require("./clothingItems");
const users = require("./users");

const router = express.Router();

const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateAuthentication,
} = require("../middlewares/validation");

// Handlers
router.post("/signin", celebrate({ body: validateAuthentication }), login);
router.post("/signup", celebrate({ body: validateUserInfo }), createUser);

router.use("/", items);
router.use("/", users);

module.exports = router;
