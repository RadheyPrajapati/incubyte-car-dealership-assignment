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
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Validate required credentials
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists & fetch hidden password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // 3) Verify user existence and password match
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // 4) Generate JWT token
    const token = signToken(user._id, user.role);

    // 5) Prepare sanitized user profile (without password)
    const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    delete userObj.password;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userObj
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const userObj = typeof req.user.toObject === 'function' ? req.user.toObject() : { ...req.user };
    delete userObj.password;

    res.status(200).json({
      status: 'success',
      data: {
        user: userObj
      }
    });
  } catch (error) {
    next(error);
  }
};
