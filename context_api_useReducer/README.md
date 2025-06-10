<aside>
<img src="/icons/notification_gray.svg" alt="/icons/notification_gray.svg" width="40px" />

Context API와 useReducer는 전역 상태 관리와 관련된 중요한 개념이다.

</aside>

## Context API란?

> 리액트 컴포넌트 트리에서 전역 상태를 공유할 수 있게 해주는 기능
> 
- 주로 props drilling (여러 단계를 걸쳐 props를 전달해야 하는 상황)을 피하기 위해 사용

## useReducer란?

> useReducer는 상태를 업데이트할 때 dispatch-action-reducer 구조를 사용하는 hook
> 
- 복잡한 상태로직을 다룰 때 유용하고, Redux 스타일과 비슷한 방식으로 상태를 다룰 수 있음

```tsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

<aside>
<img src="/icons/hammer_gray.svg" alt="/icons/hammer_gray.svg" width="40px" />

dispatch는 reducer를 호출하는 함수일 뿐이며, dispatch 함수 자체의 형태는 reducer의 action인자를 기준으로 자동 유추된다.

즉 위에 action이 실제로 정의된 actionType대로 인자가 들어가는것이다!

</aside>

## **Context + useReducer 함께 쓰는 이유**

- 여러 컴포넌트에서 **공통 상태**를 다루고 싶을 때
- 복잡한 상태 업데이트 로직이 필요할 때

```tsx
// 1. context 만들기
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

// 2. 하위에서 사용
const { state, dispatch } = useContext(CounterContext);
```

## 실제 사용사례

- 로그인 상태 관리: 로그인 여부, 사용자 정보 등을 앱전체에서 공유
- 테마 (다크모드 등): 전체 앱에서 공통된 UI 스타일을 적용해야할 때
- **장바구니 기능: 여러 페이지에서 장바구니 상태를 공유하고 조작할 때**
- 다단계 상태 변경: 복잡한 상태 업데이트 로직을 컴포넌트 밖으로 빼고 싶을 때

## 장바구니 기능 구현해보기

<aside>
<img src="/icons/notification_gray.svg" alt="/icons/notification_gray.svg" width="40px" />

1. **App.tsx**에서 `<CartProvider>`로 모든 하위 컴포넌트를 감쌈
2. **ProductList.tsx**와 **Cart.tsx**는 `useCart()` 훅을 통해 전역 상태에 접근
3. `ProductList`는 상품을 `dispatch({ type: 'ADD_ITEM', payload: 상품 })`으로 장바구니에 추가
4. `Cart`는 장바구니에 담긴 항목을 보여주고, `dispatch({ type: 'REMOVE_ITEM', payload: id })`로 삭제
5. 실제 상태 변경은 `cartReducer` 함수에서 처리
</aside>

```
[App.tsx]
   |
   ▼
<CartProvider>  ← 전역 상태 공급
   |
   ├── ProductList.tsx → dispatch({ type: 'ADD_ITEM' })
   |
   └── Cart.tsx        → dispatch({ type: 'REMOVE_ITEM' })
                         ▲
                         ▼
               [cartReducer] ← 상태 변경 로직
                         ▲
                         ▼
                { state.cartItems } ← Context를 통해 접근
```