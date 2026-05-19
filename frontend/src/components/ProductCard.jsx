import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <Link to={`/products/${p.id}`} className="block">
        <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover rounded" />
        <h3 className="mt-3 font-semibold text-lg">{p.name}</h3>
      </Link>
      <div className="mt-2 flex-1">
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{p.category}</span>
        <p className="mt-2 text-sm text-gray-600">${p.price.toFixed(2)}</p>
        <p className="mt-1 text-xs text-gray-500">Stock: {p.stock}</p>
      </div>
      <button onClick={() => onAdd(p.id)} className="mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add to cart</button>
    </div>
  )
}
