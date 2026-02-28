type StockStatisticDataType = {
  marketCap: string;
  priceEarnings: string;
  dividendYield: string;
  averageVolume: string;
  earningsPerShare: string;
  yearHigh: string;
  yearLow: string;
  pricePerBook: string;
  debtToEquity: string;
};

type StockStatisticResponseDataType = {
  date_list: string[];
  market_cap_list: string[];
  trailing_pe_list: string[];
  price_per_book_list: string[];
  diluted_eps: string;
  avg_volume_3month: string;
  trailing_annual_dividend_yield: string;
  total_debt_to_equity: string;
  one_year_high: string;
  one_year_low: string;
};

export type { StockStatisticDataType, StockStatisticResponseDataType };
