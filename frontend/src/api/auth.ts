/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { LoginResponseType } from '@/type/LoginType';
import { LoginPayloadType } from '@/type/LoginType';
import { ProfileDataType } from '@/type/ProfileDataType';
import { MappedType } from '@/utils/type';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const InvalidateProfileQKey = 'profile';

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
    queryKey: ['auth', 'profile'],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/profile`, { signal });
    },
    ...options,
  });
};

export const useUpdateProfile = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, MappedType<string, any>>,
    'onSuccess'
  > & { successSideEffect: (data: T) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, MappedType<string, any>>({
    mutationFn: inputs => {
      return axios.patch(`${VITE_API_URL}/profile/update`, {
        ...Object.fromEntries(
          Object.entries(inputs).filter(
            ([key, value]) =>
              key !== 'firstName' &&
              key !== 'lastName' &&
              key !== 'coPassword' &&
              value !== '' &&
              value !== null,
          ),
        ),
        name: `${inputs.firstName} ${inputs.lastName}`,
        birthdate: new Date(inputs.birthdate).toISOString(),
      });
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({
        predicate: query => {
          return query.queryKey.some(val => val === InvalidateProfileQKey);
        },
      });
    },
    ...mutationOptions,
  });
};

export const useDeactivateProfile = (
  mutationOptions: UseMutationOptions<
    AxiosResponse<any, any>,
    Error,
    void,
    unknown
  >,
) => {
  return useMutation<AxiosResponse<any, any>, Error, void>({
    mutationFn: () => {
      return axios.patch(`${VITE_API_URL}/profile/deactivate`);
    },
    ...mutationOptions,
  });
};

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
