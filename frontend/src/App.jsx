import React from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <CartDrawer />
        <main>
          <Hero />
          <ProductGrid />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
