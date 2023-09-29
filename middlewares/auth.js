const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const { method, path } = req;

  // Exclude specific routes from authentication
  const excludedRoutes = [
    { method: "POST", path: "/signin" },
    { method: "POST", path: "/signup" },
    { method: "GET", path: "/items" },
  ];
  const isExcludedRoute = excludedRoutes.some(
    (route) => route.method === method && route.path === path,
  );
  if (isExcludedRoute) {
    return next();
  }
  // Check if the authorization header is present
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
  // Extract the token from the authorization header
  const token = authorization.replace("Bearer ", "");
  try {
    // Verify the token and extract the payload/ return response
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
