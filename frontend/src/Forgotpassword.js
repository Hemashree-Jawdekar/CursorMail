import React, { useState } from "react";
import axios from "axios";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import "./Forgotpassword.css";
import Phone from './images/Phone.png';
import s_questionmark from './images/s_questionmark.png';
import forgotpass from './images/forgotpass.png';
import b_questionmrk from './images/b_questionmark.png';

export default function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMsg(res.data.message || "Password reset link has been sent to your email.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      {/* Background stripes */}
      <div className="stripe stripe-1"></div>
      <div className="stripe stripe-2"></div>

      <div className="forgot-container">
        {/* Left Illustration */}
        <div className="forgot-left">
        <div className="box0">
          <img src={Phone} alt="Phone " classname="Phone" />
        </div>
        <div className="box1">
          <img src={s_questionmark} alt="s_questionmark" className="s_questionmark" />
        </div>
        <div className="box2">
          <img src={forgotpass} alt="forgotpass" className="forgotpass" />
        </div>
        <div className="box3">
          <img src={b_questionmrk} alt="b_questionmrk" className="b_questionmrk" />
        </div>
        </div>

        {/* Right Form */}
        <div className="forgot-right">
          <h1 className="forgot-title">Reset Your Password</h1>
          <p className="forgot-subtitle">
            Enter your registered email address and we’ll send you a verification link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="forgot-input-with-icon">
              <EnvelopeIcon className="forgot-input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {msg && <div className="forgot-message">{msg}</div>}

          <a href="/login" className="back-to-login">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
