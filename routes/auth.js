const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Resources Database
const resources = require('../data/resources.json');

// DEBUG: Log JWT_SECRET on startup
console.log('✓ JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES (has value)' : 'NO (undefined)');

// Middleware: Authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied - no token' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, year, codingExp, languages } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ 
      email, 
      password, 
      year, 
      codingExp: codingExp || 'beginner',
      languages: languages ? languages.split(',').map(l => l.trim()) : []
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        year: user.year,
        codingExp: user.codingExp 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        year: user.year, 
        codingExp: user.codingExp,
        learningPath: user.learningPath 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile + Save Learning Path
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { year, codingExp, languages, learningPath } = req.body;
    const updates = {};
    
    if (year) updates.year = year;
    if (codingExp) updates.codingExp = codingExp;
    if (languages) updates.languages = Array.isArray(languages) ? languages : languages.split(',');
    if (learningPath) {
      updates.$push = { learningPath };
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      updates,
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Personalized Resources
router.get('/resources', authenticateToken, (req, res) => {
  try {
    const { year, interests } = req.query;
    let filtered = resources.filter(r => 
      (!year || r.suitableYears.includes(year)) &&
      (!interests || r.tags.some(t => interests.includes(t)))
    );
    res.json(filtered.slice(0, 5));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate Resource
router.post('/rate', authenticateToken, async (req, res) => {
  try {
    const { resourceId, rating } = req.body;
    if (!resourceId || !rating) {
      return res.status(400).json({ error: 'resourceId and rating are required' });
    }

    const user = await User.findById(req.user.userId);
    user.ratings.set(resourceId, rating);
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout (for frontend to clear token)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;

