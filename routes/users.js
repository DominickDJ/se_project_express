const express = require("express");
const router = express.Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

// Route to get all users
router.get("/users", getUsers);

// Route to get a user by _id
router.get("/users/:userId", getUser);

// Route to create a new user
router.post("/users", createUser);

module.exports = router;
