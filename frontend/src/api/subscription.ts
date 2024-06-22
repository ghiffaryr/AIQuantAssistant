/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { SubscriptionResponseType } from '@/type/SubscriptionType';
import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const InvalidateQKey = 'subscription';

export const useGetSubscription = (
  page: number,
  size: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<SubscriptionResponseType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<SubscriptionResponseType, any>,
    Error,
    AxiosResponse<SubscriptionResponseType, any>
  >({
    queryKey: [InvalidateQKey, page, size],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/subscription`, {
        signal,
        params: { page, size },
      });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};
