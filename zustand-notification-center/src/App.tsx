import React, { useState } from 'react'
import { NotificationList } from './components/NotificationList'
import { NotificationFilter } from './components/NotificationFilter'
import { useNotificationStore } from './stores/useNotificationStore'

function App() {
  const [input, setInput] = useState('')
  const add = useNotificationStore((s) => s.addNotification)

  const handleAdd = () => {
    if (input.trim()) {
      add(input.trim())
      setInput('')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📢 알림 센터</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="알림 내용 입력"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button onClick={handleAdd}>알림 추가</button>

      <NotificationFilter />
      <NotificationList />
    </div>
  )
}

export default App