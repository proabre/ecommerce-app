const mongoose = require('mongoose');
const Product = require('../models/Product');

exports.list = async (req, res) => res.json(await Product.find());

exports.get = async (req, res) => {
  const p = mongoose.isValidObjectId(req.params.id) && (await Product.findById(req.params.id));
  p ? res.json(p) : res.status(404).json({ error: 'Product not found.' });
};
