import { StateCreator } from 'zustand';
import { CartSlice, CartDetailsType } from './storeType';
import { WithoutFunctions } from '@/utils/type';

const initialValue: WithoutFunctions<CartSlice> = {
  cart: 0,
  cartDetails: [],
};

export const createCartSlice: StateCreator<
  CartSlice,
  [],
  [],
  CartSlice
> = set => ({
  ...initialValue,
  addCart: () => set(state => ({ cart: state.cart + 1 })),
  setCartOrderDetails: val => set({ cartDetails: val }),
  appendCartOrderDetails: (...val: CartDetailsType[]) =>
    set(state => ({ cartDetails: [...state.cartDetails, ...val] })),
});
