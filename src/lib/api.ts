// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

export const API_ENDPOINTS = {
  GENERATE: `${API_BASE_URL}/api/generate`,
  CHECKOUT: `${API_BASE_URL}/api/checkout`,
  VERIFY_SESSION: (sessionId: string) => `${API_BASE_URL}/api/verify-session/${sessionId}`,
  STRIPE_WEBHOOK: `${API_BASE_URL}/api/stripe-webhook`,
};

export default API_BASE_URL;
