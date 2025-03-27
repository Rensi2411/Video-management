import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
