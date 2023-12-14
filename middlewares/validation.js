const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateClothingItem = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Invalid URL format.");
        }
        return value;
      }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Invalid URL format.");
        }
        return value;
      }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string()
      .uri()
      .allow("")
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Invalid URL format.");
        }
        return value;
      }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateItemID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().length(24).hex().messages({
      "string.empty": 'The "itemId" parameter must be provided',
      "string.length": 'The "itemId" parameter must be a string of length 24',
      "string.hex": 'The "itemId" parameter must be a hexadecimal string',
    }),
  }),
});

module.exports = {
  validateAuthentication,
  validateItemID,
  validateClothingItem,
  validateId,
  validateURL,
  validateUserInfo,
  validateProfileUpdate,
};
