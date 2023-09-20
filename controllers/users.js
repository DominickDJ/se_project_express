const { User } = require("../models/user");
const { SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (message) {
    res.status(SERVER_ERROR).json({ message: "Failed to fetch users" });
  }
};

// Controller to get a user by _id
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
    }
    res.status(SERVER_ERROR).json({ message: "Failed to fetch user" });
  }
  return getUser;
};

// Controller to create a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.create({ name, avatar });
    res.status(201).json(user);
  } catch (message) {
    res.status(SERVER_ERROR).json({ message: "Failed to create user" });
  }
};

module.exports = { getUsers, getUser, createUser };
