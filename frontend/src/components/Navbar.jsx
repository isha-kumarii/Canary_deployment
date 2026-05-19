import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-xl font-semibold text-blue-600">E-Shop</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4"/></svg>
          {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">{cartCount}</span>}
        </Link>
        <button onClick={logout} className="text-sm text-gray-700 hover:text-gray-900">Logout</button>
      </div>
    </nav>
  )
}
