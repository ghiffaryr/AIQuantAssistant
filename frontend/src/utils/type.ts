/* eslint-disable @typescript-eslint/ban-types */
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type WithoutFunctions<T> = Omit<T, FunctionPropertyNames<T>>;

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export type { WithoutFunctions, WithSelectors };
