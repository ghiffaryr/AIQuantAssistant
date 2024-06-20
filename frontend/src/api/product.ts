/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import {
  ProductDataResponseType,
  ProductDataType,
} from '@/type/ProductDataType';
import {
  UseMutationOptions,
  UseQueryOptions,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const InvalidateQKey = 'product';

export const useGetProductByCode = (code: string) => {
  return useQuery<
    AxiosResponse<ProductDataType, any>,
    Error,
    AxiosResponse<ProductDataType, any>
  >({
    queryKey: ['product', code],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/product/${code}`, { signal });
    },
    enabled: !!code,
  });
};

export const useGetProduct = (
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<ProductDataResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<ProductDataResponseType, any>,
    Error,
    AxiosResponse<ProductDataResponseType, any>
  >({
    queryKey: ['product', page, size],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/product`, {
        signal,
        params: { page, size },
      });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetProductOnsale = (
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<ProductDataResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<ProductDataResponseType, any>,
    Error,
    AxiosResponse<ProductDataResponseType, any>
  >({
    queryKey: ['product', 'onsale', page, size],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/product/onsale`, {
        signal,
        params: { page, size },
      });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useSearchProduct = (
  params: any,
  options: Omit<
    UseQueryOptions<AxiosResponse<ProductDataResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<ProductDataResponseType, any>,
    Error,
    AxiosResponse<ProductDataResponseType, any>
  >({
    queryKey: ['product', 'search', params],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/search`, {
        signal,
        params,
      });
    },
    ...options,
  });
};

export const useProductSellerUpdate = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, ProductDataType>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, ProductDataType>({
    mutationFn: inputs => {
      return axios.put(
        `${VITE_API_URL}/seller/product/${inputs.productCode}/update`,
        inputs,
      );
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};

export const useProductSellerDelete = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { code: string }>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { code: string }>({
    mutationFn: ({ code }) => {
      return axios.delete(`${VITE_API_URL}/seller/product/${code}/delete`);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};

export const useProductSellerCreate = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, ProductDataType>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, ProductDataType>({
    mutationFn: inputs => {
      return axios.post(`${VITE_API_URL}/seller/product/create`, inputs);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};
