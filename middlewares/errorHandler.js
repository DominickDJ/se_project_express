const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode
    ? err.message
    : "An error occurred on the server.";
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
