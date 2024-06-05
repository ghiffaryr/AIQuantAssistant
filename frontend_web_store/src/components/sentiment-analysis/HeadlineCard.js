import { Card } from "react-bootstrap";
import "../../css/pages/main/sentiment-analysis/HeadlineCard.css"
import SentimentEnum from "../../enums/SentimentEnum";
import TextWithStatusColor from "../commons/TextWithStatusColor";

export default function HeadlineCard({
    className,
    title,
    elapsedTime,
    content,
    status,
}) {
    return (
        <Card
            variant="light"
            key="light"
            text="dark"
            className={`shadow rounded gradient-card-bg-${status} ${className}`}
        >
            <Card.Body>
                <div className={`d-flex fs-3 fw-bold align-items-center`}>
                    <TextWithStatusColor
                        status={SentimentEnum.POSITIVE}
                        className="flex-grow-1"
                    >
                        {title}
                    </TextWithStatusColor>
                    <TextWithStatusColor
                        status={SentimentEnum.POSITIVE}
                        className="fs-5"
                    >
                        {`(${elapsedTime} Hour Ago)`}
                    </TextWithStatusColor>
                </div>
                <p>{content}</p>
            </Card.Body>
        </Card>
    )
}

HeadlineCard.defaultProps = {
    className: "",
    title: "",
    elapsedTime: 0,
    content: "",
    status: ""
}