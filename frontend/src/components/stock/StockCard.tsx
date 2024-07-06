import { Skeleton } from '@mantine/core';
import { Card, Col, Row } from 'react-bootstrap';

export default function StockCard({ data, isLoading }: StockCardProps) {
  const columnLength = 5;
  return (
    <Card key="light" text="dark" className="shadow rounded">
      <Card.Body>
        <Row>
          {isLoading &&
            Array.from(Array(columnLength).keys()).map((_, index) => (
              <Col
                key={index}
                className={`d-flex flex-column align-items-center  ${index < columnLength - 1 ? 'border-end border-dark' : ''}`}>
                <Skeleton height={20} mt={6} />
                <Skeleton height={20} mt={6} />
              </Col>
            ))}
          {!isLoading &&
            data.map((val, index) => (
              <Col
                className={`d-flex flex-column align-items-center  ${index < data.length - 1 ? 'border-end border-dark' : ''}`}>
                <Card.Text>{val.name}</Card.Text>
                <Card.Text>{val.value}</Card.Text>
              </Col>
            ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

type StockCardProps = {
  data: { name: string; value: string }[];
  isLoading: boolean;
};

StockCard.defaultProps = {
  data: [],
  isLoading: false,
};
