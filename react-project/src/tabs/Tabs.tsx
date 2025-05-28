// Tabs.tsx
import React, { createContext, useContext, useState } from 'react';

/**
 * Context 객체
 * - 탭의 현재 활성값(value)과 그 값을 변경하는 함수(setValue)를 저장
 * - 초기값은 비워놨지만 실제 사용시에는 <Tabs />에서 값을 채워넣음 - defaultValue 속성으로 전달
 */
const TabsContext = createContext<{ value: string; setValue: (value: string) => void }>({
  value: '',
  setValue: () => {},
});

/**
 * 탭 컴포넌트
 * - 탭 목록과 탭 패널을 관리
 * - 탭 목록은 <TabsList />에서 정의
 * - 탭 패널은 <TabsPanel />에서 정의
 * - 탭 패널은 현재 활성값(value)과 일치할 때만 표시
 */
export function Tabs({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

/**
 * 탭 목록 컴포넌트
 * - 탭 목록은 탭 트리거들을 포함하는 컨테이너
 * - 탭 목록은 탭 트리거들을 수평으로 배치
 */
export function TabsList({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

/**
 * 탭 트리거 컴포넌트
 * - 탭 목록에 포함된 각 탭을 나타냄
 * - 탭 트리거는 클릭 시 현재 활성값을 변경
 */
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: current, setValue } = useContext(TabsContext);
  return (
    <button
      onClick={() => setValue(value)}
      style={{
        marginRight: '8px',
        fontWeight: value === current ? 'bold' : 'normal',
      }}
    >
      {children}
    </button>
  );
}

/**
 * 탭 패널 컴포넌트
 * - 탭 패널은 현재 활성값(value)과 일치할 때만 표시
 */
export function TabsPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: current } = useContext(TabsContext);
  return current === value ? <div style={{ marginTop: '16px' }}>{children}</div> : null;
}