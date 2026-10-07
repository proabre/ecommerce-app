# Kiln — e-commerce store

Express + MongoDB (Mongoose) backend, plain HTML/CSS/JS frontend.

## Run
1. Start MongoDB locally, or create a free MongoDB Atlas database and copy its connection string.
2. Put the connection string in `server/.env` as `MONGO_URI` and change `JWT_SECRET`.
3. Then:

       cd server
       npm install
       npm start

Open http://localhost:3000. Six sample products are added the first time the server starts.

## Structure
- server/config/db.js — MongoDB connection and sample data
- server/models — Mongoose schemas (User, Product, Order)
- server/controllers — request handling
- server/routes — URL mapping (/api/register, /api/login, /api/products, /api/orders)
- server/middleware/authMiddleware.js — checks the login token
- public — pages, css/style.css and js/ (app.js holds shared helpers)

## Notes
Prices and stock are checked on the server when an order is placed. Stock is reduced with an atomic update, and put back if any item in the order fails. No payment is taken.
