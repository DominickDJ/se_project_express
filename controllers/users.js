const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const {
  SERVER_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// Controller to Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }
    // Compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }
    // Create a JSON Web Token (JWT) and Send the JWT to the client
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .json({ message: "Failed to authenticate user" });
  }
};

// Controller to update new user profile
const updateProfile = async (req, res) => {
  try {
    // Get the user ID from the request object
    const { _id } = req.user;
    // Find the user in the database based on the ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    // Update the user's profile with the new data
    user.name = req.body.name;
    user.avatar = req.body.avatar;
    // Save the updated user in the database & return response
    await user.save();
    return res.json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation errors
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (message) {
    res.status(SERVER_ERROR).json({ message: "Failed to fetch users" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Get the user ID from the request object
    const { _id } = req.user;
    // Find by id
    const user = await User.findById(_id);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    // Return the user data
    return res.json(user);
  } catch (error) {
    // Handle any errors that occur during the controller execution
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

// Controller to create a new user
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    // Check if there's already an existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CONFLICT)
        .json({ message: "User with this email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    const userResponse = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };
    return res.status(201).json(userResponse);
    // Handle any errors that occur during the controller execution
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(CONFLICT)
        .json({ message: "User with this email already exists" });
    }
    return res.status(SERVER_ERROR).json({ message: "Failed to create user" });
  }
};

module.exports = {
  getUsers,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
