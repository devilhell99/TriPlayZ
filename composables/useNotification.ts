interface INotification {
  title?: string
  message?: string
}

export const useNotificationSuccess = (params?: INotification) => {
  ElNotification({
    title: params?.title || '保存しました',
    message: params?.message || '保存しました',
    type: 'success',
  })
}

export const useNotificationError = (params?: INotification) => {
  ElNotification({
    title: params?.title || 'エラー',
    message: params?.message || '失敗しました',
    type: 'error',
  })
}
