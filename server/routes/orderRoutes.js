const r = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/orderController');
r.post('/', auth, c.create);
r.get('/', auth, c.mine);
module.exports = r;
