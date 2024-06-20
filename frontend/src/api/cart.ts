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
    queryKey: ['cart'],
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
