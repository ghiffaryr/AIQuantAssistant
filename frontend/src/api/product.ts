/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { ProductDataType } from '@/type/ProductDataType';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

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
