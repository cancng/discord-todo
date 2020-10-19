const mongoose = require('mongoose');

const db = async () => {
  try {
    const cn = await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected to host: ${cn.connection.host}`);
  } catch (err) {
    console.error(`Database Error: ${err.message}`);
  }
};

module.exports = { db, mongooseConnection: mongoose.connection };
