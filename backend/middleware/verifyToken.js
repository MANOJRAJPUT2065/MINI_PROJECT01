import jwt from 'jsonwebtoken';

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header (Expecting: "Bearer <token>")
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token after "Bearer"
  
  // Check if the token exists
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT secret
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach the decoded token (user info) to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // Token has expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    
    // JWT Malformed Error (incorrect format of the token)
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token format. Please provide a valid token.' });
    }

    // Other JWT-related errors
    console.error('Token verification failed:', error);  // Log the error for debugging
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to verify if the user is an admin
export const verifyAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  
  next();  // Proceed to the next middleware or route handler
};
