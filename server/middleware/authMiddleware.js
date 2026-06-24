const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JSON_USERS_PATH = path.join(__dirname, '..', 'data', 'users.json');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ca_ranker_ai_luxury_academic_key_2026');

      // Fetch user details from JSON file database
      let users = [];
      if (fs.existsSync(JSON_USERS_PATH)) {
        users = JSON.parse(fs.readFileSync(JSON_USERS_PATH, 'utf-8') || '[]');
      }
      
      const localUser = users.find(u => u._id === decoded.id);
      
      if (!localUser) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      
      // Pack the authorized user object into the request
      req.user = { 
        id: localUser._id,
        fullName: localUser.fullName,
        email: localUser.email,
        examLevel: localUser.examLevel
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
