const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const token = u => jwt.sign({ id: u._id, name: u.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || (password || '').length < 8)
    return res.status(400).json({ error: 'Enter a name, a valid email and a password of 8+ characters.' });
  try {
    const u = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10) });
    res.json({ token: token(u), name: u.name });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'That email is already registered.' });
    res.status(500).json({ error: 'Could not create the account.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  const u = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(password || '', u.passwordHash)))
    return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ token: token(u), name: u.name });
};
