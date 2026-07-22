const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_dealership_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already registered with this email'
      });
    }

    // Create new user instance
    const newUser = new User({
      name,
      email,
      password,
      role: role || 'USER'
    });

    await newUser.save();

    // Generate JWT token
    const token = signToken(newUser._id, newUser.role);

    // Prepare response user object (without password)
    const userObj = typeof newUser.toObject === 'function' ? newUser.toObject() : { ...newUser };
    delete userObj.password;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userObj
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: error.message || 'Validation error'
      });
    }
    console.error('Registration error:', error);
    next(error);
  }
};
