const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/search`,
  generateCV: `${API_BASE_URL}/generate_cv`
}; 