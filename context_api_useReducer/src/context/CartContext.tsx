import { createContext, useReducer, useContext, type ReactNode } from 'react'

export interface Product {
  id: number
  name: string
}

interface CartState {
  cartItems: Product[]
}

/**
 * 장바구니 상태를 변경할 수 있는 액션 타입 정의
 * ADD_ITEM: 새로운 상품을 장바구니에 추가
 * REMOVE_ITEM: 장바구니에서 상품을 제거
 */
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }

/**
 * Context에서 제공할 값들의 타입 정의
 * @property {CartState} state - 현재 장바구니 상태
 * @property {React.Dispatch<CartAction>} dispatch - 상태를 변경하는 함수
 */
interface CartContextType {
  state: CartState
  dispatch: React.Dispatch<CartAction>
}

/**
 * 장바구니의 초기 상태
 * 빈 배열로 시작하여 상품이 추가될 때마다 업데이트됨
 */
const initialState: CartState = {
  cartItems: [],
}

/**
 * 장바구니 상태를 관리하는 리듀서 함수
 * @param {CartState} state - 현재 상태
 * @param {CartAction} action - 수행할 액션
 * @returns {CartState} 새로운 상태
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      // 이미 존재하는 상품인 경우 상태 변경하지 않음
      if (state.cartItems.find(item => item.id === action.payload.id)) {
        return state
      }
      // 새로운 상품을 장바구니에 추가
      return { cartItems: [...state.cartItems, action.payload] }
    case 'REMOVE_ITEM':
      // 해당 ID를 가진 상품을 장바구니에서 제거
      return {
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      }
    default:
      throw new Error('Unhandled action type')
  }
}

// Context 생성
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * 장바구니 Context Provider 컴포넌트
 * 자식 컴포넌트들에게 장바구니 상태와 상태 변경 함수를 제공
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.children - 자식 컴포넌트들
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // 💡 useReducer 훅을 사용하여 상태 관리
    // useReducer(리듀서 함수, 초기 상태)
      // 리듀서 함수는 상태와 액션을 받아 새로운 상태를 반환하는 함수
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * 장바구니 Context를 사용하기 위한 커스텀 훅
 * @returns {CartContextType} 장바구니 상태와 상태 변경 함수
 * @throws {Error} CartProvider 외부에서 사용 시 에러 발생
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}