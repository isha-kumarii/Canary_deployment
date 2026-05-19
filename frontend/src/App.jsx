import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'

function requireAuth(children) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={requireAuth(<Products />)} />
      <Route path="/products/:id" element={requireAuth(<ProductDetail />)} />
      <Route path="/cart" element={requireAuth(<Cart />)} />
      <Route path="/" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}
