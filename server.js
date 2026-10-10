
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const SESSION_DURATION = 30 * 60 * 1000;
const PRODUCT_PRICES = {
  1: 69999,
  2: 59999,
  3: 69999,
  4: 28999,
  5: 62999,
  6: 89999,
  7: 62999,
  8: 89999,
  9: 4999,
  10: 1999,
  11: 1499,
  12: 2499,
  13: 29999,
  14: 1999,
  15: 2499,
  16: 799,
  17: 8999,
  18: 3999,
  19: 5999,
  20: 999,
  21: 4499,
  22: 2499,
  23: 59999,
  24: 17999,
  25: 4999
};

// -------------------- DATABASE --------------------

const db = new Database(path.join(__dirname, "techworld.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

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
// Add total_amount column if it does not exist
const orderColumns = db.prepare("PRAGMA table_info(orders)").all();

if (!orderColumns.some(column => column.name === "total_amount")) {
  db.exec(
    "ALTER TABLE orders ADD COLUMN total_amount REAL NOT NULL DEFAULT 0"
  );
}

// -------------------- MIDDLEWARE --------------------

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Demo sessions are stored in memory.
// Restarting the server logs out all admins.
const adminSessions = new Map();

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  const expiresAt = adminSessions.get(token);

  if (!token || !expiresAt || Date.now() >= expiresAt) {
    if (token) adminSessions.delete(token);

    return res.status(401).json({
      success: false,
      message: "Session expired or unauthorized. Please log in again."
    });
  }

  next();
}

// -------------------- HEALTH CHECK --------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechWorld Backend is running!",
    mode: "Demo",
    database: "SQLite",
    realPaymentsEnabled: false
  });
});

// -------------------- PRODUCTS API --------------------

app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    message: "Products API is working",
    products: []
  });
});

// -------------------- ADMIN LOGIN --------------------

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return res.status(500).json({
      success: false,
      message: "Admin credentials are not configured in backend/.env."
    });
  }

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username !== expectedUser ||
    password !== expectedPassword
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password."
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  adminSessions.set(token, Date.now() + SESSION_DURATION);

  return res.json({
    success: true,
    message: "Login successful",
    token
  });
});

// -------------------- ADMIN LOGOUT --------------------

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const token = req.headers.authorization.slice(7);
  adminSessions.delete(token);

  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

// -------------------- ADMIN ORDERS --------------------

app.get("/api/admin/orders", requireAdmin, (req, res) => {
  try {
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
        order_id: order.order_id,
        customer_name: order.customer_name,
        email: order.email,
        items: JSON.parse(order.items_json),
        payment_mode: order.payment_mode,
        payment_status: order.payment_status,
        created_at: order.created_at
      }))
    });
  } catch (error) {
    console.error("Orders retrieval failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not retrieve orders."
    });
  }
});

// -------------------- DEMO CHECKOUT --------------------

app.post("/api/checkout", (req, res) => {
  const {
    customerName,
    email,
    items,
    paymentMethod,
    demoOutcome,
    bank
  } = req.body || {};

  if (
    typeof customerName !== "string" ||
    !customerName.trim() ||
    customerName.trim().length > 100 ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid customer details and cart items are required."
    });
  }

  if (
    !["UPI", "CARD", "NET_BANKING"].includes(paymentMethod) ||
    !["SUCCESS", "FAILURE"].includes(demoOutcome)
  ) {
    return res.status(400).json({
      success: false,
      message: "Select a valid demo payment method and outcome."
    });
  }

  if (paymentMethod === "NET_BANKING" &&
      !["SBI", "HDFC", "ICICI", "OTHER"].includes(bank)) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid demo bank."
    });
  }

  const validItems = items.every(item =>
    item &&
    (
      typeof item.productId === "string" ||
      (typeof item.productId === "number" &&
       Number.isSafeInteger(item.productId))
    ) &&
    String(item.productId).length > 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 99
  );

  if (!validItems) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart item details."
    });
  }

  const hasUnknownProduct = items.some(
    item => !PRODUCT_PRICES[Number(item.productId)]
  );

  if (hasUnknownProduct) {
    return res.status(400).json({
      success: false,
      message: "Cart contains an unknown product."
    });
  }

  const totalAmount = items.reduce((sum, item) => {
    return sum +
      PRODUCT_PRICES[Number(item.productId)] * item.quantity;
  }, 0);

  const orderId = "TW-DEMO-" + crypto.randomUUID();

  const savedPaymentMode =
    paymentMethod === "NET_BANKING"
      ? `NET_BANKING (${bank})`
      : paymentMethod;

  const paymentStatus =
    demoOutcome === "SUCCESS" ? "SUCCESS" : "FAILED";

  try {
    db.prepare(`
      INSERT INTO orders
        (order_id, customer_name, email, items_json,
         payment_mode, payment_status, total_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      customerName.trim(),
      email.trim().toLowerCase(),
      JSON.stringify(items),
      savedPaymentMode,
      paymentStatus,
      totalAmount
    );

    return res.status(201).json({
      success: true,
      orderId,
      totalAmount,
      paymentMode: savedPaymentMode,
      paymentStatus,
      message: paymentStatus === "SUCCESS"
        ? "Demo payment successful. No real payment was taken."
        : "Demo payment failed. No real payment was taken."
    });
  } catch (error) {
    console.error("Order save failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not save the demo order."
    });
  }
});

// -------------------- ERROR HANDLING --------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error("Request error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.status === 400
      ? "Invalid JSON request."
      : "An unexpected server error occurred."
  });
});

// -------------------- START SERVER --------------------

const server = app.listen(PORT, () => {
  console.log(`TechWorld backend running at http://localhost:${PORT}`);
  console.log("SQLite database ready.");
  console.log("Demo mode: real payments are disabled.");
  console.log(
    "Admin credentials configured:",
    Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD)
  );
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
