import { useState, useEffect } from 'react'
import { fetchFromApi } from '../services/api'

export function useScanStatus(taskId) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!taskId) {
      return
    }

    const interval = setInterval(async () => {
      const data = await fetchFromApi(`/scan/${taskId}/status`)
      setStatus(data)
    }, 3000)

    return () => clearInterval(interval)
  }, [taskId])

  return status
}
