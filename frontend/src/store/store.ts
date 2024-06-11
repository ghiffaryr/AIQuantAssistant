import { create } from 'zustand';
import { CartSlice } from './storeType';
import { createCartSlice } from './cartStore';

const useStore = create<CartSlice>()((...a) => ({
  ...createCartSlice(...a),
}));

export default useStore;
