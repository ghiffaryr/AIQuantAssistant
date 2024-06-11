import { StateCreator } from 'zustand';
import { CartSlice } from './storeType';

const initialValue = {
  cart: 0,
};

export const createCartSlice: StateCreator<
  CartSlice,
  [],
  [],
  CartSlice
> = set => ({
  ...initialValue,
  addCart: () => set(state => ({ cart: state.cart + 1 })),
});
