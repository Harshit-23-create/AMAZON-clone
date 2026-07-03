import React from 'react';
import { useCart } from '../context/CartContext';

function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Shopping cart">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <i className="fa-solid fa-cart-shopping" style={{ color: '#f59e0b', marginRight: 8 }} />
            <h2>Your Cart</h2>
            {totalItems > 0 && <span className="cart-item-count">{totalItems}</span>}
          </div>
          <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <i className="fa-solid fa-cart-shopping" />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
              <button className="btn-continue-shopping" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item) => (
                <li className="cart-item" key={item.productId}>
                  <img src={`/${item.imageUrl}`} alt={item.name} className="cart-item-thumb" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price-unit">${item.price.toFixed(2)} each</p>
                    <div className="cart-qty-row">
                      <button
                        className="qty-ctrl"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-ctrl"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      className="cart-remove"
                      onClick={() => removeFromCart(item.productId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
              <span className="cart-summary-price">${totalPrice.toFixed(2)}</span>
            </div>
            <p className="cart-free-shipping">
              <i className="fa-solid fa-truck-fast" /> Your order qualifies for <strong>FREE Delivery</strong>
            </p>
            <button
              className="btn-checkout"
              onClick={() => alert(`✅ Order placed!\nTotal: $${totalPrice.toFixed(2)}\nThank you for shopping!`)}
            >
              Proceed to Checkout
              <i className="fa-solid fa-arrow-right" />
            </button>
            <button className="btn-continue-shop" onClick={() => setCartOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
