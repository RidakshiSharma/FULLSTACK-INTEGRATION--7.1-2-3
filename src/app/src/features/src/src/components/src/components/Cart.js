import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../features/cartSlice'

function Cart() {
  const cartItems = useSelector(state => state.cart.items)
  const dispatch = useDispatch()

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cartItems.map(item => (
          <li key={item.id} style={{
            borderBottom: '1px solid #ddd',
            padding: '10px 0'
          }}>
            <strong>{item.name}</strong> - ₹{item.price} × 
            <input
              type='number'
              value={item.quantity}
              min='1'
              onChange={e => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
              style={{ width: '60px', margin: '0 10px' }}
            />
            <button onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total: ₹{total}</h3>
    </div>
  )
}

export default Cart
