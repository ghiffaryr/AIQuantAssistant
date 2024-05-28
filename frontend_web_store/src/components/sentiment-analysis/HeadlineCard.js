import { Card } from "react-bootstrap";
import "../../css/pages/main/sentiment-analysis/HeadlineCard.css"
import SentimentEnum from "../../enums/SentimentEnum";

export default function HeadlineCard({
    className,
    title,
    elapsedTime,
    content,
    status,
}) {
    let textColor = ""
    switch(status) {
        case SentimentEnum.NEGATIVE:
            textColor = "text-danger"
            break
        case SentimentEnum.POSITIVE:
            textColor = "text-success"
            break
        default:
            textColor = "text-dark"
            break
    }

    return (
        <Card
            variant="light"
            key="light"
            text="dark"
            className={`shadow rounded gradient-card-bg-${status} ${className}`}
        >
            <Card.Body>
                <div className={`d-flex fs-3 fw-bold  ${textColor}align-items-center`}>
                    <p className="flex-grow-1">{title}</p>
                    <p className="fs-5">{`(${elapsedTime} Hour Ago)`}</p>
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