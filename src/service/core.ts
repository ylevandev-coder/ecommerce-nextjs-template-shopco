import { useAuthStore } from "@/lib/stores/authStore";

export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';

/**
 * Builds a query string from parameters object
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle nested objects like filters, pagination
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue !== undefined && nestedValue !== null) {
          if (typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
            // Handle deeply nested objects like filters[status][$eq]
            Object.entries(nestedValue).forEach(([deepKey, deepValue]) => {
              if (deepValue !== undefined && deepValue !== null) {
                searchParams.append(`${key}[${nestedKey}][${deepKey}]`, String(deepValue));
              }
            });
          } else {
            searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          }
        }
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Makes a fetch request to the Strapi API
 */
export async function strapiFetch(
  endpoint: string,
  options: {
    method?: string;
    params?: Record<string, any>;
    body?: any;
    token?: string;
  } = {}
): Promise<Response> {
  const { method = 'GET', params, body, token } = options;
  
  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;

  // Get token from Zustand store if not explicitly provided
  const _token = token || (typeof window !== 'undefined' ? useAuthStore.getState().jwt : null);
  
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(_token && { Authorization: `Bearer ${_token}` }),
    },
  };
  
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }
  
  return fetch(url, fetchOptions);
}

export default {
  fetch: strapiFetch,
  collection: (collectionName: string) => ({
    find: async (params?: Record<string, any>) => {
      const response = await strapiFetch(`/${collectionName}`, { params });
      return response.json();
    },
    findOne: async (id: string, params?: Record<string, any>) => {
      const response = await strapiFetch(`/${collectionName}/${id}`, { params });
      return response.json();
    },
  }),
};