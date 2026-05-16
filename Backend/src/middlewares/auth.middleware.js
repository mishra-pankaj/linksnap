const jwt = require("jsonwebtoken");

// Required auth - throws error if no token
const authRequired = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized access",
      code: "NO_TOKEN",
      message: "Authentication token is required"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user role is "user" (registered user)
    if (decoded.role !== "user") {
      return res.status(403).json({
        error: "Forbidden",
        code: "INVALID_ROLE",
        message: "You don't have access to this resource"
      });
    }

    // Set req.user with decoded JWT data
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
      code: "INVALID_TOKEN",
      message: "Token is expired or invalid"
    });
  }
};

// Optional auth - doesn't throw error if no token
// If token exists and is valid: sets req.user
// If no token or invalid: continues anyway with req.user = undefined (guest)
const authOptional = (req, res, next) => {
  
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  // If no token, just continue as guest
  if (!token) {
    req.user = undefined;
    return next();
  }

  // Token exists, try to verify
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Only set req.user if role is "user"
    if (decoded.role === "user") {
      req.user = decoded;
    } else {
      // Token is valid but user is not "user" role - treat as guest
      req.user = undefined;
    }
    
    next();
  } catch (error) {
    // Token is invalid or expired - treat as guest
    console.log('Invalid token in optional auth:', error.message);
    req.user = undefined;
    next();
  }
};

// Export both as methods on an object
const auth = {
  required: authRequired,
  optional: authOptional
};

module.exports = auth;