import React from 'react'

export default function AdminDashboard(){
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded">Total revenue</div>
        <div className="bg-white p-4 rounded">Total orders</div>
        <div className="bg-white p-4 rounded">Top products</div>
      </div>
    </main>
  )
}
