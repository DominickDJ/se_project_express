const { ClothingItem } = require("../models/clothingItem");
const {
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../utils/errors");

// Controller to get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (message) {
    res
      .status(SERVER_ERROR)
      .json({ message: "Failed to fetch clothing items" });
  }
};

// Controller to create a new clothing item
const createItem = async (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  try {
    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    res.status(201).json(item);
  } catch (message) {
    if (message.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data" });
    }
    res
      .status(SERVER_ERROR)
      .json({ message: "Failed to create clothing item" });
  }
  return createItem;
};

// Controller to delete a clothing item by _id
const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user;
  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }
    // Check if the logged-in user is the owner of the item
    if (item.owner.toString() !== _id) {
      // If the owner's _id is not the same as the logged-in user's _id, return a 403 error
      return res
        .status(UNAUTHORIZED)
        .json({ message: "You are not authorized to delete this item" });
    }
    // Delete the item from the database and return response
    const deletedItem = await ClothingItem.findByIdAndRemove(itemId);
    return res.json(deletedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "Failed to delete clothing item" });
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
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => {
      res.json(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      const errorMessage =
        error.statusCode === NOT_FOUND
          ? "Item not found"
          : "An error has occurred on the server.";
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
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => {
      res.json(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      const errorMessage =
        error.statusCode === NOT_FOUND
          ? "Item not found"
          : "An error has occurred on the server.";
      return res
        .status(error.statusCode || SERVER_ERROR)
        .json({ message: errorMessage });
    });
};
module.exports = { getItems, createItem, deleteItem, dislikeItem, likeItem };
