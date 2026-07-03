require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('../database/models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ─── PRODUCT ROUTES ────────────────────────────────────────────────────────────

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ─── CART ROUTES ───────────────────────────────────────────────────────────────
// In-memory cart for demonstration (a real app would use sessions/DB)
let cart = [];

// GET cart items
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// POST - Add item to cart
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    res.status(201).json({ message: 'Added to cart', cart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// DELETE - Remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  cart = cart.filter((item) => item.productId !== productId);
  res.json({ message: 'Removed from cart', cart });
});

// PUT - Update cart item quantity
app.put('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const item = cart.find((item) => item.productId === productId);
  if (!item) return res.status(404).json({ error: 'Item not in cart' });
  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  } else {
    item.quantity = quantity;
  }
  res.json({ message: 'Cart updated', cart });
});

// ─── START SERVER ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
