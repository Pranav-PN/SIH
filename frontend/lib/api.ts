const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const data = await response.json()
      message = data?.detail ?? data?.message ?? message
    } catch {
      // ignore JSON parse errors and fall back to generic message
    }
    throw new Error(message)
  }

  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T, B = unknown>(path: string, body: B) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
