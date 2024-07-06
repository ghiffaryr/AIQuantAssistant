/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

/* eslint-disable @typescript-eslint/ban-types */
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type WithoutFunctions<T> = Omit<T, FunctionPropertyNames<T>>;

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

type MappedType<T extends string | number | symbol, K> = {
  [P in T]: K;
};

type CombineResult<TResponse, TResult extends { [key: string]: any } = any> = (
  result: UseQueryResult<AxiosResponse<TResponse, any>, Error>[],
) => TResult;

export type { WithoutFunctions, WithSelectors, MappedType, CombineResult };
