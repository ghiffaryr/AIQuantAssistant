import NavbarComponent from "../../../components/basic/NavbarComponent";
import HeaderTitleComponent from "../../../components/basic/HeaderTitleComponent";
import { Container } from "react-bootstrap";
import HeadlineCard from "../../../components/sentiment-analysis/HeadlineCard";

export default function SentimentAnalysisPage() {
    return (
        <>
            <NavbarComponent />
            <>
                <HeaderTitleComponent 
                  title={"Sentiment Analysis"} 
                  divider={true}
                />
                <Container>
                   <div className="d-flex">
                        <div className="flex-grow-1 d-flex">
                            <p>Overall news sentiment: </p>
                            <p className="fw-bold ps-1 text-success">positive</p>
                        </div>
                        <div className="d-flex">
                            <p>Stock code: </p>
                            <p className="fw-bold ps-1">NVDA</p>
                        </div>
                   </div>
                   <HeadlineCard />
                </Container>
            </>
        </>
    )
};