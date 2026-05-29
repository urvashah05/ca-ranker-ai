const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const JSON_DB_PATH = path.join(__dirname, '..', 'data', 'users.json');

// Helper to ensure JSON DB exists and return users
const getJsonUsers = () => {
  const dir = path.dirname(JSON_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

// Helper to save users to JSON DB
const saveJsonUsers = (users) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(users, null, 2));
};

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ca_ranker_ai_luxury_academic_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, examLevel, targetAIR, dailyStudyGoal } = req.body;

    // --- FALLBACK JSON DB MODE ---
    if (process.env.USE_JSON_DB === 'true') {
      const users = getJsonUsers();
      const userExists = users.find(u => u.email === email.toLowerCase());

      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Hash password manually
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'local_' + Date.now(),
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        examLevel,
        targetAIR: targetAIR ? Number(targetAIR) : 100,
        dailyStudyGoal: dailyStudyGoal ? Number(dailyStudyGoal) : 6,
        streak: 0,
        totalStudyHours: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(newUser);
      saveJsonUsers(users);

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          examLevel: newUser.examLevel,
          targetAIR: newUser.targetAIR,
          dailyStudyGoal: newUser.dailyStudyGoal,
          streak: newUser.streak,
          totalStudyHours: newUser.totalStudyHours,
        },
      });
    }

    // --- STANDARD MONGODB MODE ---
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      examLevel,
      targetAIR: targetAIR ? Number(targetAIR) : 100,
      dailyStudyGoal: dailyStudyGoal ? Number(dailyStudyGoal) : 6,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          examLevel: user.examLevel,
          targetAIR: user.targetAIR,
          dailyStudyGoal: user.dailyStudyGoal,
          streak: user.streak,
          totalStudyHours: user.totalStudyHours,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- FALLBACK JSON DB MODE ---
    if (process.env.USE_JSON_DB === 'true') {
      const users = getJsonUsers();
      const user = users.find(u => u.email === email.toLowerCase());

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          examLevel: user.examLevel,
          targetAIR: user.targetAIR,
          dailyStudyGoal: user.dailyStudyGoal,
          streak: user.streak,
          totalStudyHours: user.totalStudyHours,
        },
      });
    }

    // --- STANDARD MONGODB MODE ---
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        examLevel: user.examLevel,
        targetAIR: user.targetAIR,
        dailyStudyGoal: user.dailyStudyGoal,
        streak: user.streak,
        totalStudyHours: user.totalStudyHours,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // --- FALLBACK JSON DB MODE ---
    if (process.env.USE_JSON_DB === 'true') {
      const users = getJsonUsers();
      const user = users.find(u => u._id === req.user.id);

      if (user) {
        return res.json({
          success: true,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            examLevel: user.examLevel,
            targetAIR: user.targetAIR,
            dailyStudyGoal: user.dailyStudyGoal,
            streak: user.streak,
            totalStudyHours: user.totalStudyHours,
          },
        });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    // --- STANDARD MONGODB MODE ---
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          examLevel: user.examLevel,
          targetAIR: user.targetAIR,
          dailyStudyGoal: user.dailyStudyGoal,
          streak: user.streak,
          totalStudyHours: user.totalStudyHours,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
