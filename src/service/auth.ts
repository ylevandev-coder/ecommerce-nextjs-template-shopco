import client, { API_BASE_URL } from "./core";

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

/**
 * Get the current authenticated user from Strapi
 */
export const getCurrentUser = async (token: string): Promise<StrapiUser> => {
  const response = await client.fetch("/users/me", {
    method: "GET",
    token,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch current user");
  }

  const result = await response.json();
  return result;
};

/**
 * Get Strapi Google OAuth URL
 * According to Strapi docs, the redirect URL should be configured in Strapi admin panel
 * This function returns the Strapi OAuth endpoint
 */
export const getGoogleOAuthUrl = (): string => {
  // Strapi handles the redirect internally based on configuration in admin panel
  // The redirect URL should be set in Strapi admin: http://localhost:9001/auth/social-login/google/callback
  return `${API_BASE_URL}/connect/google`;
};
