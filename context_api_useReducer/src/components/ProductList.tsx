import { useCart } from '../context/CartContext';

/**
 * ProductList 컴포넌트는 상품 목록을 보여주고,
 * 각 상품을 장바구니에 담을 수 있게 해주는 기능을 담당합니다.
 * 전역 상태 관리를 위해 Context API와 useReducer를 함께 사용합니다.
 */

const products = [
  { id: 1, name: '🍕 Pizza' },
  { id: 2, name: '🥤 Soda' },
  { id: 3, name: '🍪 Cookie' },
];

const ProductList = () => {
  const { dispatch } = useCart(); // 전역 dispatch 사용

  /**
   * 상품을 장바구니에 추가하는 함수
   * dispatch를 사용해 전역 상태(cartItems)를 업데이트합니다.
   */
  const handleAdd = (product: { id: number; name: string }) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div>
      <h2>🍽 상품 목록</h2>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span>{product.name}</span>
          <button onClick={() => handleAdd(product)}>담기</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;