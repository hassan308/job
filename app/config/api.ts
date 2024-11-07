const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smidra.com';

export const API_ENDPOINTS = {
  search: `${API_URL}/search`,
  generateCV: `${API_URL}/generate_cv`
}; 