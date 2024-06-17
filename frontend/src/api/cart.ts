/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { CartDetailResponseType } from '@/type/CartDetailResponseType';
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type CodeQuantityType = {
  code: string;
  quantity: number;
};

// TODO: invalidated cart query
export const useUpdateCartByCode = (
  mutationOptions: UseMutationOptions<AxiosResponse<any, any>, Error, any>,
) => {
  return useMutation<AxiosResponse<any, any>, Error, any>({
    mutationFn: val => {
      const { code, quantity } = val as CodeQuantityType;
      return axios.put(
        `${VITE_API_URL}/cart/${code}/update`,
        Number(quantity),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
    ...mutationOptions,
  });
};

// TODO: invalidated cart query
export const useDeleteCartByCode = (
  mutationOptions: UseMutationOptions<
    AxiosResponse<any, any>,
    Error,
    void,
    unknown
  >,
) => {
  return useMutation<AxiosResponse<any, any>, Error, any>({
    mutationFn: ({ code }) => {
      return axios.delete(`${VITE_API_URL}/cart/${code}/delete`);
    },
    ...mutationOptions,
  });
};

export const useGetProductByCode = (code: string) => {
  return useQuery({
    queryKey: ['cart', code],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/product/${code}`, { signal });
    },
    enabled: !!code,
  });
};

export const useGetCart = (
  options: Omit<
    UseQueryOptions<AxiosResponse<CartDetailResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<AxiosResponse<CartDetailResponseType, any>>({
    queryKey: ['cart'],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/cart`, { signal });
    },
    ...options,
  });
};

// TODO: invalidated cart query
export const useCartCheckout = (
  mutationOptions: UseMutationOptions<
    AxiosResponse<any, any>,
    Error,
    void,
    unknown
  >,
) => {
  return useMutation<AxiosResponse<any, any>, Error, void>({
    mutationFn: () => {
      return axios.post(`${VITE_API_URL}/cart/checkout`);
    },
    ...mutationOptions,
  });
};
