import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'

export default function ProductDetail(){
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{ fetch() }, [id])
  async function fetch(){
    setLoading(true)
    try{
      const res = await axios.get(`http://localhost:4000/products/${id}`)
      setP(res.data)
    } catch(err){
      setToast('Failed to load product')
    } finally { setLoading(false) }
  }

  async function add(){
    try{
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:4000/cart', { productId: id, quantity: qty }, { headers: { Authorization: `Bearer ${token}` } })
      setToast('Added to cart')
      setTimeout(()=>setToast(''), 1500)
    } catch(err){
      if (err.response && err.response.status===401) { localStorage.removeItem('token'); navigate('/login') }
      else setToast('Failed to add to cart')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!p) return <div className="p-4 text-red-600">Product not found</div>

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow mt-4">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={p.imageUrl} alt={p.name} className="w-full md:w-1/3 h-64 object-cover rounded" />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{p.category}</p>
            <p className="text-xl text-blue-600 mt-4">${p.price.toFixed(2)}</p>
            <p className="mt-4 text-gray-700">{p.description}</p>
            <p className="mt-2 text-sm text-gray-500">Stock: {p.stock}</p>
            <div className="mt-4 flex items-center gap-2">
              <select value={qty} onChange={e=>setQty(Number(e.target.value))} className="border rounded px-2 py-1">
                {Array.from({length:10},(_,i)=>i+1).map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
              <button onClick={add} className="bg-blue-600 text-white px-4 py-2 rounded">Add to cart</button>
            </div>
            <Link to="/products" className="inline-block mt-4 text-sm text-gray-600">Back to products</Link>
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  )
}
