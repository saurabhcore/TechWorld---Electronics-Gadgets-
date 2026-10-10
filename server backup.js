
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
require("dotenv").config();
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

// Database file will be created inside backend folder
const db = new Database("techworld.db");

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    items_json TEXT NOT NULL,
    payment_mode TEXT NOT NULL DEFAULT 'SIMULATION',
    payment_status TEXT NOT NULL DEFAULT 'NOT_PROCESSED',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechWorld Backend is running!",
    mode: "Demo",
    database: "SQLite"
  });
});

// Demo products API
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    message: "TechWorld products API is working",
    products: []
  });
});

// Create and save a demo order
app.post("/api/checkout", (req, res) => {
  const { customerName, email, items } = req.body || {};

  if (
    typeof customerName !== "string" ||
    !customerName.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid customer details and cart items are required."
    });
  }

  const validItems = items.every(item =>
    item &&
    (typeof item.productId === "string" ||
      typeof item.productId === "number") &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= 99
  );

  if (!validItems) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart item details."
    });
  }

  const orderId = "TW-DEMO-" + crypto.randomUUID();

  try {
    db.prepare(`
      INSERT INTO orders
      (order_id, customer_name, email, items_json)
      VALUES (?, ?, ?, ?)
    `).run(
      orderId,
      customerName.trim().slice(0, 100),
      email.trim().toLowerCase().slice(0, 254),
      JSON.stringify(items)
    );

    res.status(201).json({
      success: true,
      orderId,
      message: "Demo order saved successfully. No real payment was taken.",
      paymentMode: "SIMULATION",
      paymentStatus: "NOT_PROCESSED"
    });
  } catch (error) {
    console.error("Order save failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not save the demo order."
    });
  }
});

// View saved demo orders (local presentation only)
app.get("/api/admin/orders", (req, res) => {
  const orders = db.prepare(`
    SELECT order_id, customer_name, email, items_json,
           payment_mode, payment_status, created_at
    FROM orders
    ORDER BY id DESC
    LIMIT 100
  `).all();

  res.json({
    success: true,
    count: orders.length,
    orders: orders.map(order => ({
      ...order,
      items: JSON.parse(order.items_json)
    }))
  });
});

app.listen(PORT, () => {
  console.log(`TechWorld backend running at http://localhost:${PORT}`);
  console.log("SQLite database ready. Demo payments are disabled.");
});
