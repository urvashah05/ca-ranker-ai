const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ca_ranker_ai_luxury_academic_key_2026');

      // Get user from token and add to request
      if (process.env.USE_JSON_DB === 'true') {
        const fs = require('fs');
        const path = require('path');
        const JSON_DB_PATH = path.join(__dirname, '..', 'data', 'users.json');
        
        let users = [];
        if (fs.existsSync(JSON_DB_PATH)) {
          users = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8') || '[]');
        }
        
        const localUser = users.find(u => u._id === decoded.id);
        if (!localUser) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        
        req.user = { id: localUser._id };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
      }

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
