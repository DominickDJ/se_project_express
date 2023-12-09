const { ClothingItem } = require("../models/clothingItem");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
} = require("../utils/errors");

// Controller to get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find(); // Retrieve all clothing items from the database
    res.json(items); // Send the retrieved clothing items as a JSON response
  } catch (error) {
    if (error.name === "ServerError") {
      next(new ServerError("Failed to fetch clothing items"));
    }
  }
};

// Controller to create a new clothing item
const createItem = async (req, res) => {
  console.log(req.user._id); // Log the user ID from the request object
  const { name, weather, imageUrl } = req.body; // Destructure the name, weather, and imageUrl from the request body

  try {
    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id, // Set the owner of the item as the user ID from the request object
    });

    return res.status(201).json(item); // If the item is successfully created, send a success response with the created item
  } catch (message) {
    if (message.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(new ServerError("Failed to create clothing item"));
    }
  }
};

// Controller to delete a clothing item by _id
const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user;
  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item not Found");
    }
    // Check if the logged-in user is the owner of the item
    if (item.owner.toString() !== _id) {
      // If the owner's _id is not the same as the logged-in user's _id, return a 403 error
      throw new UnauthorizedError("You are not authorized to delete this item");
    }
    // Delete the item from the database and return response
    const deletedItem = await ClothingItem.findByIdAndRemove(itemId);
    return res.json(deletedItem);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID"));
    } else {
      next(new ServerError("Failed to delete clothing item"));
    }
  }
};

// Like/Dislike Controllers
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      // If the item ID is not found, throw an error
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => {
      // If the item is successfully updated, send the updated item as a response
      res.json(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        // If there is a casting error, send a bad request response
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      const errorMessage =
        error.statusCode === NOT_FOUND
          ? "Item not found"
          : "An error has occurred on the server.";
      // Send an appropriate error response based on the error status code or a default server error response
      return res
        .status(error.statusCode || SERVER_ERROR)
        .json({ message: errorMessage });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      // If the item ID is not found, throw an error
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => {
      // If the item is successfully updated, send the updated item as a response
      res.json(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        // If there is a casting error (e.g., invalid item ID), send a bad request response
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      const errorMessage =
        error.statusCode === NOT_FOUND
          ? "Item not found"
          : "An error has occurred on the server.";
      // Send an appropriate error response based on the error status code or a default server error response
      return res
        .status(error.statusCode || SERVER_ERROR)
        .json({ message: errorMessage });
    });
};

module.exports = { getItems, createItem, deleteItem, dislikeItem, likeItem };
