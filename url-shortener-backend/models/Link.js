const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String,
  customAlias: String,
  userId: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expirationDate: Date,
  analytics: [
    {
      timestamp: Date,
      device: String,
      browser: String,
      ip: String
    }
  ]
});

module.exports = mongoose.model('Link', linkSchema);
