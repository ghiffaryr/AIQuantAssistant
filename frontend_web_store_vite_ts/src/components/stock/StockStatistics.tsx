import { Card } from 'react-bootstrap';
import '@/style/pages/main/stock/StockStatistics.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StockStatisticDataType } from '@/type/StocksStatisticsDataType';
import { Loader } from '@mantine/core';

export default function StockStatistics({
  title,
  data,
  className,
  isLoading,
}: StockStatisticsProps) {
  return (
    <>
      <Card
        key="light"
        text="dark"
        className={`stock-statistics-card ${className}`}
      >
        <Card.Body>
          <p className="fs-3 fw-bold">{title}</p>
          {isLoading ? (
            <div className="tw-flex tw-justify-center tw-items-center tw-h-96">
              <Loader color="rgba(97, 94, 94, 1)" size="xl" />
            </div>
          ) : (
            <>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-bank medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Market Cap
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.marketCap}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-currency-dollar medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Price-earnings ratio
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.priceEarnings}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-percent medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Dividend yield
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.dividendYield}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-pie-chart-fill medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Average volume
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.averageVolume}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-pie-chart medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Earnings per share
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.earningsPerShare}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-arrow-bar-up medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  1 year high(52w)
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.yearHigh}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-arrow-bar-up medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Price per book
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.pricePerBook}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 tw-border-b-2">
                <i className="bi bi-arrow-bar-up medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  Debt to equity
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.debtToEquity}</p>
              </div>
              <div className="d-flex flex-row align-items-center stock-statistics-row pb-2">
                <i className="bi bi-arrow-bar-down medium-icons ps-4 pe-4"></i>
                <p className="flex-grow-1 fs-5 fw-bold text-muted">
                  1 year low(52w)
                </p>
                <p className="pe-4 fs-5 fw-bold">{data.yearLow}</p>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

type StockStatisticsProps = {
  title?: string;
  data: StockStatisticDataType;
  className?: string;
  isLoading?: boolean;
};

StockStatistics.defaultProps = {
  data: {},
  className: '',
  title: '',
  isLoading: false,
};
