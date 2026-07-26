import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function Navbar({ searchTerm = '', onSearchChange, selectedCategory = 'All', onCategoryChange }) {
  const { totalItems, setCartOpen } = useCart();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="site-header">
      {/* ── Top bar ── */}
      <div className="navbar">
        {/* Logo */}
        <a href="/" className="nav-logo" aria-label="Amazon Home">
          <img src="/amazon_logo.png" alt="Amazon" />
        </a>

        {/* Delivery */}
        <div className="nav-delivery nav-hover-border">
          <span className="nav-line1">Deliver to</span>
          <span className="nav-line2">
            <i className="fa-solid fa-location-dot" style={{ color: '#f59e0b' }} />
            &nbsp;India
          </span>
        </div>

        {/* Search */}
        <div className={`nav-search ${searchFocused ? 'focused' : ''}`}>
          <select 
            className="search-select" 
            aria-label="Search category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Clothes">Clothes</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Health">Health</option>
            <option value="Beauty">Beauty</option>
            <option value="Pets">Pets</option>
            <option value="Crafts">Crafts</option>
            <option value="Fashion">Fashion</option>
          </select>
          <input
            type="search"
            placeholder="Search Amazon.in"
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="Search"
          />
          <button className="search-btn" aria-label="Search" onClick={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>


        {/* Right actions */}
        <div className="nav-actions">
          {/* Language */}
          <div className="nav-hover-border nav-lang">
            <img
              src="https://flagcdn.com/w20/in.png"
              alt="India flag"
              style={{ width: 20, borderRadius: 2 }}
            />
            <span className="nav-line2">EN ▾</span>
          </div>

          {/* Account */}
          <div className="nav-hover-border nav-account">
            <span className="nav-line1">Hello, sign in</span>
            <span className="nav-line2">Account &amp; Lists ▾</span>
          </div>

          {/* Orders */}
          <div className="nav-hover-border nav-orders">
            <span className="nav-line1">Returns</span>
            <span className="nav-line2">&amp; Orders</span>
          </div>

          {/* Cart */}
          <button
            className="nav-cart-btn nav-hover-border"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${totalItems} items`}
          >
            <div className="nav-cart-icon-wrap">
              <i className="fa-solid fa-cart-shopping" />
              <span className={`cart-count ${totalItems > 0 ? 'has-items' : ''}`}>
                {totalItems}
              </span>
            </div>
            <span className="nav-line2">Cart</span>
          </button>
        </div>
      </div>

      {/* ── Secondary nav ── */}
      <nav className="subnav" aria-label="Secondary navigation">
        <a href="#" className="subnav-item subnav-all">
          <i className="fa-solid fa-bars" /> &nbsp;All
        </a>
        {["Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell", "New Releases", "Prime"].map((item) => (
          <a href="#" className="subnav-item" key={item}>{item}</a>
        ))}
        <a href="#" className="subnav-item subnav-promo" style={{ marginLeft: 'auto' }}>
          🔥 Shop deals in Electronics
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
