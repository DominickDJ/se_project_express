const { ClothingItem } = require("../models/clothingItem");
const { User } = require("../models/user");
const { NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// Controller to get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clothing items" });
  }
};

// Controller to create a new clothing item
const createItem = async (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create clothing item" });
  }
};

// Controller to delete a clothing item by _id
const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const deletedItem = await ClothingItem.findByIdAndRemove(itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete clothing item" });
  }
};

//Like/Dislike Controllers

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
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      res
        .status(error.statusCode || SERVER_ERROR)
        .json({ message: error.message });
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
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`,
      );
      res
        .status(error.statusCode || SERVER_ERROR)
        .json({ message: error.message });
    });
};
module.exports = { getItems, createItem, deleteItem, dislikeItem, likeItem };
