const mongoose = require("mongoose");

const WatchingProductSchema = new mongoose.Schema({
  brand: String,
  name: String,
  package: String,
  unit: String,
  currentPrice: Number,
  highest: mongoose.Schema.Types.Mixed,
  lowest: mongoose.Schema.Types.Mixed,
  diffIndex: Number,
  competitors: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const WatchingProductModel = mongoose.model('WatchingProduct', WatchingProductSchema);

module.exports = {
  WatchingProductModel
}