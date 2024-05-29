import NavbarComponent from "../../../components/basic/NavbarComponent";
import HeaderTitleComponent from "../../../components/basic/HeaderTitleComponent";
import { Container } from "react-bootstrap";
import HeadlineCard from "../../../components/sentiment-analysis/HeadlineCard";
import TextWithStatusColor from "../../../components/commons/TextWithStatusColor";
import SentimentEnum from "../../../enums/SentimentEnum";

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
                            <TextWithStatusColor
                                className="fw-bold ps-1"
                                status={SentimentEnum.POSITIVE}
                            >
                                positive
                            </TextWithStatusColor>
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