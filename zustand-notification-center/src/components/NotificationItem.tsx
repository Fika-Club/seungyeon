import { Notification, useNotificationStore } from '../stores/useNotificationStore'

interface Props {
  notification: Notification
}

export const NotificationItem = ({ notification }: Props) => {
  const markAsRead = useNotificationStore((s) => s.markAsRead)

  return (
    <div
      onClick={() => markAsRead(notification.id)}
      style={{
        cursor: 'pointer',
        padding: '8px',
        backgroundColor: notification.read ? '#eee' : '#ffe9c7',
        borderBottom: '1px solid #ccc',
      }}
    >
      <p>{notification.message}</p>
      <small>{notification.read ? '읽음' : '안읽음'}</small>
    </div>
  )
}