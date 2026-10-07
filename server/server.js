require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

connectDB()
  .then(() => app.listen(process.env.PORT || 3000, () => console.log(`Shop running at http://localhost:${process.env.PORT || 3000}`)))
  .catch(err => { console.error('Could not connect to MongoDB:', err.message); process.exit(1); });
