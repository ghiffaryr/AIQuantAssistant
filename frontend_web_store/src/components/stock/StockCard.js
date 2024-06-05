import { Card, Col, Row } from "react-bootstrap";
import { Skeleton } from '@mantine/core';

export default function StockCard({
    data
}) {
    const columnLength = 5
    const loadingComponent = Array.from(Array(columnLength).keys())
        .map((_, index) => (
            <>
                <Col key={index} className={`d-flex flex-column align-items-center  ${index < columnLength - 1 ? 'border-end border-dark' : ''}`}>
                    <Skeleton height={20} mt={6} />
                    <Skeleton height={20} mt={6}/>
                </Col>
            </>
        ))

    return (
        <Card
            variant="light"
            key="light"
            text="dark"
            className="shadow rounded"
        >
            <Card.Body>
                <Row>
                    {data.length > 0 ? data.map((val, index) => (
                         <>
                            <Col key={index} className={`d-flex flex-column align-items-center  ${index < data.length - 1 ? 'border-end border-dark' : ''}`}>
                                <Card.Text>{val.name}</Card.Text>
                                <Card.Text>{val.value}</Card.Text>
                            </Col>
                         </>
                    )) 
                    : loadingComponent}
                </Row>
            </Card.Body>
        </Card>
    )
}

StockCard.defaultProps = {
    data: []
}