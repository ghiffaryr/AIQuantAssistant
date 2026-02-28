import { StateCreator } from 'zustand';
import { WithoutFunctions } from '@/utils/type';
import { StockSlice } from './stockType';
import { sliceResetFns } from './resetStore';

const initialValue: WithoutFunctions<StockSlice> = {
  stockCode: '',
};

export const createStockSlice: StateCreator<
  StockSlice,
  [],
  [],
  StockSlice
> = set => {
  sliceResetFns.add(() => set(initialValue));
  return {
    ...initialValue,
    setStockCode: (val: string) => set({ stockCode: val }),
  };
};
