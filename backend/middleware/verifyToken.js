import jwt from 'jsonwebtoken';

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header (Expecting: "Bearer <token>")
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token after "Bearer"
  
  console.log("Authorization Header:", req.header('Authorization')); // Debugging the header
  console.log("Extracted Token:", token); // Debugging the token

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT secret
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach the decoded token (user info) to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);  // Log the error for debugging
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to verify if the user is an admin
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only.' });
  }
  next();  // Proceed to the next middleware or route handler
};
