import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { useAuth } from '../constext/AuthContext';
import { useNavigate } from 'react-router-dom';



function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleAboutClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/#about');  
    } else {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    }}

    const handleContactClick = () => {
  if (window.location.pathname !== '/') {
    navigate('/#contact');
  } else {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
};

  if (isLoggedIn) {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/"><img src={logo} alt="logo" /></Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <button className="navLinkBtn" onClick={handleAboutClick}>About</button>
          <button className="navLinkBtn" onClick={handleContactClick}>Contact</button>
          <Link to="/cart">Cart</Link>
          <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/"><img src={logo} alt="logo" /></Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <button className="navLinkBtn" onClick={handleAboutClick}>About</button>
        <button className="navLinkBtn" onClick={handleContactClick}>Contact</button>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;