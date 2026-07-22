exports.restrictToAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied: Admin role required'
    });
  }
  next();
};
