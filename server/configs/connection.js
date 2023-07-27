const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/DailyCalm');

module.exports = mongoose.connection;
