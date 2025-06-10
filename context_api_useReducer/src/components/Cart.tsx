import { useCart } from '../context/CartContext';

/**
 * Cart 컴포넌트는 장바구니에 담긴 상품 목록을 보여주며,
 * 각 상품을 삭제할 수 있는 기능을 제공합니다.
 * 전역 상태인 cartItems를 Context API를 통해 가져오고,
 * useReducer의 dispatch를 통해 상태를 업데이트합니다.
 */
const Cart = () => {
  const { state, dispatch } = useCart();

  /**
   * 장바구니에서 상품을 제거하는 함수
   * 상품 id를 payload로 넘겨서 REMOVE_ITEM 액션을 보냅니다.
   */
  const handleRemove = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <div>
      <h2>🛒 장바구니</h2>
      {state.cartItems.length === 0 ? (
        <p>장바구니가 비어 있어요</p>
      ) : (
        <>
          {state.cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span>{item.name}</span>
              <button onClick={() => handleRemove(item.id)}>삭제</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Cart;