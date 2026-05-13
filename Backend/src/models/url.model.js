// models/url.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  redirectURL: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: "guest"  // null = guest user
  },
  visitHistory: [
    {
      ip: String,
      referrer: String,
      userAgent: String,
      country: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // guest links expire in 7 days
  }
});

// TTL index: auto-delete guest links after 7 days
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);