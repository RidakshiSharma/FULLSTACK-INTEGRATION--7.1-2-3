import React from 'react'
import ProductList from './components/ProductList'
import Cart from './components/Cart'

function App() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Redux Toolkit Shopping Cart</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '55%' }}>
          <ProductList />
        </div>
        <div style={{ width: '40%' }}>
          <Cart />
        </div>
      </div>
    </div>
  )
}

export default App
