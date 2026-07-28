// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../api/axiosClient';

// Type definition matching C# DTO
export interface Product {
  id: string;
  name: string;
  price: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axiosClient.get<Product[]>('/products');
  return response.data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};