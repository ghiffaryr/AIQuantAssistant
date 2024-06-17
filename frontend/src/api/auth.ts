/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { LoginResponseType } from '@/type/LoginType';
import { LoginPayloadType } from '@/type/LoginType';
import { ProfileDataType } from '@/type/ProfileDataType';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const useGetProfile = (
  options: Omit<
    UseQueryOptions<AxiosResponse<ProfileDataType>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<ProfileDataType, any>,
    Error,
    AxiosResponse<ProfileDataType, any>
  >({
    queryKey: ['auth'],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/profile`, { signal });
    },
    ...options,
  });
};

// TODO: invalidated cart query
export const useLoginMutation = (
  mutationOptions: UseMutationOptions<
    AxiosResponse<LoginResponseType, any>,
    Error,
    LoginPayloadType,
    unknown
  >,
) => {
  return useMutation<
    AxiosResponse<LoginResponseType, any>,
    Error,
    LoginPayloadType
  >({
    mutationFn: val => {
      return axios.post(`${VITE_API_URL}/login`, val);
    },
    ...mutationOptions,
  });
};
