const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord'), (req, res) => {
  // res.json(req.user);
  res.redirect('http://localhost:3000');
});

module.exports = router;
