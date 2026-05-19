import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault();
    setLoading(true); setError(null)
    try{
      const res = await axios.post('http://localhost:4000/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      navigate('/products')
    } catch(err){
      if (err.response && err.response.status === 401) setError('Invalid username or password')
      else setError('Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Sign in</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
        <label className="block">Username
          <input value={username} onChange={e=>setUsername(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </label>
        <label className="block mt-3">Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </label>
        <button disabled={loading} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">{loading? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
