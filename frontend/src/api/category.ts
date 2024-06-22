/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import {
  CategoryDataResponseType,
  CategoryDetailType,
  CategoryPayloadType,
} from '@/type/CategoryType';
import { ProductCategoryResponseType } from '@/type/ProductDataType';
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const InvalidateQKey = 'category';

export const useGetCategory = (
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<CategoryDataResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<CategoryDataResponseType, any>,
    Error,
    AxiosResponse<CategoryDataResponseType, any>
  >({
    queryKey: [InvalidateQKey, page, size],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/category`, {
        signal,
        params: { page, size },
      });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetProductCategory = (
  code: string,
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<ProductCategoryResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<ProductCategoryResponseType, any>,
    Error,
    AxiosResponse<ProductCategoryResponseType, any>
  >({
    queryKey: [InvalidateQKey, 'product', page, size, code],
    queryFn: ({ signal }) => {
      return axios.get( `${VITE_API_URL}/category/${code}/product`,
        {
          signal,
          params: { page: page, size: size },
        },
      );
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetProductCategoryOnsale = (
  code: string,
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<ProductCategoryResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<ProductCategoryResponseType, any>,
    Error,
    AxiosResponse<ProductCategoryResponseType, any>
  >({
    queryKey: [InvalidateQKey, 'product', page, size, code],
    queryFn: ({ signal }) => {
      return axios.get( `${VITE_API_URL}/category/${code}/product/onsale`,
        {
          signal,
          params: { page: page, size: size },
        },
      );
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useCategorySellerDelete = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { code: string }>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { code: string }>({
    mutationFn: ({ code }) => {
      return axios.delete(`${VITE_API_URL}/seller/category/${code}/delete`);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};

export const useCategorySellerUpdate = <
  T extends AxiosResponse<
    CategoryDetailType & { productImage: string; productName: string },
    any
  >,
>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, CategoryPayloadType>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, CategoryPayloadType>({
    mutationFn: inputs => {
      return axios.put(
        `${VITE_API_URL}/seller/category/${inputs.productCategoryCode}/update`,
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

export const useCategoryPredict = <T extends AxiosResponse<any, any>>(
  mutationOptions: UseMutationOptions<
    T,
    Error,
    {
      code: string;
      val: { [key: string]: any };
    }
  >,
) => {
  return useMutation<
    T,
    Error,
    {
      code: string;
      val: { [key: string]: any };
    }
  >({
    mutationFn: ({ code, val }) => {
      return axios.post(`${VITE_API_URL}/category/${code}/predict`, {
        ...val,
      });
    },
    ...mutationOptions,
  });
};

export const useCategorySellerCreate = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, CategoryPayloadType>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, CategoryPayloadType>({
    mutationFn: inputs => {
      return axios.post(`${VITE_API_URL}/seller/category/create`, inputs);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: [InvalidateQKey] });
    },
    ...mutationOptions,
  });
};
