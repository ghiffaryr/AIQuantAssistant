import { Card } from "react-bootstrap";
import "../../css/pages/main/stock/StockStatistics.css"
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function StockStatistics({
    title,
    data,
    className
}) {
    return (
       <>
            <Card
                variant="light"
                key="light"
                text="dark"
                className={`stock-statistics-card ${className}`}
            >
                <Card.Body>
                    <p className="fs-3 fw-bold">{title}</p>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 border-bottom border-2">
                        <i class="bi bi-bank medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">Market Cap</p>
                        <p className="pe-4 fs-5 fw-bold">{data.marketCap}</p>
                    </div>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 border-bottom border-2">
                        <i class="bi bi-currency-dollar medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">Price-earnings ratio</p>
                        <p className="pe-4 fs-5 fw-bold">{data.priceEarnings}</p>
                    </div>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 border-bottom border-2">
                        <i class="bi bi-percent medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">Dividend yield</p>
                        <p className="pe-4 fs-5 fw-bold">{data.dividendYield}</p>
                    </div>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 border-bottom border-2">
                        <i class="bi bi-pie-chart-fill medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">Average volume</p>
                        <p className="pe-4 fs-5 fw-bold">{data.averageVolume}</p>
                    </div>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 border-bottom border-2">
                        <i class="bi bi-pie-chart medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">Earnings per share</p>
                        <p className="pe-4 fs-5 fw-bold">{data.earnigsPerShare}</p>
                    </div>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2 border-bottom border-2">
                        <i class="bi bi-arrow-bar-up medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">1 year high(52w)</p>
                        <p className="pe-4 fs-5 fw-bold">{data.yearHigh}</p>
                    </div>
                    <div className="d-flex flex-row align-items-center stock-statistics-row pb-2">
                        <i class="bi bi-arrow-bar-down medium-icons ps-4 pe-4"></i>
                        <p className="flex-grow-1 fs-5 fw-bold text-muted">1 year low(52w)</p>
                        <p className="pe-4 fs-5 fw-bold">{data.yearLow}</p>
                    </div>
                </Card.Body>
            </Card>
       </>
    )
}

StockStatistics.defaultProps = {
    data: {},
    className: ""
}