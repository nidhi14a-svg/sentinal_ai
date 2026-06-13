const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export async function fetchFromApi(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options)
  return response.json()
}
