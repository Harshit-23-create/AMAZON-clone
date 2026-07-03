import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback(async (product) => {
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart);
        setCartOpen(true);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) setCartItems(data.cart);
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (res.ok) setCartItems(data.cart);
    } catch (err) {
      console.error('Update cart error:', err);
    }
  }, []);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartOpen, setCartOpen, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
