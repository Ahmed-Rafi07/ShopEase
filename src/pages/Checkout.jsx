// src/pages/Checkout.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../features/cart/cartSlice'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((state) => state.cart.items || [])
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = () => {
    // simulate order placement
    alert('✅ Order placed successfully!')
    dispatch(clearCart())
    navigate('/products')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-slate-600">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛒</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-slate-50">
      <div className="bg-white shadow rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">
          Checkout
        </h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="text-slate-700">{item.title}</span>
              <span className="text-slate-500">
                ₹{item.price} × {item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
