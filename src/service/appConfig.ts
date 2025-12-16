import client from "./core";

export interface AppConfig {
  id?: number;
  name?: string;
  logo?: {
    id: number;
    url: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
  slogan?: string;
  ctaText?: string;
  footer?: any;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Get app config from Strapi API
 */
export const getAppConfig = async (): Promise<AppConfig> => {
  // For singleType, Strapi uses the singular name without ID
  const response = await client.fetch("/app-setting", {
    method: "GET",
    params: {
      populate: "*", // Populate all relations (logo, footer, etc.)
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch app config");
  }

  const result = await response.json();
  return result.data;
};

