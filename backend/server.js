require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let Product;
try {
  Product = require('../database/models/Product');
} catch (e) {
  Product = null;
}

const app = express();
const PORT = process.env.PORT || 5000;

// Default fallback products array for zero-downtime resume previews
const defaultProducts = [
  {
    _id: "650000000000000000000001",
    name: "Men's Casual Wear",
    description: "Comfortable and stylish clothes for everyday use. Premium cotton blend with modern fit.",
    imageUrl: "box1_image.jpg",
    price: 29.99,
    category: "Clothes",
    rating: 4.3,
    reviews: 1248,
  },
  {
    _id: "650000000000000000000002",
    name: "Health & Personal Care Essentials",
    description: "Top health and personal care items for a healthy lifestyle. Trusted by millions.",
    imageUrl: "box2_image.jpg",
    price: 15.49,
    category: "Health",
    rating: 4.5,
    reviews: 3892,
  },
  {
    _id: "650000000000000000000003",
    name: "Modern Furniture",
    description: "Decorate your home with elegant, contemporary furniture. Built to last.",
    imageUrl: "box3_image.jpg",
    price: 120.00,
    category: "Furniture",
    rating: 4.1,
    reviews: 567,
  },
  {
    _id: "650000000000000000000004",
    name: "Latest Electronics",
    description: "Cutting-edge gadgets and electronics for the modern era. Fast and powerful.",
    imageUrl: "box4_image.jpg",
    price: 199.99,
    category: "Electronics",
    rating: 4.7,
    reviews: 8210,
  },
  {
    _id: "650000000000000000000005",
    name: "Beauty & Makeup Kits",
    description: "Premium beauty and makeup essentials. Glow up with the best.",
    imageUrl: "box5_image.jpg",
    price: 45.00,
    category: "Beauty",
    rating: 4.4,
    reviews: 2103,
  },
  {
    _id: "650000000000000000000006",
    name: "Pet Supplies",
    description: "Everything your furry friends need. Healthy, happy, and playful.",
    imageUrl: "box6_image.jpg",
    price: 25.00,
    category: "Pets",
    rating: 4.6,
    reviews: 987,
  },
  {
    _id: "650000000000000000000007",
    name: "Arts & Crafts",
    description: "Get creative with our wide range of craft supplies. Spark your imagination.",
    imageUrl: "box7_image.jpg",
    price: 18.50,
    category: "Crafts",
    rating: 4.2,
    reviews: 431,
  },
  {
    _id: "650000000000000000000008",
    name: "Fashion Trends",
    description: "Discover the latest fashion trends. Stay ahead of the curve.",
    imageUrl: "box8_image.jpg",
    price: 55.00,
    category: "Fashion",
    rating: 4.5,
    reviews: 1754,
  },
];

// Dynamic CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Always allow requests for API access
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Connect to MongoDB if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('⚠️ MongoDB connection warning (using fallback data):', err.message));
} else {
  console.log('ℹ️ MONGODB_URI not provided. Running with memory fallback data.');
}

// Helper to check DB readiness
const isDbConnected = () => mongoose.connection.readyState === 1;

// ─── PRODUCT ROUTES ────────────────────────────────────────────────────────────

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    if (isDbConnected() && Product) {
      const products = await Product.find();
      if (products && products.length > 0) {
        return res.json(products);
      }
    }
    res.json(defaultProducts);
  } catch (error) {
    res.json(defaultProducts);
  }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    if (isDbConnected() && Product) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
    const fallback = defaultProducts.find((p) => p._id === req.params.id);
    if (!fallback) return res.status(404).json({ error: 'Product not found' });
    res.json(fallback);
  } catch (error) {
    const fallback = defaultProducts.find((p) => p._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ─── CART ROUTES ───────────────────────────────────────────────────────────────
let cart = [];

// GET cart items
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// POST - Add item to cart
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let product = null;
    
    if (isDbConnected() && Product) {
      product = await Product.findById(productId).catch(() => null);
    }
    if (!product) {
      product = defaultProducts.find((p) => p._id === productId);
    }
    
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

// Start server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

