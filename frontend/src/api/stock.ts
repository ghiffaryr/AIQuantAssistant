/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_CACHE_TIME, VITE_SCRAPPER_API_URL } from '@/env/env';
import { StockStatisticResponseDataType } from '@/type/StocksStatisticsDataType';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const InvalidateQKey = 'stock';

export const useGetTopGainers = (
  options: Omit<
    UseQueryOptions<
      AxiosResponse<{ [key: string]: { [key: string]: string } }>
    >,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<{ [key: string]: { [key: string]: string } }, any>
  >({
    queryKey: [InvalidateQKey, 'topGainers'],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_SCRAPPER_API_URL}/scrapper/stock/gainers`, { signal });
    },
    gcTime: +VITE_CACHE_TIME,
    ...options,
  });
};


export const useGetLowGainers = (
  options: Omit<
    UseQueryOptions<
      AxiosResponse<{ [key: string]: { [key: string]: string } }>
    >,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<{ [key: string]: { [key: string]: string } }, any>
  >({
    queryKey: [InvalidateQKey, 'lowGainers'],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_SCRAPPER_API_URL}/scrapper/stock/losers`, { signal });
    },
    gcTime: +VITE_CACHE_TIME,
    ...options,
  });
};

export const useGetStockStatistics = (
  stockCode: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<StockStatisticResponseDataType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<AxiosResponse<StockStatisticResponseDataType, any>>({
    queryKey: [InvalidateQKey, stockCode, 'statistics'],
    queryFn: ({ signal }) => {
      return axios.post(`${VITE_SCRAPPER_API_URL}/scrapper/stock/${stockCode}/statistics`, { signal });
    },
    gcTime: +VITE_CACHE_TIME,
    ...options,
  });
};
