const { SERVER_ERROR } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const serverError = SERVER_ERROR;

  // Determine the appropriate server error based on the error
  if (err.statusCode && err.message) {
    // If the error has a specific status code and message, use it
    serverError.statusCode = err.statusCode;
    serverError.message = err.message;
  }
  // Add more conditional checks for different types of errors if needed

  res.status(serverError.statusCode).json({ error: serverError.message });
};

module.exports = errorHandler;
