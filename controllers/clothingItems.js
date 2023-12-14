const { ClothingItem } = require("../models/clothingItem");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");
const NotFoundError = require("../utils/NotFoundError");
const ServerError = require("../utils/ServerError");

// Controller to get all clothing items
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find(); // Retrieve all clothing items from the database
    res.json(items); // Send the retrieved clothing items as a JSON response
  } catch (error) {
    next(new ServerError("Failed to fetch clothing items"));
  }
};

// Controller to create a new clothing item
const createItem = async (req, res, next) => {
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
  return undefined;
};

// Controller to delete a clothing item by _id
const deleteItem = async (req, res, next) => {
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
      throw new ForbiddenError("You are not authorized to delete this item");
    }
    // Delete the item from the database and return response
    const deletedItem = await ClothingItem.findByIdAndRemove(itemId);
    return res.json(deletedItem);
  } catch (err) {
    next(err);
  }
  return undefined;
};

// Like/Dislike Controllers
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      // If the item ID is not found, throw an error
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => {
      // If the item is successfully updated, send the updated item as a response
      res.json(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(error);
      }
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      const errorMessage =
        error.statusCode === NotFoundError
          ? "Item not found"
          : "An error has occurred on the server.";
      // Send an appropriate error response based on the error status code or a default server error response
      next(new ServerError(errorMessage));
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      // If the item ID is not found, throw a NotFoundError
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => {
      // If the item is successfully updated, send the updated item as a response
      res.json(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(error);
      }
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      const errorMessage =
        error.statusCode === NotFoundError.statusCode
          ? "Item not found"
          : "An error has occurred on the server.";
      next(new ServerError(errorMessage));
    });
};
module.exports = { getItems, createItem, deleteItem, dislikeItem, likeItem };
