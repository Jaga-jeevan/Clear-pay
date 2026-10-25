import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>AI-Powered Protection</span>
          </div>
          <h1 className="hero-title">
            Secure Banking with <br />
            <span className="gradient-text">AI Fraud Detection</span>
          </h1>
          <p className="hero-subtitle">
            Real-time fraud detection powered by advanced machine learning algorithms.
            Protect your finances with enterprise-grade security.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary btn-large">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Link>
            <a href="#features" className="btn btn-outline btn-large">
              Learn More
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <h3>99.9%</h3>
              <p>Detection Rate</p>
            </div>
            <div className="stat">
              <h3>&lt;1s</h3>
              <p>Analysis Time</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Advanced Features</h2>
          <p className="section-subtitle">
            Cutting-edge technology to protect your financial transactions
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Detection</h3>
              <p>Machine learning models analyze patterns in real-time to identify suspicious activities</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Alerts</h3>
              <p>Instant notifications when fraudulent activity is detected on your account</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Transfers</h3>
              <p>Bank-grade encryption for all transactions with multi-factor authentication</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Transaction Analytics</h3>
              <p>Detailed insights and analytics on your spending patterns and habits</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Beneficiary Management</h3>
              <p>Easily manage and organize your trusted beneficiaries for quick transfers</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Multi-platform</h3>
              <p>Access your account securely from any device, anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Secure Your Finances?</h2>
          <p>Join thousands of users who trust ClearPay for their banking security</p>
          <Link to="/login" className="btn btn-primary btn-large">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>ClearPay</h3>
              <p>AI-powered banking fraud detection</p>
            </div>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 ClearPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}