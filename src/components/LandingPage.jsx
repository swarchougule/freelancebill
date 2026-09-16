import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  LogIn,
  LogOut,
  User,
  Check,
  Bookmark
} from 'lucide-react';
import FaqAccordion from './FaqAccordion';

export default function LandingPage({ onStartApp, user, onLogin, onLogout, onSaveInvoice }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mini Hero Generator State (Interactive Demo)
  const [demoState, setDemoState] = useState({
    senderName: 'Apex Design Studio',
    clientName: 'Acme Corp',
    description: 'Landing Page UI & UX Design',
    billingType: 'hourly',
    hours: '15',
    rate: '2000',
    fixedAmount: '30000',
    currencySymbol: '₹'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateDemoAmount = () => {
    if (demoState.billingType === 'hourly') {
      return (parseFloat(demoState.hours) || 0) * (parseFloat(demoState.rate) || 0);
    } else if (demoState.billingType === 'fixed') {
      return parseFloat(demoState.fixedAmount) || 0;
    }
    return (parseFloat(demoState.hours) || 0) * (parseFloat(demoState.rate) || 0);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="landing-root">
      {/* SECTION 1 — NAVBAR */}
      <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-container">
          {/* Logo Left */}
          <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-icon-box">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <span className="brand-name">
              <span className="text-freelance">Freelance</span>
              <span className="text-bill">Bill</span>
            </span>
          </div>

          {/* Nav Links Center */}
          <div className="landing-nav-links">
            <button type="button" onClick={() => scrollToSection('features')}>Features</button>
            <button type="button" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button type="button" onClick={() => scrollToSection('benefits')}>Why Us</button>
            <button type="button" onClick={() => scrollToSection('pricing')}>Pricing</button>
            <button type="button" onClick={() => scrollToSection('faq')}>FAQ</button>
          </div>

          {/* Actions Right */}
          <div className="landing-nav-actions">
            {user ? (
              <div className="user-profile-menu" ref={dropdownRef}>
                <button 
                  type="button" 
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  title={userName}
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="user-avatar-img" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="user-name-label">{userName}</span>
                </button>

                {dropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{userName}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      type="button" 
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        onStartApp();
                      }}
                    >
                      <FileText size={15} />
                      <span>Open Invoice Creator</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button 
                      type="button" 
                      className="dropdown-item text-danger"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button type="button" className="btn btn-secondary" onClick={onLogin}>
                  Login
                </button>
                <button type="button" className="btn btn-primary" onClick={onStartApp}>
                  <span>Get Started Free</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* SECTION 2 — HERO WITH INTERACTIVE BROWSER DEMO */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="text-primary" />
            <span>100% Free • No Credit Card Required</span>
          </div>

          <h1 className="hero-headline">
            Send Professional Invoices <br />
            <span className="hero-headline-gradient">in Under 60 Seconds</span>
          </h1>

          <p className="hero-subheadline">
            The fastest way for freelancers to create, send, and get paid — no signup required to try it.
          </p>

          <div className="hero-cta-group">
            <button type="button" className="btn btn-primary btn-hero-cta" onClick={onStartApp}>
              <span>Try It Free</span>
              <ArrowRight size={18} />
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-hero-cta"
              onClick={() => scrollToSection('how-it-works')}
            >
              See How It Works
            </button>
          </div>

          {/* Embedded Interactive Browser Window Mockup Demo */}
          <div className="browser-mockup-wrapper">
            <div className="browser-chrome-bar">
              <div className="browser-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="browser-url-bar">
                <span className="url-lock">🔒</span>
                <span className="url-text">freelancebill.app/live-demo</span>
              </div>
              <div className="browser-actions">
                <span className="live-pill">● LIVE INTERACTIVE DEMO</span>
              </div>
            </div>

            {/* Mini 2-Panel Generator inside Browser Frame */}
            <div className="hero-demo-grid">
              {/* Mini Form Left */}
              <div className="demo-form-panel">
                <div className="demo-panel-header">
                  <span>Interactive Editor (Type below)</span>
                </div>
                
                <div className="demo-form-group">
                  <label className="demo-label">Your Business Name</label>
                  <input 
                    type="text" 
                    value={demoState.senderName}
                    onChange={(e) => setDemoState({ ...demoState, senderName: e.target.value })}
                    className="form-input-sm"
                  />
                </div>

                <div className="demo-form-group">
                  <label className="demo-label">Client Name</label>
                  <input 
                    type="text" 
                    value={demoState.clientName}
                    onChange={(e) => setDemoState({ ...demoState, clientName: e.target.value })}
                    className="form-input-sm"
                  />
                </div>

                <div className="demo-form-group">
                  <label className="demo-label">Service Description</label>
                  <input 
                    type="text" 
                    value={demoState.description}
                    onChange={(e) => setDemoState({ ...demoState, description: e.target.value })}
                    className="form-input-sm"
                  />
                </div>

                <div className="demo-form-row">
                  <div className="demo-form-group" style={{ flex: 1 }}>
                    <label className="demo-label">Billing Type</label>
                    <div className="segmented-control" style={{ width: '100%' }}>
                      <button 
                        type="button" 
                        className={`segmented-btn ${demoState.billingType === 'hourly' ? 'active' : ''}`}
                        onClick={() => setDemoState({ ...demoState, billingType: 'hourly' })}
                      >
                        Hourly
                      </button>
                      <button 
                        type="button" 
                        className={`segmented-btn ${demoState.billingType === 'fixed' ? 'active' : ''}`}
                        onClick={() => setDemoState({ ...demoState, billingType: 'fixed' })}
                      >
                        Fixed
                      </button>
                    </div>
                  </div>

                  {demoState.billingType === 'hourly' ? (
                    <>
                      <div className="demo-form-group" style={{ width: '65px' }}>
                        <label className="demo-label">Hours</label>
                        <input 
                          type="number" 
                          value={demoState.hours}
                          onChange={(e) => setDemoState({ ...demoState, hours: e.target.value })}
                          className="form-input-sm"
                        />
                      </div>
                      <div className="demo-form-group" style={{ width: '75px' }}>
                        <label className="demo-label">Rate (₹)</label>
                        <input 
                          type="number" 
                          value={demoState.rate}
                          onChange={(e) => setDemoState({ ...demoState, rate: e.target.value })}
                          className="form-input-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="demo-form-group" style={{ width: '110px' }}>
                      <label className="demo-label">Amount (₹)</label>
                      <input 
                        type="number" 
                        value={demoState.fixedAmount}
                        onChange={(e) => setDemoState({ ...demoState, fixedAmount: e.target.value })}
                        className="form-input-sm"
                      />
                    </div>
                  )}
                </div>

                <button type="button" className="btn btn-primary demo-launch-btn" onClick={onStartApp}>
                  <span>Open Full Invoice Generator</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Mini Live Preview Right */}
              <div className="demo-preview-panel">
                <div className="demo-panel-header">
                  <span>Live Preview Card</span>
                  <span className="badge-draft">● Draft</span>
                </div>

                <div className="mini-card-body">
                  <div className="mini-card-header">
                    <div>
                      <div className="mini-sender">{demoState.senderName || 'Your Name'}</div>
                      <div className="mini-subtext">Freelance Invoice</div>
                    </div>
                    <div className="mini-inv-title">
                      INVOICE <br />
                      <span className="mini-inv-no">INV-001</span>
                    </div>
                  </div>

                  <div className="mini-bill-to">
                    <div className="mini-subtext">Billed To</div>
                    <div className="mini-client">{demoState.clientName || 'Client Name'}</div>
                  </div>

                  <table className="mini-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {demoState.description || 'Service Description'}
                          <div className="mini-subtext">
                            {demoState.billingType === 'hourly' 
                              ? `${demoState.hours || 0} hrs @ ₹${demoState.rate || 0}/hr`
                              : 'Fixed Price'}
                          </div>
                        </td>
                        <td className="text-right mini-amount">
                          {demoState.currencySymbol}{calculateDemoAmount().toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mini-total-row">
                    <span>Total Due</span>
                    <span className="mini-total-val">{demoState.currencySymbol}{calculateDemoAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-trust-line">
            <ShieldCheck size={16} className="text-primary" />
            <span>No credit card. No signup. Just try it.</span>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SOCIAL PROOF BAR */}
      <section className="social-proof-section">
        <div className="section-container">
          <p className="social-proof-title">Trusted by freelancers and small agencies worldwide</p>
          <div className="social-proof-logos">
            <div className="logo-badge">UPWORK PROS</div>
            <div className="logo-badge">INDIE HACKERS</div>
            <div className="logo-badge">TOPTAL ENGINEERS</div>
            <div className="logo-badge">FIVERR SELECT</div>
            <div className="logo-badge">DRIBBBLE DESIGNERS</div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURES (3-COLUMN GRID) */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title-lg">Everything You Need to Get Paid Faster</h2>
            <p className="section-subtitle">Designed for simplicity so you can spend less time invoicing and more time creating.</p>
          </div>

          <div className="features-grid-3">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Clock size={24} />
              </div>
              <h3 className="feature-card-title">Live Invoice Preview</h3>
              <p className="feature-card-desc">Watch your invoice update instantly as you type every field. What you see is exactly what your client gets.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Zap size={24} />
              </div>
              <h3 className="feature-card-title">Freelancer-Ready Billing</h3>
              <p className="feature-card-desc">Flexible billing options per row: Hourly rates, Fixed Price projects, or Quantity items. Mix and match easily.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Download size={24} />
              </div>
              <h3 className="feature-card-title">Instant PDF & Print Export</h3>
              <p className="feature-card-desc">One click generates a clean, print-ready PDF document without watermark clutter or form controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS (3-STEP HORIZONTAL LAYOUT) */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title-lg">3 Simple Steps to Your Invoice</h2>
            <p className="section-subtitle">No multi-step setup wizards or complex accounting software.</p>
          </div>

          <div className="steps-horizontal-wrapper">
            <div className="step-item">
              <div className="step-badge">1</div>
              <h3 className="step-title">Fill in your details</h3>
              <p className="step-desc">Enter your business name, logo, address, and client details.</p>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-badge">2</div>
              <h3 className="step-title">Add your line items</h3>
              <p className="step-desc">Choose Hourly, Fixed Price, or Quantity billing for your work.</p>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-badge">3</div>
              <h3 className="step-title">Download & share</h3>
              <p className="step-desc">Export your PDF invoice in 1 click and send it to your client.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — BENEFITS / WHY FREELANCEBILL (2-COLUMN) */}
      <section id="benefits" className="benefits-section">
        <div className="section-container">
          <div className="benefits-grid-2">
            <div className="benefits-left">
              <h2 className="section-title-lg" style={{ textAlign: 'left' }}>
                Built for freelancers, <br />
                <span className="text-primary">not accountants</span>
              </h2>
              <p className="benefits-lead-text">
                Traditional invoicing software forces you through complex tax ledgers, double-entry bookkeeping, and lengthy setup forms. FreelanceBill gives you a clean canvas that gets the job done in seconds.
              </p>
              <button type="button" className="btn btn-primary" onClick={onStartApp}>
                <span>Create Invoice Now</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="benefits-right">
              <div className="benefit-checklist">
                <div className="checklist-item">
                  <div className="check-icon-box">
                    <CheckCircle2 size={20} className="text-green" />
                  </div>
                  <div>
                    <h4 className="check-title">No complicated accounting jargon</h4>
                    <p className="check-desc">Straightforward fields designed around your actual freelance workflow.</p>
                  </div>
                </div>

                <div className="checklist-item">
                  <div className="check-icon-box">
                    <CheckCircle2 size={20} className="text-green" />
                  </div>
                  <div>
                    <h4 className="check-title">Works seamlessly on mobile and desktop</h4>
                    <p className="check-desc">Create or edit invoices anywhere — on your phone, laptop, or tablet.</p>
                  </div>
                </div>

                <div className="checklist-item">
                  <div className="check-icon-box">
                    <CheckCircle2 size={20} className="text-green" />
                  </div>
                  <div>
                    <h4 className="check-title">No signup needed to create your invoice</h4>
                    <p className="check-desc">Start building immediately without verifying email or remembering passwords.</p>
                  </div>
                </div>

                <div className="checklist-item">
                  <div className="check-icon-box">
                    <CheckCircle2 size={20} className="text-green" />
                  </div>
                  <div>
                    <h4 className="check-title">Beautiful templates that make you look professional</h4>
                    <p className="check-desc">Minimal, Stripe-inspired invoice aesthetics that build client trust.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRICING (2-TIER CARDS SIDE BY SIDE) */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title-lg">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Start for free today. Upgrade when you need extra superpowers.</p>
          </div>

          <div className="pricing-grid-2">
            {/* Free Tier */}
            <div className="pricing-card">
              <div className="pricing-tier-name">Free</div>
              <div className="pricing-price">₹0 <span>/ month</span></div>
              <p className="pricing-desc">Perfect for quick, one-off invoices for freelancers starting out.</p>

              <ul className="pricing-feature-list">
                <li><Check size={16} className="text-green" /> Standard Invoice Builder</li>
                <li><Check size={16} className="text-green" /> Live Updating Preview</li>
                <li><Check size={16} className="text-green" /> Instant PDF Export</li>
                <li><Check size={16} className="text-green" /> Hourly, Fixed & Qty Billing</li>
                <li><Check size={16} className="text-green" /> Business Logo Upload</li>
              </ul>

              <button type="button" className="btn btn-secondary pricing-btn" onClick={onStartApp}>
                Start Free Now
              </button>
            </div>

            {/* Pro Tier (Highlighted) */}
            <div className="pricing-card pricing-card-pro">
              <div className="pricing-popular-badge">MOST POPULAR</div>
              <div className="pricing-tier-name">Pro</div>
              <div className="pricing-price">₹499 <span>/ month</span></div>
              <p className="pricing-desc">For active freelancers who want saved clients, templates, and no watermarks.</p>

              <ul className="pricing-feature-list">
                <li><Check size={16} className="text-green" /> <strong>Everything in Free</strong></li>
                <li><Check size={16} className="text-green" /> <strong>Unlimited PDF Downloads</strong></li>
                <li><Check size={16} className="text-green" /> Save Client Address Book</li>
                <li><Check size={16} className="text-green" /> Custom Brand Color Accent</li>
                <li><Check size={16} className="text-green" /> Remove All Watermarks</li>
                <li><Check size={16} className="text-green" /> Priority Support</li>
              </ul>

              <button type="button" className="btn btn-primary pricing-btn" onClick={onStartApp}>
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FAQ (ACCORDION STYLE) */}
      <section id="faq" className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title-lg">Frequently Asked Questions</h2>
            <p className="section-subtitle">Got questions? We've got answers.</p>
          </div>

          <div className="faq-wrapper">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA BAND */}
      <section className="final-cta-section">
        <div className="section-container">
          <div className="final-cta-card">
            <h2 className="final-cta-title">Start sending invoices in minutes</h2>
            <p className="final-cta-subtitle">Join thousands of freelancers who get paid faster with FreelanceBill.</p>
            <button type="button" className="btn btn-primary btn-hero-cta" onClick={onStartApp}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10 — FOOTER */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand-logo">
                <div className="brand-icon-box">
                  <FileText size={20} strokeWidth={2.5} />
                </div>
                <span className="brand-name">
                  <span className="text-freelance">Freelance</span>
                  <span className="text-bill">Bill</span>
                </span>
              </div>
              <p className="footer-tagline">
                The fastest invoice generator for freelancers & independent creators.
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-column">
                <div className="footer-col-title">Product</div>
                <button type="button" onClick={() => scrollToSection('features')}>Features</button>
                <button type="button" onClick={() => scrollToSection('pricing')}>Pricing</button>
                <button type="button" onClick={onStartApp}>Invoice Generator</button>
              </div>

              <div className="footer-column">
                <div className="footer-col-title">Resources</div>
                <button type="button" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
                <button type="button" onClick={() => scrollToSection('faq')}>FAQ</button>
              </div>

              <div className="footer-column">
                <div className="footer-col-title">Legal</div>
                <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                <a href="#contact" onClick={(e) => e.preventDefault()}>Contact Support</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} FreelanceBill. All rights reserved.</p>
            <p className="footer-credit">Designed with clarity & confidence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
