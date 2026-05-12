import axios from 'axios'

// SERVER_API_URL would be used for server-side fetches in production
// to avoid the public URL round-trip. For this assessment, both share NEXT_PUBLIC_API_URL.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? error.message ?? 'Request failed'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  }
)
