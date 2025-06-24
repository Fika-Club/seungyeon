# Zustand 개요

> Zustand는 React 애플리케이션을 위한 간단하고 가벼운 상태 관리 라이브러리
> 

## 주요 특징

### Zustand의 핵심 철학

- **간단한 설정(minimal):** 복잡한 보일러플레이트 코드가 필요 없음 (redux보다 훨씬 간단)
- **Hook 기반**: useStore() 훅으로 상태를 직접 가져오고 수정함
- **불변성 관리 자유**: Immer 내장되어 있지만 강제 아님 (자유도 good)
    - Immer이용하여 원래 객체 유지하며 객체 업데이트 가능 (불변성 처리를 위해)
    - 직접 처리해도됨
- **Selective Subscription**: 필요한 상태만 구독해서 리렌더 최소화
- **Vanilla JS 지원**: React외에도 사용 가능. 로직 분리 용이

### 그외 특징

- **작은 번들 크기:** 약 1KB로 매우 가벼움
- **TypeScript 지원:** 타입 안정성 제공
- **미들웨어 지원:** Redux DevTools 등과 통합 가능

### 주요 개념 정리

| **개념** | **설명** |
| --- | --- |
| `create()` | store를 만드는 핵심 함수 |
| `selector` | useStore(state => state.값)처럼 필요한 부분만 가져오기 |
| `action` | 상태를 바꾸는 함수 (set 이용) |
| `middleware` | persist, devtools, immer 등 기능 추가 가능 |
| `상태 공유` | 글로벌 상태처럼 모든 컴포넌트에서 접근 가능 |

## 기본 사용법

```tsx
import { create } from 'zustand'

interface CounterStore {
  count: number // state
  increment: () => void // action
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

```tsx
const count = useCounterStore(state => state.count) // state
const increment = useCounterStore(state => state.increment) // action
```

### 상태 변화에 따른 리렌더링 전략 (shallow)

<aside>
<img src="/icons/hammer_gray.svg" alt="/icons/hammer_gray.svg" width="40px" />

Zustand는 내부적으로 shallow comparison이나 Object.js 비교로 리렌더 최소화 함.

- **React는 원래 상태가 바뀌면 리렌더링 됨**
    
    → Zustand는 ~~상태 전체를 구독~~하는 게 아니라, **내가 선택한 부분만 구독**하게 해준다.
    
    - 그런데, 이렇게 깊은 값 구독하면 React가 “이거 진짜 바뀐 건지 아닌지” 판단하기 어려워진다. 기본 비교는 [Object.is](http://object.is/)()인데, 객체가 새로 생겼으면 항상 다르다고 판단해버린다.
    
    ```tsx
    const shallow = import("zustand/shallow")
    
    const [name, email] = useStore(
    	state => [state.user.name, state.user.email],
    	shallow
    )
    ```
    
    → 리렌더링 전략을 통해 필요한 값만 구독하고, 깊은 구조면 shallow비교로 최적화 가능하다
    
</aside>

## Zustand vs. Pinia

| **항목** | **Zustand (React)** | **Pinia (Vue)** |
| --- | --- | --- |
| **기반 철학** | 최소한의 상태관리. Hook 기반, 선택적 구독 | Vue Composition API 기반. 상태+액션 분리 |
| **스토어 정의 방식** | create() 함수로 직접 정의 | defineStore()로 상태/액션 명시적 정의 |
| **리액티브 처리** | React에서 상태 hook으로 구독 | Vue의 reactivity 시스템 이용 (ref, reactive) |
| **리렌더 최적화** | **구독한 값만 리렌더 (selector, shallow)** | 모든 값이 reactive하게 반응 (부분 구독 어려움) |
| **불변성 관리** | 직접 관리 or **immer 미들웨어** | **Vue가 자동으로 proxy 처리 (mutable)** |
| **모듈화/구조화** | 자유도가 높음 (함수형) | 명시적 구조 필요 (state, getters, actions 분리) |
| **Devtools 연동** | middleware로 devtools 지원 | Vue Devtools 완벽 통합 |
| **공식 지원** | React 전용 | Vue 전용 |

---

### 1. 리렌더 최적화

<aside>
<img src="/icons/emoji-smiling-eyes_pink.svg" alt="/icons/emoji-smiling-eyes_pink.svg" width="40px" />

Zustand는 “구독범위”를 정교하게 조절할 수 있다 → 퍼포먼스에 유리!

</aside>

- Pinia
    - Vue의 reactivity덕에 알아서 반응하지만 (장)
    - 부분 구독은 어렵다. (단)
        - store.count, [store.user.name](http://store.user.name) 접근해도 전체 스토어 구독하는 구조.
- Zustand
    - 원하는 값만 구독 가능 (위에서 말한 shallow)

### 2. 컴포넌트와의 연결 방식

- Pinia
    - storeToRefs()로 상태를 추출해서 쓰는 게 일반적
        
        ```tsx
        const { count } = storeToRefs(useCounterStore().$state)
        ```
        
- Zustand
    - 바로 훅으로 접근 (코드량도 줄고, 동적 구조 만들기 편함)
        
        ```tsx
        const count = useCounterStore(state => state.count)
        ```
        

---

## Zustand vs. Redux

| **항목** | **Redux** | **Zustand** |
| --- | --- | --- |
| 철학 | 명확한 아키텍처, 상태 추적 중심 | 최소한의 상태 관리, 빠르고 간단 |
| 상태 업데이트 | dispatch + reducer | 함수형 set() 호출 |
| 코드 복잡도 | 높음 (boilerplate 많음) | 낮음 (함수형 스타일) |
| 비동기 처리 | Thunk, Saga 등 미들웨어 필요 | 그냥 async/await 함수로 쓰면 됨 |
| Devtools | 강력, 복잡한 플로우 추적 가능 | middleware 통해 연결 가능 (가벼움) |
| 타입스크립트 | 정교하게 설정 가능하나 복잡 | 매우 간단하고 자연스럽게 TS 적용 |
| 불변성 | 강제, 직접 spread 등 사용해야 | 선택적 (immer로 처리 가능) |

---

### 1. 언제 뭐를 쓰지..?

| **상황** | **추천** |
| --- | --- |
| 복잡한 상태 흐름 추적, 로깅, 타임 트래블 등 필요 | **Redux** |
| 빠르게 가벼운 앱 만들고 싶고 React Hook에 익숙 | **Zustand** |
| 중간 규모, 성능 최적화, 타입스크립트 중심 개발 | **Zustand + middleware** |
| 이미 Redux 기반 시스템 유지 중 | 굳이 Zustand로 옮기지 않아도 됨 |
- Zustand: 자유롭고 빠른 개발에 유리 → 작은 ~ 중간 앱에 이상적 (불변성은 필요할때만)
- Redux: 체계적이고 거대한 상태 흐름 다룰 때 유리. 대신 러닝커브와 보일러플레이트 감수해야함.

---

## 예시 코드 (todolist)

> useNotificationStore.ts → Zustand를 활용한 알림 상태 관리 스토어.
> 
- 전역 상태 관리 정의
- 알림 추가, 읽음 처리, 전체 삭제와 같은 **알림 관련 액션들 포함**
- 다른 컴포넌트에서 useNotificationStore() 훅으로 이 상태를 읽거나 업데이트 가능