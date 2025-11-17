import { useState, useCallback, useEffect, useMemo } from 'react'
import { api } from '../api/client'
import type { JsonValue } from '../api/client'

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  auth?: boolean
  immediate?: boolean
  query?: Record<string, string | number | boolean | null | undefined>
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (params?: JsonValue) => Promise<T | null>
  reset: () => void
}

export function useApi<T>(
  path: string,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const {
    method = 'GET',
    auth = true,
    immediate = method === 'GET',
    query,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(immediate)
  const [error, setError] = useState<string | null>(null)

  // Memoize query object to prevent unnecessary re-renders
  // Use JSON.stringify for deep comparison since objects are compared by reference
  const queryString = query ? JSON.stringify(query) : null
  const memoizedQuery = useMemo(() => query, [queryString])

  const execute = useCallback(
    async (params?: JsonValue): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        let result: T

        const apiOptions = { auth, query: memoizedQuery }

        switch (method) {
          case 'GET':
            result = await api.get<T>(path, apiOptions)
            break
          case 'POST':
            result = await api.post<T>(path, params, apiOptions)
            break
          case 'PUT':
            result = await api.put<T>(path, params, apiOptions)
            break
          case 'PATCH':
            result = await api.patch<T>(path, params, apiOptions)
            break
          case 'DELETE':
            result = await api.delete<T>(path, apiOptions)
            break
          default:
            throw new Error(`Unsupported HTTP method: ${method}`)
        }

        setData(result)
        setLoading(false)
        return result
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        setLoading(false)
        setData(null)
        return null
      }
    },
    [path, method, auth, memoizedQuery],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  // Auto-execute on mount and when query changes for GET requests if immediate is true
  useEffect(() => {
    if (immediate && method === 'GET') {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, method, memoizedQuery])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}

