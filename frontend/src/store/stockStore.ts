import { StateCreator } from 'zustand';
import { WithoutFunctions } from '@/utils/type';
import { StockSlice } from './stockType';

const initialValue: WithoutFunctions<StockSlice> = {
  stockCode: '',
};

export const createStockSlice: StateCreator<
  StockSlice,
  [],
  [],
  StockSlice
> = set => ({
  ...initialValue,
  setStockCode: (val: string) => set({ stockCode: val }),
});
