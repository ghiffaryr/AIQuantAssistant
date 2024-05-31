import NavbarComponent from "../../../components/basic/NavbarComponent";
import HeaderTitleComponent from "../../../components/basic/HeaderTitleComponent";
import { Container } from "react-bootstrap";
import HeadlineCard from "../../../components/sentiment-analysis/HeadlineCard";
import SentimentEnum from "../../../enums/SentimentEnum";

export default function NarrativeSummary() {
    return (
        <>
            <>
                <HeaderTitleComponent 
                  title={"Narrative Summary"} 
                  divider={true}
                />
                <Container>
                    <div>
                        <p className="fw-bold">Overall news sentiment: </p>
                        <p>Lorem ipsum dolor sit amet consectetur. Donec tortor dictumst lacus integer id dignissim tincidunt sollicitudin semper. Augue in
                            nibh ac quam nulla enim. Tellus habitant auctor netus aliquam sapien viverra fermentum augue viverra. Duis tellus lacus libero
                            ornare aliquet leo sed dui. Mauris molestie malesuada mattis ut ipsum purus semper mi feugiat. </p>
                    </div>
                    <HeadlineCard 
                        title = "Headline 1"
                        status = {SentimentEnum.POSITIVE}
                    />
                </Container>
            </>
        </>
    )
};