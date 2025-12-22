import { ProductCategory } from "./productCategory";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  sku: string;
  regularPrice: number;
  salePrice: number;
  price: number;
  stock: number;
  status: string;
  images: {
    id: number;
    url: string;
  }[];
  category?: ProductCategory;
  createdAt: string;
  updatedAt: string;
};
