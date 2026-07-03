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

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Clothes', 'Electronics', 'Furniture', 'Health', 'Beauty', 'Pets', 'Crafts', 'Fashion'];

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setProducts(d); setLoading(false); })
      .catch(() => { setError('Could not load products. Make sure the backend is running.'); setLoading(false); });
  }, []);

  const filtered = activeFilter === 'All' ? products : products.filter((p) => p.category === activeFilter);

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
    <section className="products-section">
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
            className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="product-grid">
        {filtered.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
