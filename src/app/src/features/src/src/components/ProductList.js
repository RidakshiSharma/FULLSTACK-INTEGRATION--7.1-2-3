import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cartSlice'

const products = [
  { id: 1, name: 'Laptop', price: 75000 },
  { id: 2, name: 'Headphones', price: 2500 },
  { id: 3, name: 'Keyboard', price: 1800 },
  { id: 4, name: 'Mouse', price: 1200 }
]

function ProductList() {
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map(p => (
          <div key={p.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            width: '180px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9'
          }}>
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button onClick={() => dispatch(addToCart(p))}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
