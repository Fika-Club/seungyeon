import { useNotificationStore } from '../stores/useNotificationStore'

export const NotificationFilter = () => {
  const notifications = useNotificationStore((s) => s.notifications)
  const unread = notifications.filter((n) => !n.read).length
  const clearAll = useNotificationStore((s) => s.clearNotifications)

  return (
    <div style={{ marginTop: '1rem' }}>
      <p>📨 전체 알림: {notifications.length}</p>
      <p>📬 안읽은 알림: {unread}</p>
      <button onClick={clearAll} style={{ marginTop: '0.5rem' }}>
        전체 삭제
      </button>
    </div>
  )
}