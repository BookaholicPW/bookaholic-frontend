import { appConfig } from '@/configs/schemas'
import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'

export default function useFetch<T>() {
  const config = appConfig
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)
  const { reloadSettings } = useSettings()

  const request = async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    pathname: string,
    headers?: Record<string, string>,
    requestBody?: Record<string, any> | FormData,
    options?: RequestInit
  ): Promise<T> => {
    let settings = reloadSettings(true)
    options = options || {}
    options.method = method
    options.headers = headers || {}
    if (!options.headers['content-type']) {
      if (requestBody instanceof FormData) {
        // options.headers['content-type'] = 'multipart/form-data'
      } else {
        options.headers['content-type'] = 'application/json'
      }
    }
    if (
      !options.headers['authorization'] &&
      settings &&
      settings.user &&
      settings.user.token
    ) {
      options.headers['authorization'] = `Bearer ${settings.user.token}`
    }

    if (requestBody instanceof FormData) {
      options.body = requestBody
    } else {
      options.body = JSON.stringify(requestBody)
    }
    setLoading(true)
    try {
      let url = new URL(config.apiRoot)
      if (pathname.startsWith('http')) {
        url = new URL(pathname)
      } else {
        url = new URL(pathname, config.apiRoot)
      }
      const res = await fetch(url, options)
      if (
        res.ok &&
        res.headers.get('content-type')?.startsWith('application/json')
      ) {
        const json = await res.json()
        setData(json)
        return json
      } else if (res.ok) {
        setData(res.text() as T)
        return res.text() as T
      } else if (
        res.headers.get('content-type')?.startsWith('application/json')
      ) {
        const json = await res.json()
        return json as T
      } else if (res.status === 401) {
        settings = reloadSettings(true)
        if (settings && settings.user && settings.user.token) {
          options.headers['authorization'] = `Bearer ${settings.user.token}`
          return await request(method, pathname, headers, requestBody, options)
        } else {
          throw new Error('Unauthorized')
        }
      } else if (res.status === 403) {
        throw new Error('Forbidden')
      } else if (res.status === 404) {
        throw new Error('Not Found')
      }
      throw new Error('Unknown error')
    } catch (err: Error | any) {
      if (err instanceof Error) {
        setError(err)
      } else {
        setError(new Error('Unknown error'))
      }
      const res = {
        success: false,
        message: `Error: ${err?.message || 'Unknown error'}`,
        data: err,
      } as T
      setData(res)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, request }
}
