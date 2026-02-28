import { Col, Row } from 'react-bootstrap';
import StockCard from './StockCard';

export default function StockList({
  topGainers,
  lowGainers,
  lowGainersIsLoading,
  topGainersIsLoading,
}: StockListProps) {
  return (
    <Row className="pb-5">
      <Col>
        <p className="fs-5 fw-bold text-center">Top 5 Gainers</p>
        <StockCard data={topGainers} isLoading={topGainersIsLoading} />
      </Col>
      <Col>
        <p className="fs-5 fw-bold text-center">Top 5 Losers</p>
        <StockCard data={lowGainers} isLoading={lowGainersIsLoading} />
      </Col>
    </Row>
  );
}

type StockListProps = {
  topGainers: { name: string; value: string }[];
  lowGainers: { name: string; value: string }[];
  topGainersIsLoading: boolean;
  lowGainersIsLoading: boolean;
};

StockList.defaultProps = {
  topGainers: [],
  lowGainers: [],
  topGainersIsLoading: false,
  lowGainersIsLoading: false,
};
