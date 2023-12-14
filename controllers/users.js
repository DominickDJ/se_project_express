const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");

const { JWT_SECRET } = require("../utils/config");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    // Compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }
    // Create a JSON Web Token (JWT) and Send the JWT to the client
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    next(error);
  }
  return undefined;
};

// Controller to update new user profile
const updateProfile = async (req, res, next) => {
  try {
    // Get the user ID from the request object
    const { _id } = req.user;
    // Find the user in the database based on the ID
    const user = await User.findById(_id);
    if (!user) {
      throw new NotFoundError("User not found");
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
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
  return undefined;
};

const getCurrentUser = async (req, res, next) => {
  try {
    // Get the user ID from the request object
    const { _id } = req.user;
    // Find by id
    const user = await User.findById(_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // Return the user data
    return res.json(user);
  } catch (error) {
    next(error);
  }
  return undefined;
};

// Controller to create a new user
const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  try {
    // Check if there's already an existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
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
      next(new BadRequestError(error.message));
    } else if (error.code === 11000) {
      next(new ConflictError("User with this email already exists"));
    } else {
      next(error);
    }
  }
  return undefined;
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
