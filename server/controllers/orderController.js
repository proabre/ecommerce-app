const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.create = async (req, res) => {
  const { items, address } = req.body || {};
  if (!Array.isArray(items) || !items.length || !address)
    return res.status(400).json({ error: 'Add items and a delivery address.' });

  const taken = []; // stock already reserved, so we can put it back if something fails
  try {
    const lines = [];
    for (const i of items) {
      const q = Number(i.quantity);
      if (!mongoose.isValidObjectId(i.id) || !Number.isInteger(q) || q < 1) throw new Error('Invalid item in cart.');
      // Atomic: only decrements if enough stock is left, so two buyers cannot oversell
      const p = await Product.findOneAndUpdate({ _id: i.id, stock: { $gte: q } }, { $inc: { stock: -q } });
      if (!p) {
        const existing = await Product.findById(i.id);
        throw new Error(existing ? `Only ${existing.stock} left of ${existing.name}.` : 'A product in your cart no longer exists.');
      }
      taken.push({ id: p._id, q });
      lines.push({ product: p._id, name: p.name, quantity: q, price: p.price }); // price comes from the database
    }
    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const order = await Order.create({ user: req.user.id, items: lines, total, address });
    res.json({ orderId: order._id });
  } catch (e) {
    for (const t of taken) await Product.updateOne({ _id: t.id }, { $inc: { stock: t.q } });
    res.status(400).json({ error: e.message });
  }
};

exports.mine = async (req, res) => res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));
