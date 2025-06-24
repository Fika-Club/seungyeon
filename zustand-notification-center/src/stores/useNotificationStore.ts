import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface Notification {
  id: string
  message: string
  read: boolean
}

// Zustand 스토어가 가져아할 상태(notifications)와 함수(액션) 정의
interface NotificationStore {
  notifications: Notification[] // state
  addNotification: (message: string) => void // action
  markAsRead: (id: string) => void // action
  clearNotification: (id: string) => void // action
  clearNotifications: () => void // action
}

// immer 미들웨어를 사용하여 상태 관리
export const useNotificationStore = create<NotificationStore>()(
    immer((set) => ({
      notifications: [],
      addNotification: (message) =>
        set((state) => {
          state.notifications.push({
            id: crypto.randomUUID(),
            message,
            read: false,
          })
        }),
      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          if (notification) notification.read = true
        }),
      clearNotification: (id) =>
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id)
        }),
      clearNotifications: () =>
        set((state) => {
          state.notifications = []
        }),
    }))
  )

// 불변성 유지를 위해 상태 변경 시 새로운 객체 생성 (직접 관리)
// export const useNotificationStore = create<NotificationStore>((set) => ({
//   notifications: [],
//   addNotification: (message) =>
//     set((state) => ({
//       notifications: [
//         ...state.notifications,
//         {
//           id: crypto.randomUUID(),
//           message,
//           read: false,
//         },
//       ],
//     })),
//   markAsRead: (id) =>
//     set((state) => ({
//       notifications: state.notifications.map((n) =>
//         n.id === id ? { ...n, read: true } : n
//       ),
//     })),
//   clearNotifications: () => set({ notifications: [] }),
// }))