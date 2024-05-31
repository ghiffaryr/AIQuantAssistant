import NavbarComponent from "../../../components/basic/NavbarComponent";
import HeaderTitleComponent from "../../../components/basic/HeaderTitleComponent";
import StockList from "../../../components/stock/StockList";
import { Container } from "react-bootstrap";
import StockCodeSearch from "../../../components/stock/StockCodeSearch";
import StockStatistics from "../../../components/stock/StockStatistics";
import { StockChart } from "../../../components/stock/StockChart";

export default function StockPage() {
    return (
        <>
            <>
                <HeaderTitleComponent 
                  title={"Stocks"} 
                  divider={true}
                />
                <Container>
                    <StockList />
                    <p className="fs-5 fw-bold">Pick stock code to analyze</p>
                    <StockCodeSearch />
                    <div className="d-flex justify-content-center pt-5 pb-5">
                        <StockStatistics className="vw-100"/>
                    </div>
                    
                    <StockChart />
                </Container>
            </>
        </>
    )
};