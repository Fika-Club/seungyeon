import './App.css';
import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  const [view, setView] = useState<'products' | 'cart'>('products');

  return (
    <CartProvider>
      <div style={{ padding: '1rem' }}>
        <h1>🧺 장바구니 예제</h1>
        <nav style={{ marginBottom: '1rem' }}>
          <button onClick={() => setView('products')} style={{ marginRight: '0.5rem' }}>
            상품 보기
          </button>
          <button onClick={() => setView('cart')}>장바구니 보기</button>
        </nav>
        {view === 'products' ? <ProductList /> : <Cart />}
      </div>
    </CartProvider>
  );
}

export default App;