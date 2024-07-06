type StockStoreType = {
  stockCode: string;
};

type StockAction = {
  setStockCode: (val: string) => void;
};

type StockSlice = StockStoreType & StockAction;

export type { StockSlice, StockStoreType };
