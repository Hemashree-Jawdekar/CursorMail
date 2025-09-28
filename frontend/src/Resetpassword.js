import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Resetpassword.css";

// Background images
import IC_1 from "./images/IC_1.png";
import IC_2 from "./images/IC_2.png";
import IC_3 from "./images/IC_3.png";
import IC_4 from "./images/IC_4.png";
import IC_5 from "./images/IC_5.png";
import IC_6 from "./images/IC_6.png";

import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Resetpassword({ setIsAuth }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return setMsg("Both fields are required.");
    }
    if (password !== confirmPassword) {
      return setMsg("Passwords do not match.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        password,
      });
      setMsg(res.data.message);
      // Remove token so user is not considered authenticated
      localStorage.removeItem('token');
      if (setIsAuth) setIsAuth(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="reset-container">
      {/* Background Icons */}
      <img src={IC_1} alt="IC_1" className="bg-icon ic1" />
      <img src={IC_2} alt="IC_2" className="bg-icon ic2" />
      <img src={IC_3} alt="IC_3" className="bg-icon ic3" />
      <img src={IC_4} alt="IC_4" className="bg-icon ic4" />
      <img src={IC_5} alt="IC_5" className="bg-icon ic5" />
      <img src={IC_6} alt="IC_6" className="bg-icon ic6" />

      {/* Reset Box */}
      <div className="reset-box">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset}>
          {/* Password Input */}
          <div className="input-group">
            <LockClosedIcon className="login-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="eye-icon" />
              ) : (
                <EyeIcon className="eye-icon" />
              )}
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <LockClosedIcon className="login-input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="eye-icon" />
              ) : (
                <EyeIcon className="eye-icon" />
              )}
            </span>
          </div>

          <button type="submit">Reset Password</button>
        </form>
        {msg && <p className="reset-message">{msg}</p>}
      </div>
    </div>
  );
}
