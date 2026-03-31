import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import Navbar from './components/NavBar';
import AdminPage from './pages/AdminPage'
import { useEffect, useState } from 'react'
import { AuthProvider } from './constext/AuthContext'
import { useLocation } from 'react-router-dom'
import { ToastProvider } from './constext/ToastContext';


import './App.css'

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  console.log('path:', location.pathname, 'isAdmin:', isAdmin);

  return (
    <div>
      {!isAdmin && <Navbar/>}
    </div>
  )
}

function App() {
  const [User, setUser] = useState(null)
  const [IsloggedIn, setIsloggedIn] = useState(false)

  
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetch('http://localhost:5000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        setUser(data);
        setIsloggedIn(true);
      } else {
        setIsloggedIn(false);
      }
    })
    .catch(() => {
      setIsloggedIn(false);
    })
  }
 
}, [])
 


  return (

      
    <ToastProvider>
    <AuthProvider>
    <BrowserRouter>
      <AppContent />
      <div>
          
          
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
         
        </Routes>

        
       




      </div>
    </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  )
}

export default App