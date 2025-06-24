import { useNotificationStore } from '../stores/useNotificationStore'
import { NotificationItem } from './NotificationItem'

export const NotificationList = () => {
  const notifications = useNotificationStore((s) => s.notifications)

  if (notifications.length === 0) {
    return <p>알림이 없습니다.</p>
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '1rem' }}>
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  )
}