const router = require('express').Router();
const passport = require('passport');
const isAuthorized = require('../middleware/authMiddleware');

router.get('/', passport.authenticate('discord'));

router.get(
  '/redirect',
  passport.authenticate('discord', {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  },
);

router.get('/user', isAuthorized, (req, res) => {
  res.json(req.user);
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
