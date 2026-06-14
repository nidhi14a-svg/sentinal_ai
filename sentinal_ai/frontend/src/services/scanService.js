import { fetchFromApi } from './api'

export async function initiateScan(domain, scanProfile) {
  return fetchFromApi('/scan/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, scanProfile })
  })
}
