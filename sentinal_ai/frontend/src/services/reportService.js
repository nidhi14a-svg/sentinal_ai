import { fetchFromApi } from './api'

export async function fetchReport(taskId) {
  return fetchFromApi(`/report/${taskId}/generate`)
}
