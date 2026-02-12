const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Resources Database (move to MongoDB later)
const resources = require('../data/resources.json');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, year, codingExp, languages } = req.body;
    const user = new User({ 
      email, 
      password, 
      year, 
      codingExp, 
      languages: languages ? languages.split(',') : []
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, year } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, year: user.year, learningPath: user.learningPath } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

// Update Profile + Save Learning Path
router.put('/profile', authenticateToken, async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.userId, 
    { 
      $set: updates,
      $push: { 
        learningPath: { 
          $each: updates.learningPath || [],
          $position: 0 
        } 
      }
    },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Get Personalized Resources
router.get('/resources', authenticateToken, (req, res) => {
  const { year, interests } = req.query;
  let filtered = resources.filter(r => 
    (!year || r.suitableYears.includes(year)) &&
    (!interests || r.tags.some(t => interests.includes(t)))
  );
  res.json(filtered.slice(0, 5));
});

// Rate Resource
router.post('/rate', authenticateToken, async (req, res) => {
  const { resourceId, rating } = req.body;
  const user = await User.findById(req.user.userId);
  user.ratings.set(resourceId, rating);
  await user.save();
  res.json({ success: true });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = router;