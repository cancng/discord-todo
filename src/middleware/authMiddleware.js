const isAuthorized = (req, res, next) => {
  if (req.user) {
    console.log('User is logged in: ', req.user);
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, please authenticate.');
  }
};

module.exports = isAuthorized