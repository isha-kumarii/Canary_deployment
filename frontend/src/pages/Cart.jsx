import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart(){
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{ fetchCart() }, [])

  async function fetchCart(){
    setLoading(true)
    try{
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:4000/cart', { headers: { Authorization: `Bearer ${token}` } })
      setCart(res.data.cart)
      setTotal(res.data.total)
    } catch(err){
      if (err.response && err.response.status===401) { localStorage.removeItem('token'); navigate('/login') }
    } finally { setLoading(false) }
  }

  async function removeItem(productId){
    try{
      const token = localStorage.getItem('token')
      const res = await axios.delete(`http://localhost:4000/cart/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
      setCart(res.data.cart)
      // recalc total by refetch
      fetchCart()
    } catch(err){
    }
  }

  return (
    <div>
      <Navbar cartCount={cart.reduce((s,i)=>s+i.quantity,0)} />
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        {loading ? <div>Loading...</div> : (
          cart.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center">Your cart is empty. <Link to="/products" className="text-blue-600">Continue shopping</Link></div>
          ) : (
            <div className="bg-white rounded shadow p-4">
              <ul>
                {cart.map(item => (
                  <li key={item.productId} className="flex items-center justify-between border-b py-3">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.quantity} × ${item.unitPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div>${item.lineTotal.toFixed(2)}</div>
                      <button onClick={()=>removeItem(item.productId)} className="text-sm text-red-600">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right font-semibold">Total: ${total.toFixed(2)}</div>
              <div className="mt-4 text-right"><Link to="/products" className="text-blue-600">Continue shopping</Link></div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
