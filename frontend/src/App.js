import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
 // choose the icon you want
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import RegisterAP from './RegisterAP';
import Home from './Home';
import EditProfile from './EditProfile';
import LandingPage from './LandingPage';
import './App.css';


function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();
  
  // Only show navbar when user is authenticated
  if (!isAuth) {
    return null;
  }
  
}

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
        <Routes>
          {/* Landing Page - First page users see */}
          <Route
            path="/"
            element={<LandingPage/>}
          />
          
          {/* Authentication Routes */}
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/home" /> : <Login setIsAuth={setIsAuth} />}
          />

          
          
          <Route 
            path="/register" 
            element={isAuth ? <Navigate to="/home" /> : <Register />} 
          />

          {/* Protected Routes - Only accessible when authenticated */}
          <Route
            path="/home"
            element={isAuth ? <Home setIsAuth={setIsAuth} /> : <Navigate to="/login" />}
          />

          <Route
            path="/register-ap"
            element={isAuth ? <RegisterAP /> : <Navigate to="/login" />}
          />
          
          <Route 
            path="/dashboard" 
            element={isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/login" />} 
          />
          
          <Route
            path="/edit-profile"
            element={isAuth ? <EditProfile setIsAuth={setIsAuth} /> : <Navigate to="/login" />}
          />
          {/* <Route path="/register-ap" element={<RegisterAP />} /> */}
        </Routes>


      </BrowserRouter>
    </div>
  );
}

export default App;
