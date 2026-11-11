const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('agrismart_token') || 'demo-farmer-token';
  
  const headers = {
    ...options.headers
  };

  // Only set Content-Type to JSON if not uploading FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.details = data?.error?.details || null;
    throw error;
  }

  return data;
}

export const api = {
  // Profiles
  getProfile: () => apiRequest('/profile'),
  updateProfile: (body) => apiRequest('/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Crops
  getCrops: () => apiRequest('/crops'),
  getCropById: (id) => apiRequest(`/crops/${id}`),
  getFarmerCrops: () => apiRequest('/farmer-crops'),
  registerFarmerCrop: (body) => apiRequest('/farmer-crops', { method: 'POST', body: JSON.stringify(body) }),
  updateGrowthStage: (id, currentGrowthStage) => apiRequest(`/farmer-crops/${id}/stage`, { method: 'PUT', body: JSON.stringify({ currentGrowthStage }) }),

  // Advisories
  recommendCrops: (body) => apiRequest('/ai/crop-recommendation', { method: 'POST', body: JSON.stringify(body) }),
  getFertilizerAdvisory: (body) => apiRequest('/ai/fertilizer-advisory', { method: 'POST', body: JSON.stringify(body) }),
  getIrrigationAdvisory: (body) => apiRequest('/ai/irrigation-advisory', { method: 'POST', body: JSON.stringify(body) }),
  getAdvisories: (params = '') => apiRequest(`/advisories${params}`),
  getAdvisoryById: (id) => apiRequest(`/advisories/${id}`),
  deleteAdvisory: (id) => apiRequest(`/advisories/${id}`, { method: 'DELETE' }),

  // Disease Scan
  scanDisease: (formData) => apiRequest('/ai/disease-detection', { method: 'POST', body: formData }),
  getDiseaseReport: (id) => apiRequest(`/ai/disease-detection/${id}`),

  // Weather
  getWeatherForecast: (lat, lon) => apiRequest(`/weather/forecast?lat=${lat || ''}&lon=${lon || ''}`),
  getWeatherAdvisory: (lat, lon) => apiRequest(`/weather/advisory?lat=${lat || ''}&lon=${lon || ''}`),

  // Chat
  sendMessage: (body) => apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
  getConversations: () => apiRequest('/ai/chat/conversations'),
  getConversationById: (id) => apiRequest(`/ai/chat/conversations/${id}`),
  deleteConversation: (id) => apiRequest(`/ai/chat/conversations/${id}`, { method: 'DELETE' }),

  // Guides
  getGuides: (params = '') => apiRequest(`/guides${params}`),
  getGuideBySlug: (slug) => apiRequest(`/guides/${slug}`),

  // Admin
  getAdminMetrics: () => apiRequest('/admin/dashboard'),
  getAdminSources: () => apiRequest('/admin/sources')
};

