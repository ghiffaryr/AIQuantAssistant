/* eslint-disable @typescript-eslint/no-explicit-any */
import OrderStatusEnum from '@/enums/OrderStatusEnum';
import { VITE_API_URL } from '@/env/env';
import { OrderDataType } from '@/type/OrderDataType';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const useGetOrderByStatus = (
  page: number,
  size: number,
  orderStatus: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<OrderDataType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<AxiosResponse<OrderDataType, any>>({
    queryKey: ['order', page, size, orderStatus],
    queryFn: ({ signal }) => {
      return axios.get(
        `${VITE_API_URL}/order/${OrderStatusEnum[orderStatus].toLowerCase()}`,
        { signal, params: { page: page, size: size } },
      );
    },
    ...options,
  });
};

export const useGetOrder = (
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<OrderDataType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<AxiosResponse<OrderDataType, any>>({
    queryKey: ['order', page, size],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/order`, {
        signal,
        params: { page: page, size: size },
      });
    },
    ...options,
  });
};

export const useCancelOrder = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { id: string }>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { id: string }>({
    mutationFn: val => {
      return axios.patch(`${VITE_API_URL}/order/cancel/${val.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
    ...mutationOptions,
  });
};

export const useFinishOrder = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { id: any }>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { id: any }>({
    mutationFn: ({ id }) => {
      return axios.patch(`${VITE_API_URL}/order/finish/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
    ...mutationOptions,
  });
};
