// src/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../api/axiosClient';
import { type Product } from './useProducts';

interface CreateProductDto {
  name: string;
  price: number;
}

const createProduct = async (newProduct: CreateProductDto): Promise<Product> => {
  const response = await axiosClient.post<Product>('/products', newProduct);
  return response.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Auto-refresh the 'products' query to update UI automatically
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};