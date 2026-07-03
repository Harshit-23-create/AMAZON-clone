import React from 'react';

const footerSections = [
  {
    title: 'Get to Know Us',
    links: ['Careers', 'Blog', 'About Amazon', 'Investor Relations', 'Amazon Devices', 'Amazon Science'],
  },
  {
    title: 'Make Money with Us',
    links: ['Sell products on Amazon', 'Sell on Amazon Business', 'Sell apps on Amazon', 'Become an Affiliate', 'Advertise Your Products', 'Self-Publish with Us'],
  },
  {
    title: 'Amazon Payment Products',
    links: ['Amazon Business Card', 'Shop with Points', 'Reload Your Balance', 'Amazon Currency Converter', 'Gift Cards', 'Amazon Cash'],
  },
  {
    title: 'Let Us Help You',
    links: ['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns & Replacements', 'Manage Content & Devices', 'Amazon Assistant', 'Help'],
  },
];

const trustBadges = [
  { icon: 'fa-shield-halved', label: 'Secure Payments' },
  { icon: 'fa-truck-fast', label: 'Fast Delivery' },
  { icon: 'fa-rotate-left', label: 'Easy Returns' },
  { icon: 'fa-headset', label: '24/7 Support' },
];

function Footer() {
  return (
    <footer className="site-footer">
      {/* Trust badges */}
      <div className="footer-trust">
        {trustBadges.map((b) => (
          <div className="trust-item" key={b.label}>
            <i className={`fa-solid ${b.icon} trust-icon`} />
            <span>{b.label}</span>
          </div>
        ))}
      </div>

      {/* Back to top */}
      <div
        className="footer-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fa-solid fa-chevron-up" style={{ marginRight: '6px' }} />
        Back to top
      </div>

      {/* Links grid */}
      <div className="footer-links-grid">
        {footerSections.map((section) => (
          <div className="footer-col" key={section.title}>
            <h4 className="footer-col-title">{section.title}</h4>
            <ul className="footer-col-list">
              {section.links.map((link) => (
                <li key={link}>
                  <a href="#" className="footer-link">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Bottom */}
      <div className="footer-bottom">
        <img src="/amazon_logo.png" alt="Amazon" className="footer-logo" />
        <div className="footer-legal-links">
          <a href="#" className="footer-legal-link">Conditions of Use</a>
          <a href="#" className="footer-legal-link">Privacy Notice</a>
          <a href="#" className="footer-legal-link">Cookie Preferences</a>
          <a href="#" className="footer-legal-link">Your Ads Privacy Choices</a>
        </div>
        <p className="footer-copyright">© 1996–2025, Amazon.com, Inc. or its affiliates. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
