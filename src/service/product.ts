import client from "./core";

export interface GetProductsParams {
  filters?: Record<string, any>;
  sort?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string;
}

export const getProducts = async (params?: GetProductsParams) => {
  const response = await client.fetch("/products", {
    method: "GET",
    params,
  });

  const { data } = await response.json();
  return data || [];
};

export const getProduct = async (id: string, populate?: string) => {
  const params = populate ? { populate } : undefined;
  const response = await client.collection("products").findOne(id, params);

  return response;
};

export const getProductBySlug = async (slug: string) => {
  const response = await client.fetch(`/products?filters[slug][$eq]=${slug}`, {
    method: "GET",
  });

  const { data } = await response.json();
  return data?.[0] || null;
};
