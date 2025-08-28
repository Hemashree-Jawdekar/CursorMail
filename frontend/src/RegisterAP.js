import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterAP() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

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
        navigate('/home'); // Redirect to home after successful setup
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="register-form">
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
          <h2>Step 1: Enter Email</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2>Step 2: Enter App Password</h2>
          <input
            type="password"
            name="password"
            placeholder="App Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={prevStep}>Back</button>
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
}
