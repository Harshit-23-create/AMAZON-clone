require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Men's Casual Wear",
    description: "Comfortable and stylish clothes for everyday use. Premium cotton blend with modern fit.",
    imageUrl: "box1_image.jpg",
    price: 29.99,
    category: "Clothes",
    rating: 4.3,
    reviews: 1248,
  },
  {
    name: "Health & Personal Care Essentials",
    description: "Top health and personal care items for a healthy lifestyle. Trusted by millions.",
    imageUrl: "box2_image.jpg",
    price: 15.49,
    category: "Health",
    rating: 4.5,
    reviews: 3892,
  },
  {
    name: "Modern Furniture",
    description: "Decorate your home with elegant, contemporary furniture. Built to last.",
    imageUrl: "box3_image.jpg",
    price: 120.00,
    category: "Furniture",
    rating: 4.1,
    reviews: 567,
  },
  {
    name: "Latest Electronics",
    description: "Cutting-edge gadgets and electronics for the modern era. Fast and powerful.",
    imageUrl: "box4_image.jpg",
    price: 199.99,
    category: "Electronics",
    rating: 4.7,
    reviews: 8210,
  },
  {
    name: "Beauty & Makeup Kits",
    description: "Premium beauty and makeup essentials. Glow up with the best.",
    imageUrl: "box5_image.jpg",
    price: 45.00,
    category: "Beauty",
    rating: 4.4,
    reviews: 2103,
  },
  {
    name: "Pet Supplies",
    description: "Everything your furry friends need. Healthy, happy, and playful.",
    imageUrl: "box6_image.jpg",
    price: 25.00,
    category: "Pets",
    rating: 4.6,
    reviews: 987,
  },
  {
    name: "Arts & Crafts",
    description: "Get creative with our wide range of craft supplies. Spark your imagination.",
    imageUrl: "box7_image.jpg",
    price: 18.50,
    category: "Crafts",
    rating: 4.2,
    reviews: 431,
  },
  {
    name: "Fashion Trends",
    description: "Discover the latest fashion trends. Stay ahead of the curve.",
    imageUrl: "box8_image.jpg",
    price: 55.00,
    category: "Fashion",
    rating: 4.5,
    reviews: 1754,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany(products);
    console.log('🌱 Seeded', products.length, 'products successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
