const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      index: true // Fast queries by shortId
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null // null = guest link, ObjectId = registered user's link
    },
    ipAddress: {
      type: String,
      required: true
    },
    referrer: {
      type: String,
      default: 'direct' // Default to 'direct' if no referrer header
    },
    userAgent: {
      type: String,
      default: 'unknown'
    },
    // Geo-location data extracted from IP
    country: {
      type: String,
      default: 'unknown'
    },
    region: {
      type: String,
      default: 'unknown'
    },
    city: {
      type: String,
      default: 'unknown'
    },
    timezone: {
      type: String,
      default: 'unknown'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true // Fast time-range queries
    }
  },
  { timestamps: false } // Don't need updatedAt for clicks
);

// Compound index for fast analytics queries: filter by shortId + sort by timestamp
clickSchema.index({ shortId: 1, timestamp: -1 });

// Index for registered user analytics
clickSchema.index({ user: 1, timestamp: -1 });

const Click = mongoose.model('Click', clickSchema);

module.exports = Click;