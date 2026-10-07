const mongoose = require('mongoose');
const Product = require('../models/Product');

const samples = [
  ['Slate Mug', 'Hand-thrown stoneware mug with a matte slate glaze. Holds 350 ml.', 2400, 25, '#4A5568'],
  ['Cobalt Bowl', 'Deep bowl for noodles or cereal. Dishwasher safe.', 3200, 18, '#2F4BFF'],
  ['Moss Planter', 'Small planter with drainage hole and saucer.', 2800, 12, '#5B7F5A'],
  ['Ash Pitcher', 'One-litre pitcher with a pinched spout that pours cleanly.', 5400, 8, '#A7ADB5'],
  ['Plum Dish', 'Shallow dish for rings, keys or olives.', 1600, 40, '#6B3F69'],
  ['Sand Carafe', 'Carafe with a wooden stopper. Holds 750 ml.', 4600, 10, '#C9B79C']
];

module.exports = async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  if ((await Product.countDocuments()) === 0)
    await Product.insertMany(samples.map(([name, description, price, stock, color]) => ({ name, description, price, stock, color })));
  console.log('MongoDB connected');
};
