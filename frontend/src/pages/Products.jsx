import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'

export default function Products(){
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(()=>{ fetchProducts() }, [])

  // accept optional overrides to avoid relying on stale state when calling immediately after setState
  async function fetchProducts(overrides = {}){
    setLoading(true)
    try{
      const params = {}
      const searchTerm = overrides.search !== undefined ? overrides.search : search
      const categoryTerm = overrides.category !== undefined ? overrides.category : category
      if (searchTerm) params.search = searchTerm
      if (categoryTerm && categoryTerm !== 'All') params.category = categoryTerm
      const res = await axios.get('http://localhost:4000/products', { params })
      setProducts(res.data)
    } catch(err){
      setToast('Failed to load products')
    } finally { setLoading(false) }
  }

  async function addToCart(productId){
    try{
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:4000/cart', { productId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } })
      setToast('Added to cart')
      setCartCount(c => c + 1)
      setTimeout(()=>setToast(''), 1500)
    } catch(err){
      setToast('Failed to add to cart')
    }
  }

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="p-4">
        <div className="flex gap-3 mb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" className="flex-1 border rounded px-3 py-2" />
          <button onClick={fetchProducts} className="bg-blue-600 text-white px-4 rounded">Search</button>
        </div>
        <div className="flex gap-2 mb-4">
          {['All','Electronics','Clothing','Books'].map(c=> (
            <button key={c} onClick={()=>{ setCategory(c); fetchProducts({ category: c }) }} className={`px-3 py-1 rounded ${category===c? 'bg-blue-600 text-white' : 'bg-white'}`}>{c}</button>
          ))}
        </div>
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p=> <ProductCard key={p.id} p={p} onAdd={addToCart} />)}
          </div>
        )}
      </div>
      <Toast message={toast} />
    </div>
  )
}
