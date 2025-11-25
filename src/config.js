// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  PREDICT: `${API_BASE_URL}/api/predict`,
  PRODUCTS: `${API_BASE_URL}/products`,
  CALCULATE: `${API_BASE_URL}/cart/calculate`,
  CHECKOUT: `${API_BASE_URL}/checkout`
};

export const CONFIDENCE_THRESHOLD = 0.6; // Minimum confidence for prediction