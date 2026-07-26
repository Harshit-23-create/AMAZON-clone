import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '');


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback(async (product) => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      const text = await res.text();
      if (text.trim().startsWith('<')) throw new Error("Received HTML");
      const data = JSON.parse(text);
      if (res.ok) {
        setCartItems(data.cart);
        setCartOpen(true);
      }
    } catch (err) {
      console.warn('Add to cart fallback:', err);
      // Fallback local cart behavior
      setCartItems(prev => {
        const existing = prev.find(i => i.productId === product._id);
        if (existing) {
          return prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, {
          productId: product._id,
          quantity: 1,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        }];
      });
      setCartOpen(true);
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: 'DELETE',
      });
      const text = await res.text();
      if (text.trim().startsWith('<')) throw new Error("Received HTML");
      const data = JSON.parse(text);
      if (res.ok) setCartItems(data.cart);
    } catch (err) {
      console.warn('Remove cart fallback:', err);
      setCartItems(prev => prev.filter(i => i.productId !== productId));
    }
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      const text = await res.text();
      if (text.trim().startsWith('<')) throw new Error("Received HTML");
      const data = JSON.parse(text);
      if (res.ok) setCartItems(data.cart);
    } catch (err) {
      console.warn('Update cart fallback:', err);
      if (quantity <= 0) {
        setCartItems(prev => prev.filter(i => i.productId !== productId));
      } else {
        setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
      }
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
