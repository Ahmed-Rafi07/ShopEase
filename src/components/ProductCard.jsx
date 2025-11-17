import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({p}){
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="h-40 mb-3 bg-slate-100 flex items-center justify-center">
        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/200'} alt={p.title} className="max-h-full object-contain"/>
      </div>
      <h3 className="font-semibold">{p.title}</h3>
      <p className="text-sm text-slate-600">₹{p.price}</p>
      <Link to={`/product/${p.slug}`} className="mt-3 inline-block text-sm text-indigo-600">View</Link>
    </div>
  )
}
