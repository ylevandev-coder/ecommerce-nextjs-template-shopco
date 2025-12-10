import client from "./core";

export interface GetProductCategoriesParams {
  filters?: Record<string, any>;
  sort?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string;
}

export const getProductCategories = async (params?: GetProductCategoriesParams) => {
  const response = await client
    .collection("strapi-ecommerce/product-categories")
    .find(params);

  return response;
};

export const getProductCategory = async (id: string, populate?: string) => {
  const params = populate ? { populate } : undefined;
  const response = await client
    .collection("strapi-ecommerce/product-categories")
    .findOne(id, params);

  return response;
};
