import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterAP.css';
import logo from './images/mail.png';

export default function RegisterAP() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    // Fetch previous email and app password from backend
    const fetchEmail = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/home', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSenderEmail(data.user?.email || "");
        setFormData(f => ({ ...f, email: data.user?.email || "" }));
        // Check if app password exists
        if (data.user?.app_password) {
          navigate('/home');
        }
      }
    };
    fetchEmail();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const goToLogin = () => navigate('/login');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/register-ap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_email: formData.email,
          app_password: formData.password,
        }),
      });
      if (res.ok) {
        // Optionally check response data for success
        // const data = await res.json();
        // if (data.success) {
        //   navigate('/home');
        // }
        navigate('/home');
      } else {
        // Handle error (show message, etc.)
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="register-ap-container">
      {step === 1 && (
        <>
          <div className="register-ap-left">
            <img src={logo} alt="CursorMail Logo" className="register-ap-logo" />
            <h2>CursorMail</h2>
          </div>
          <form className="register-ap-form" onSubmit={handleSubmit}>
            <label>
              Sender Email:
              <input
                type="email"
                name="email"
                value={senderEmail}
                readOnly
              />
            </label>
            <label>
              App Password:
              <input
                type="password"
                name="password"
                placeholder="App Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <div className="register-ap-actions">
              <button type="button" onClick={goToLogin}>Back</button>
              <button type="submit">Register</button>
            </div>
          </form>
        </>
      )}
      {step === 2 && (
        <div></div>
      )}
    </div>
  );
}
