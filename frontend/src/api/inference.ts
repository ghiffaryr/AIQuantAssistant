/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL, VITE_CACHE_TIME } from '@/env/env';
import { SentimentResponseDataType } from '@/type/Sentiment';
import { stringToHash } from '@/utils/string';
import { CombineResult } from '@/utils/type';
import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const InvalidateQKey = 'inference';

export const useInferSentiment = (
  news: string[],
) => {
  return useQueries({
    queries: news
      ? news.map<
          UseQueryOptions<AxiosResponse<SentimentResponseDataType[], any>>
        >(input => {
          const hash = stringToHash(input);
          return {
            queryKey: [InvalidateQKey, hash, 'sentiment'],
            queryFn: async ({ signal }) => {
              const res = await axios.post<SentimentResponseDataType[]>(
                `${VITE_API_URL}/category/text_sentiment/predict`,
                {
                  input,
                },
                { signal },
              );
              res.data.forEach((_,index) => {
                res.data[index].news = input
              })
              return res
            },
            gcTime: +VITE_CACHE_TIME,
          };
        })
      : [],
  });
};

export const useInferSummary = <T extends {[key: string]: any}>(
  news: string[],
  combineOptions?: CombineResult<string, T>,
) => {
  return useQueries({
    queries: news
      ? news.map<UseQueryOptions<AxiosResponse<string, any>>>(input => {
          const hash = stringToHash(input);
          return {
            queryKey: [InvalidateQKey, hash, 'summary'],
            queryFn: ({ signal }) => {
              return axios.post(
                `${VITE_API_URL}/category/text_summary/predict`,
                {
                  input,
                },
                { signal },
              );
            },
            gcTime: +VITE_CACHE_TIME,
          };
        })
      : [],
    combine: combineOptions,
  });
};
