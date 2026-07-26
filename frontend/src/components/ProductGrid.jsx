import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ORIGINAL_PRICES = {
  "Men's Casual Wear": 49.99,
  "Health & Personal Care Essentials": 24.99,
  "Modern Furniture": 199.00,
  "Latest Electronics": 299.99,
  "Beauty & Makeup Kits": 69.99,
  "Pet Supplies": 39.99,
  "Arts & Crafts": 29.99,
  "Fashion Trends": 89.99,
};

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`fa-star ${s <= fullStars ? 'fa-solid' : hasHalf && s === fullStars + 1 ? 'fa-regular' : 'fa-regular'}`}
          style={{ color: '#f59e0b', fontSize: '0.82rem' }}
        />
      ))}
      <span className="rating-val">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAdd = async () => {
    await addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = ORIGINAL_PRICES[product.name]
    ? Math.round(((ORIGINAL_PRICES[product.name] - product.price) / ORIGINAL_PRICES[product.name]) * 100)
    : null;

  return (
    <div
      className="product-card"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Discount badge */}
      {discount && discount > 0 && (
        <span className="discount-badge">-{discount}%</span>
      )}

      {/* Wishlist */}
      <button
        className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
        onClick={() => setWishlisted((p) => !p)}
        aria-label="Add to wishlist"
      >
        <i className={`fa-heart ${wishlisted ? 'fa-solid' : 'fa-regular'}`} />
      </button>

      {/* Image */}
      <div className="product-image-wrapper">
        <img src={`/${product.imageUrl}`} alt={product.name} className="product-image" />
        <div className="product-image-overlay">
          <button className="quick-view-btn" onClick={handleAdd}>
            <i className="fa-solid fa-cart-plus" /> Quick Add
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="product-body">
        <span className="product-category-tag">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <StarRating rating={product.rating} />
        <span className="product-reviews">
          ({product.reviews.toLocaleString()} reviews)
        </span>

        <p className="product-desc">{product.description}</p>

        {/* Pricing */}
        <div className="product-pricing">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {ORIGINAL_PRICES[product.name] && (
            <span className="product-original-price">
              ${ORIGINAL_PRICES[product.name].toFixed(2)}
            </span>
          )}
        </div>

        {/* Prime badge */}
        <div className="prime-badge">
          <i className="fa-solid fa-bolt" /> Prime — Free delivery
        </div>

        {/* CTA */}
        <button
          className={`btn-add-cart ${added ? 'btn-added' : ''}`}
          onClick={handleAdd}
          disabled={added}
        >
          {added ? (
            <><i className="fa-solid fa-circle-check" /> Added to Cart!</>
          ) : (
            <><i className="fa-solid fa-cart-plus" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '');

const defaultProducts = [
  { _id: "1", name: "Men's Casual Wear", description: "Comfortable and stylish clothes for everyday use. Premium cotton blend with modern fit.", imageUrl: "box1_image.jpg", price: 29.99, category: "Clothes", rating: 4.3, reviews: 1248 },
  { _id: "2", name: "Health & Personal Care Essentials", description: "Top health and personal care items for a healthy lifestyle. Trusted by millions.", imageUrl: "box2_image.jpg", price: 15.49, category: "Health", rating: 4.5, reviews: 3892 },
  { _id: "3", name: "Modern Furniture", description: "Decorate your home with elegant, contemporary furniture. Built to last.", imageUrl: "box3_image.jpg", price: 120.00, category: "Furniture", rating: 4.1, reviews: 567 },
  { _id: "4", name: "Latest Electronics", description: "Cutting-edge gadgets and electronics for the modern era. Fast and powerful.", imageUrl: "box4_image.jpg", price: 199.99, category: "Electronics", rating: 4.7, reviews: 8210 },
  { _id: "5", name: "Beauty & Makeup Kits", description: "Premium beauty and makeup essentials. Glow up with the best.", imageUrl: "box5_image.jpg", price: 45.00, category: "Beauty", rating: 4.4, reviews: 2103 },
  { _id: "6", name: "Pet Supplies", description: "Everything your furry friends need. Healthy, happy, and playful.", imageUrl: "box6_image.jpg", price: 25.00, category: "Pets", rating: 4.6, reviews: 987 },
  { _id: "7", name: "Arts & Crafts", description: "Get creative with our wide range of craft supplies. Spark your imagination.", imageUrl: "box7_image.jpg", price: 18.50, category: "Crafts", rating: 4.2, reviews: 431 },
  { _id: "8", name: "Fashion Trends", description: "Discover the latest fashion trends. Stay ahead of the curve.", imageUrl: "box8_image.jpg", price: 55.00, category: "Fashion", rating: 4.5, reviews: 1754 },
];

function ProductGrid({ searchTerm = '', selectedCategory = 'All', onCategoryChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localCategory, setLocalCategory] = useState('All');

  const activeCategory = selectedCategory !== 'All' ? selectedCategory : localCategory;

  const categories = ['All', 'Clothes', 'Electronics', 'Furniture', 'Health', 'Beauty', 'Pets', 'Crafts', 'Fashion'];

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const text = await r.text();
        if (text.trim().startsWith('<')) throw new Error("Received HTML instead of JSON");
        return JSON.parse(text);
      })
      .then((d) => { setProducts(d); setLoading(false); })
      .catch((err) => { 
        console.warn("API failed, using fallback frontend data:", err);
        setProducts(defaultProducts); 
        setLoading(false); 
      });
  }, []);

  const handleCategorySelect = (cat) => {
    setLocalCategory(cat);
    if (onCategoryChange) onCategoryChange(cat);
  };


  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>Loading products…</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="fa-solid fa-triangle-exclamation" />
      <p>{error}</p>
    </div>
  );

  return (
    <section className="products-section" id="products">
      {/* Section header */}
      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Discover our curated selection of top-rated products</p>
      </div>

      {/* Filter pills */}
      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#999' }} />
          <h3>No products found</h3>
          <p>Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;

