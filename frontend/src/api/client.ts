const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[]

interface RequestOptions extends RequestInit {
  auth?: boolean
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

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    body: JSON.stringify(body || {}),
  })

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


