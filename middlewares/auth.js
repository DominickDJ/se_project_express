const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  // Check if the authorization header is present
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized");
  }
  // Extract the token from the authorization header
  const token = authorization.replace("Bearer ", "");
  try {
    // Verify the token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
    // Catch error and return response
  } catch (error) {
    throw new UnauthorizedError("Unauthorized");
  }
  return undefined;
};

module.exports = authMiddleware;
