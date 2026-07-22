const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, no token provided'
      });
    }

    // 2) Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_dealership_jwt_key_2026'
      );
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, invalid token'
      });
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'User belonging to this token no longer exists'
      });
    }

    // 4) Attach user cleanly to req.user
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
