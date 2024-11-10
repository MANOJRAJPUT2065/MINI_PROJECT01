import jwt from 'jsonwebtoken';

// User data (this is just an example, replace with your actual user data)
const user = {
  id: '671405c7fab4c4acc12c173e',    // The user ID from your database or authentication system
  email: 'smanojsingh073@gmail.com',  // The user's email address (or any other user info)
  role: 'admin'  // User role (e.g., admin, user, etc.)
};

// Secret key (make sure this is kept private and is the same in your verification middleware)
const JWT_SECRET = 'secret';  // Replace with your actual secret key (usually stored in environment variables)

// Generate a JWT token with a payload (user data) and a secret key
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },  // Payload: user data you want to encode
  JWT_SECRET,  // Secret key used to sign the token
  { expiresIn: '1h' }  // Expiration time for the token (optional)
);

// Output the token (for testing purposes, but make sure you don't expose it in production logs)
console.log('Generated JWT Token:', token);
