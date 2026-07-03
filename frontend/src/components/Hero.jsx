import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    id: 1,
    headline: 'Find gifts for dads who have it all',
    sub: 'Shop Electronics, Gadgets & More',
    cta: 'Shop Now',
    bg: "url('/hero_image.jpg')",
    color: '#0f2027',
  },
  {
    id: 2,
    headline: 'Upgrade Your Home This Season',
    sub: 'Furniture, Decor & Smart Home Deals',
    cta: 'Explore Deals',
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    color: '#fff',
  },
  {
    id: 3,
    headline: 'Summer Fashion is Here',
    sub: 'New Arrivals in Clothing & Accessories',
    cta: 'Shop Fashion',
    bg: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
    color: '#fff',
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="hero-section">
      {/* Carousel */}
      <div
        className={`hero-carousel ${transitioning ? 'hero-transitioning' : ''}`}
        style={{ background: slide.bg }}
      >
        {/* Overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-content">
          <p className="hero-eyebrow">Amazon Deals</p>
          <h1 className="hero-headline">{slide.headline}</h1>
          <p className="hero-sub">{slide.sub}</p>
          <button className="hero-cta">{slide.cta} →</button>
        </div>

        {/* Controls */}
        <button className="hero-arrow hero-arrow-left" onClick={prev}>
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button className="hero-arrow hero-arrow-right" onClick={next}>
          <i className="fa-solid fa-chevron-right" />
        </button>

        {/* Dots */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* Deals Banner */}
      <div className="deals-banner">
        <div className="deals-banner-inner">
          <div className="deal-pill">
            <i className="fa-solid fa-bolt" /> Today's Deal
          </div>
          <div className="deal-pill">
            <i className="fa-solid fa-fire" /> Best Sellers
          </div>
          <div className="deal-pill">
            <i className="fa-solid fa-tags" /> Coupons
          </div>
          <div className="deal-pill">
            <i className="fa-solid fa-truck-fast" /> Free Shipping
          </div>
          <div className="deal-pill">
            <i className="fa-solid fa-star" /> Prime Deals
          </div>
          <div className="deal-pill">
            <i className="fa-solid fa-percent" /> Up to 60% Off
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
