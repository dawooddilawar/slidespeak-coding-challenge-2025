export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
    CONVERT: `${API_BASE_URL}/api/convert`,
    GET_STATUS: (id: string) => `${API_BASE_URL}/api/status/${id}`
} as const 