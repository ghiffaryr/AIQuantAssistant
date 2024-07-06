import {
  useGetLowGainers,
  useGetStockStatistics,
  useGetTopGainers,
} from '@/api/stock';
import HeaderTitleComponent from '@/components/commons/HeaderTitleComponent';
import { StockChart } from '@/components/stock/StockChart';
import StockCodeSearch from '@/components/stock/StockCodeSearch';
import StockList from '@/components/stock/StockList';
import StockStatistics from '@/components/stock/StockStatistics';
import useBoundStore from '@/store/store';
import {
  StockStatisticDataType,
  StockStatisticResponseDataType,
} from '@/type/StocksStatisticsDataType';
import errorHandler from '@/utils/error';
import { useEffect, useMemo, useState } from 'react';
import { Container, Toast, ToastContainer } from 'react-bootstrap';

export default function StockPage() {
  const stockCode = useBoundStore.use.stockCode();
  const [topGainers, setTopGainers] = useState<
    { name: string; value: string }[]
  >([]);
  const [lowGainers, setLowGainers] = useState<
    { name: string; value: string }[]
  >([]);
  const [stockStatistics, setStockStatistics] =
    useState<StockStatisticResponseDataType>({
      avg_volume_3month: '',
      date_list: [],
      diluted_eps: '',
      market_cap_list: [],
      one_year_high: '',
      one_year_low: '',
      price_per_book_list: [],
      total_debt_to_equity: '',
      trailing_annual_dividend_yield: '',
      trailing_pe_list: [],
    });
  const [error, setError] = useState<Error>();
  const [isToastError, setIsToastError] = useState(false);

  const {
    data: topGainersData,
    error: topGainersError,
    isSuccess: topGainersIsSuccess,
    isError: topGainersIsError,
    isLoading: topGainersIsLoading,
  } = useGetTopGainers({ enabled: true });

  useEffect(() => {
    if (topGainersIsSuccess) {
      const topGainersArr = Object.entries(topGainersData.data);
      topGainersArr.sort(([a], [b]) => +a - +b);
      setTopGainers(
        topGainersArr
          .map(([, val]) => ({
            name: val['Symbol'],
            value: val['% Change'],
          }))
          .slice(0, 5),
      );
    }

    if (topGainersIsError) {
      errorHandler({
        error: topGainersError,
        axiosErrorHandlerFn: err => {
          setError(err);
          setIsToastError(true);
        },
        generalErrorHandlerFn: err => {
          setError(err);
          setIsToastError(true);
        },
      });
    }
  }, [topGainersData, topGainersError, topGainersIsSuccess, topGainersIsError]);

  const {
    data: lowGainersData,
    error: lowGainersError,
    isSuccess: lowGainersIsSuccess,
    isError: lowGainersIsError,
    isLoading: lowGainersIsLoading,
  } = useGetLowGainers({ enabled: true });

  useEffect(() => {
    if (lowGainersIsSuccess) {
      const lowGainersArr = Object.entries(lowGainersData.data);
      lowGainersArr.sort(([a], [b]) => +a - +b);
      setLowGainers(
        lowGainersArr
          .map(([, val]) => ({
            name: val['Symbol'],
            value: val['% Change'],
          }))
          .slice(0, 5),
      );
    }

    if (lowGainersIsError) {
      errorHandler({
        error: lowGainersError,
        axiosErrorHandlerFn: err => {
          setError(err);
          setIsToastError(true);
        },
        generalErrorHandlerFn: err => {
          setError(err);
          setIsToastError(true);
        },
      });
    }
  }, [lowGainersData, lowGainersError, lowGainersIsSuccess, lowGainersIsError]);

  const {
    data: stockStatisticsData,
    error: stockStatisticsError,
    isSuccess: stockStatisticsIsSuccess,
    isError: stockStatisticsIsError,
    isLoading: stockStatisticsIsLoading,
  } = useGetStockStatistics(stockCode, { enabled: !!stockCode });

  useEffect(() => {
    if (stockStatisticsIsSuccess) {
      setStockStatistics(stockStatisticsData.data);
    }

    if (stockStatisticsIsError) {
      errorHandler({
        error: stockStatisticsError,
        axiosErrorHandlerFn: err => {
          setError(err);
          setIsToastError(true);
        },
        generalErrorHandlerFn: err => {
          setError(err);
          setIsToastError(true);
        },
      });
    }
  }, [
    stockStatisticsData,
    stockStatisticsError,
    stockStatisticsIsSuccess,
    stockStatisticsIsError,
  ]);

  const chartData = useMemo(() => {
    return {
      xVal: stockStatistics.date_list,
      yVal: stockStatistics.trailing_pe_list,
    };
  }, [stockStatistics]);

  const statData = useMemo<StockStatisticDataType>(() => {
    const [marketCap] = stockStatistics.market_cap_list.slice(0, 1);
    const [priceEarnings] = stockStatistics.trailing_pe_list.slice(0, 1);
    const [pricePerBook] = stockStatistics.price_per_book_list.slice(0, 1);

    return {
      averageVolume: stockStatistics.avg_volume_3month,
      dividendYield: stockStatistics.trailing_annual_dividend_yield,
      earningsPerShare: stockStatistics.diluted_eps,
      marketCap,
      priceEarnings,
      debtToEquity: stockStatistics.total_debt_to_equity,
      pricePerBook,
      yearHigh: stockStatistics.one_year_high,
      yearLow: stockStatistics.one_year_low,
    };
  }, [stockStatistics]);

  return (
    <>
      <>
        <HeaderTitleComponent title={'Stocks'} divider={true} />
        <Container>
          <StockList
            lowGainers={lowGainers}
            topGainers={topGainers}
            lowGainersIsLoading={lowGainersIsLoading}
            topGainersIsLoading={topGainersIsLoading}
          />
          <div className="d-flex flex-column align-items-center">
            <p className="fs-5 fw-bold">Pick stock code to analyze</p>
            <StockCodeSearch className="!tw-w-2/5" />
          </div>
          {!!stockCode && (
            <>
              <div className="d-flex justify-content-center pt-5 pb-5">
                <StockStatistics
                  className="vw-100"
                  title={`Stock Statistic of ${stockCode}`}
                  data={statData}
                  isLoading={stockStatisticsIsLoading}
                />
              </div>
              <StockChart
                data={chartData}
                title="Earnings per Share"
                isLoading={stockStatisticsIsLoading}
              />
            </>
          )}
        </Container>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {error && Object.keys(error).length > 0 && (
            <Toast
              onClose={() => setIsToastError(false)}
              show={isToastError}
              delay={3000}
              autohide>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{error.message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
}
