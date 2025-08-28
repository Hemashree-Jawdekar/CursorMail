import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  InboxIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import './LandingPage.css';
import image1 from './images/hugeicons_mail-open.png';
import image2 from './images/ic_round-laptop.png';
import image3 from './images/Ellipse 9.png';
import image4 from './images/Ellipse 10.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <nav className="navbar">
        <div className="navbar-brand">
          <EnvelopeIcon className="navbar-email-icon" />
        </div>
        <div className="navbar-actions">
          <button 
            onClick={handleGetStarted}
            className="navbar-get-started-btn"
          >
            Get Started
          </button>
        </div>
      </nav>
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">CursorMail</h1>
          <h2 className="hero-title">Send Personalized Emails at Scale – in Seconds</h2>
          <p className="hero-subtitle">Upload your list, customize your message, and track results – all from one powerful dashboard.</p>
          <button 
            onClick={handleGetStarted}
            className="hero-button"
          >
            Try a Live Demo
          </button>
          <div className="hero-images">
            <div className="laptop-container">
            <img src={image1} alt="Mail Open" className="hero-image1" />
            <img src={image2} alt="Laptop" className="hero-image2" />
             <img src={image4} alt="Ellipse 11" className="hero-image5" />
            <img src={image4} alt="Ellipse 12" className="hero-image6" />
            <img src={image4} alt="Ellipse 13" className="hero-image7" />
            <img src={image4} alt="Ellipse 14" className="hero-image8" />
            <img src={image4} alt="Ellipse 15" className="hero-image9" />
 
            </div>
            <div className="cloud-container">
            <img src={image3} alt="Ellipse 9" className="hero-image3" />
            <img src={image4} alt="Ellipse 10" className="hero-image4" />
           
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose Us?</h2>
          <p className="features-subtitle">Powerful features designed to streamline your email marketing workflow</p>
          <div className="features-grid">
            {[
              { icon: ArrowUpTrayIcon, title: "CSV Upload", desc: "Import your recipient list with one click." },
              { icon: InboxIcon, title: "Dynamic Personalization", desc: "Use placeholders for name, company, and more." },
              { icon: PaperAirplaneIcon, title: "Automated Campaigns", desc: "Schedule and send emails at the right time." },
              { icon: ChartBarIcon, title: "Analytics Dashboard", desc: "Track opens, clicks, and responses in real-time." },
              { icon: CheckCircleIcon, title: "CRM Integrations", desc: "Sync with your favorite tools like Sheets or Slack." },
            ].map((f, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-container">
                  <f.icon className="feature-icon" />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-description">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">How It Works</h2>
          <p className="how-it-works-subtitle">Get started in just three simple steps</p>
          <div className="how-it-works-grid">
            {[
              { title: "1. Upload Contacts", desc: "Upload a CSV file of your recipients easily." },
              { title: "2. Design Template", desc: "Use our editor to create dynamic email content." },
              { title: "3. Send & Track", desc: "Launch your campaign and monitor performance instantly." },
            ].map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">
                  {idx + 1}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases-section">
        <h2 className="use-cases-title">Perfect for Every Scenario</h2>
        <div className="use-cases-grid">
          <ul className="use-cases-list">
            <li>🎓 Event invites for schools & colleges</li>
            <li>🛍️ Marketing offers and seasonal promotions</li>
            <li>🧑‍💼 Internal HR announcements</li>
          </ul>
          <ul className="use-cases-list">
            <li>📣 NGO awareness and outreach</li>
            <li>📰 Customized newsletters for subscribers</li>
            <li>🎁 Personalized reward or discount emails</li>
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">What People Are Saying</h2>
        <blockquote className="text-xl italic text-gray-700 max-w-2xl mx-auto">
          “Saved us hours every week and helped us personalize thousands of emails effortlessly.”
        </blockquote>
        <p className="mt-4 text-gray-500">— Campaign Manager, Local NGO</p>
      </section>

      {/* CTA Again */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Email Outreach?</h2>
          <p className="cta-subtitle">Join thousands of users who have revolutionized their email marketing</p>
          <button 
            onClick={handleRegister}
            className="cta-button"
          > 
            Start Sending Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} CursorMail. All rights reserved.</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>|
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
