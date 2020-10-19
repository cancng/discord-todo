const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const User = require('../models/user');

passport.serializeUser((user, cb) => {
  console.log('SERIALIZEUSER', user);
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  return user ? cb(null, user) : cb(null, null);
  /* if (user) {
    cb(null, user);
    console.log('DESERIALIZE INCOMING ID: ', id);
    console.log('NOW req.user HAS: ', user);
  } */
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CLIENT_REDIRECT,
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const user = await User.findOne({ discordId: profile.id });
        if (user) {
          console.log('User exists in our db.');
          await User.updateOne({
            username: `${profile.username}#${profile.discriminator}`,
          });
          cb(null, user);
        } else {
          console.log('User doesnt exist in our db, creating...');
          const newUser = await User.create({
            discordId: profile.id,
            username: `${profile.username}#${profile.discriminator}`,
          });
          cb(null, newUser);
        }
      } catch (err) {
        console.log('strategy err', err.message);
        cb(err, null);
      }
    },
  ),
);
