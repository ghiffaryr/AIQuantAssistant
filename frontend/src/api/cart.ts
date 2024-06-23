/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { CartDetailResponseType } from '@/type/CartDetailResponseType';
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type CodeQuantityType = {
  code: string;
  quantity: number;
};

const InvalidateQKey = 'cart';

export const useGetCart = (
  options: Omit<
    UseQueryOptions<AxiosResponse<CartDetailResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<AxiosResponse<CartDetailResponseType, any>>({
    queryKey: [InvalidateQKey],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/cart`, { signal });
    },
    ...options,
  });
};

export const useUpdateCartByCode = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, CodeQuantityType>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, CodeQuantityType>({
    mutationFn: ({ code, quantity }) => {
      return axios.put(`${VITE_API_URL}/cart/${code}/update`, quantity, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};

export const useAddCart = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, CodeQuantityType>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, CodeQuantityType>({
    mutationFn: ({ code, quantity }) => {
      return axios.post(`${VITE_API_URL}/cart/add`, {
        productCode: code,
        quantity: quantity,
      });
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};

export const useDeleteCartByCode = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<UseMutationOptions<T, Error, Omit<CodeQuantityType, 'quantity'>>, 'onSuccess'> & {
    successSideEffect: (data: T) => void;
  },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, Omit<CodeQuantityType, 'quantity'>>({
    mutationFn: ({ code }) => {
      return axios.delete(`${VITE_API_URL}/cart/${code}/delete`);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};

export const useCartCheckout = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<UseMutationOptions<T, Error, void>, 'onSuccess'> & {
    successSideEffect: (data: T) => void;
  },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, void>({
    mutationFn: () => {
      return axios.post(`${VITE_API_URL}/cart/checkout`);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};
