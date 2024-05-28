import React from "react";
import { Col, Row } from "react-bootstrap";
import StockCard from "./StockCard";

export default function StockList({
    topGainers,
    lowGainers
}) {
    return (
        <Row className="pb-5">
            <Col>
                <p className="fs-5 fw-bold text-center">Top 5 Gainers</p>
                <StockCard data={topGainers}/>
            </Col>
            <Col>
                <p className="fs-5 fw-bold text-center">Top 5 Gainers</p>
                <StockCard data={lowGainers}/>
            </Col>
        </Row>
    );
}

StockList.defaultProps = {
    topGainers: [
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        }
    ],
    lowGainers: [
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        },
        {
            name: "TSLA",
            value: "+7%"
        }
    ]
}


