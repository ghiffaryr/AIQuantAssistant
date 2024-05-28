import { Card, Col, Row } from "react-bootstrap";

export default function StockCard({
    data
}) {
    return (
        <Card
            variant="light"
            key="light"
            text="dark"
            className="shadow rounded"
        >
            <Card.Body>
                <Row>
                    {data.map((val, index) => (
                         <>
                            <Col className={`d-flex flex-column align-items-center  ${index < data.length - 1 ? 'border-end border-dark' : ''}`}>
                                <Card.Text>{val.name}</Card.Text>
                                <Card.Text>{val.value}</Card.Text>
                            </Col>
                         </>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    )
}

StockCard.defaultProps = {
    data: []
}