const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[]

interface RequestOptions extends RequestInit {
  auth?: boolean
  query?: Record<string, string | number | boolean | null | undefined>
}

function getAuthToken() {
  return localStorage.getItem('auth_token')
}

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: JsonValue,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  if (options.auth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  // Build query string from query params
  let url = `${API_BASE_URL}${path}`
  if (options.query) {
    const queryParams = new URLSearchParams()
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, String(value))
      }
    })
    const queryString = queryParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // Only include body for methods that support it
  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers,
  }

  // GET and DELETE requests should not have a body
  if (method !== 'GET' && method !== 'DELETE' && body !== undefined) {
    fetchOptions.body = JSON.stringify(body)
  }

  const res = await fetch(url, fetchOptions)

  const data = await res.json()

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText
    throw new Error(message)
  }

  return data as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, 'GET', undefined, options),
  post: <T>(path: string, body?: JsonValue, options?: RequestOptions) =>
    request<T>(path, 'POST', body, options),
  put: <T>(path: string, body?: JsonValue, options?: RequestOptions) =>
    request<T>(path, 'PUT', body, options),
  patch: <T>(path: string, body?: JsonValue, options?: RequestOptions) =>
    request<T>(path, 'PATCH', body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, 'DELETE', undefined, options),
}


