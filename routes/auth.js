const express = require('express');
const User = require('../model/User');
const TestResult = require('../model/TestResult');
const nodemailer = require('nodemailer');
const router = express.Router();


const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  next();
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); 
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


router.post('/submit-test', isAuthenticated, async (req, res) => {
  const { score } = req.body;

  try {
    
    const testResult = new TestResult({
      userId: req.session.userId,
      score: score
    });
    await testResult.save();
    
    
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await User.updateOne(
      { _id: req.session.userId }, 
      { $inc: { testCount: -1 } }
    );
    
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Test Score',
      text: `Hello, \n\nYou scored ${score} points on the test.\n\nBest regards,\nYour Test Team`
    };

    
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Test submitted and email sent.' });
  } catch (error) {
    console.error('Submission or email error:', error);
    res.status(500).json({ error: 'Error submitting test or sending email' });
  }
});

router.get('/check-test-count', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ testCount: user.testCount });
  } catch (error) {
    console.error('Error checking test count:', error);
    res.status(500).json({ error: 'Error checking test count' });
  }
});
module.exports = router;
