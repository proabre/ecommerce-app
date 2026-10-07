const mongoose = require('mongoose');
// price is stored in cents to avoid rounding errors
module.exports = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  color: String
}));
