import { useState, useEffect } from 'react'
import { fetchFromApi } from '../services/api'

export function useReport(taskId) {
  const [report, setReport] = useState(null)

  useEffect(() => {
    if (!taskId) {
      return
    }

    const loadReport = async () => {
      const data = await fetchFromApi(`/report/${taskId}/generate`)
      setReport(data)
    }

    loadReport()
  }, [taskId])

  return report
}
