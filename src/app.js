require('dotenv').config();
require('./strategies/discordstrategy');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoSessionStore = require('connect-mongo')(session);
const passport = require('passport');
const cors = require('cors');
const { db, mongooseConnection } = require('./database');
const authRoute = require('./routes/auth');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const isAuthorized = require('./middleware/authMiddleware');

const PORT = process.env.PORT || 5001;
db();
// Middlewares
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: 'e6f203cb62aaf4e02a6a17b04b5ff2f1',
    cookie: {
      maxAge: 60000 * 60,
    },
    saveUninitialized: false,
    resave: false,
    name: 'discord-todo',
    store: new MongoSessionStore({ mongooseConnection }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', isAuthorized, (req, res) => {
  res.send('Home');
});

app.use('/auth', authRoute);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () =>
  console.log(`Server is listening to requests on port ${PORT}`),
);
