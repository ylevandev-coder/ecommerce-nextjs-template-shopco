import client from "./core";
import { Product } from "@/types/product.types";

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
  return data;
};

export const getProduct = async (id: string, populate?: string) => {
  const params = populate ? { populate } : undefined;
  const response = await client
    .collection("products")
    .findOne(id, params);

  return response;
};
