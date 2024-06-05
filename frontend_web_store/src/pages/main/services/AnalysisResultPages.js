import HeaderTitleComponent from "../../../components/basic/HeaderTitleComponent";
import { Card, Col, Container, Fade, Row } from "react-bootstrap";
import TextWithStatusColor from "../../../components/commons/TextWithStatusColor";
import SentimentEnum from "../../../enums/SentimentEnum";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../../css/pages/main/commons/commons.css'
import { useEffect, useState } from "react";

export default function AnalysisResult() {
    const [fFade, setFFade] = useState(false)
    const [sFade, setSFade] = useState(false)
    const [tFade, setTFade] = useState(false)
    const [thFade, setThFade] = useState(false)

    useEffect(() => {
        let timer1 = setTimeout(() => setFFade(true), 500);
        let timer2 = setTimeout(() => setSFade(true), 1000);
        let timer3 = setTimeout(() => setTFade(true), 1500);
        let timer4 = setTimeout(() => setThFade(true), 2000);

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            clearTimeout(timer4)
        }
    }, [])

    return (
        <>
            <>
                <HeaderTitleComponent 
                  title={"Analysis Result"} 
                  divider={true}
                />
                <Container>
                    <Row>
                        <Col className="d-flex">
                           <Fade in={fFade}>
                                <Card
                                    variant="light"
                                    key="light"
                                    text="dark"
                                    className="shadow-sm flex-fill"
                                >
                                    <Card.Body>
                                        <TextWithStatusColor
                                            status={SentimentEnum.POSITIVE}
                                            className="f-100 fw-bold text-center"
                                        >
                                            10%<i class="bi bi-arrow-up"></i>
                                        </TextWithStatusColor>
                                        <p className="fs-2 text-center">
                                            Expected x% increase in the next <b>1 month </b>  
                                            based on past <b>3 month transaction history</b>
                                        </p>
                                    </Card.Body>
                                </Card>
                           </Fade>
                        </Col>
                        <Col className="d-flex">
                           <Fade in={sFade}>
                                <Card
                                    variant="light"
                                    key="light"
                                    text="dark"
                                    className="shadow-sm flex-fill"
                                >
                                    <Card.Body>
                                        <TextWithStatusColor
                                            status={SentimentEnum.POSITIVE}
                                            className="f-100 fw-bold text-center"
                                        >
                                            <i class="bi bi-journal-plus"></i>
                                        </TextWithStatusColor>
                                        <p className="fs-2 text-center">
                                            Overall news sentiment is positive. 
                                        </p>
                                    </Card.Body>
                                </Card>
                           </Fade>
                        </Col>
                    </Row>
                    <Fade in={tFade}>
                        <div className="d-flex flex-column align-items-center">
                            <TextWithStatusColor className="pt-5 fw-bold f-50" status={SentimentEnum.POSITIVE}>
                                Recommended
                            </TextWithStatusColor>
                            <TextWithStatusColor className="f-50">Stock Code: <b>NVDA</b></TextWithStatusColor>
                        </div>
                    </Fade>
                    <Fade in={thFade}>
                        <Row className="pt-5 pb-5">
                            <Col>
                                <Card
                                    variant="light"
                                    key="light"
                                    text="dark"
                                    className="shadow-sm flex-fill"
                                >
                                    <Card.Body>
                                        <p className="fs-2 fw-bold text-center">
                                            Est. Target Price 
                                        </p>
                                        <TextWithStatusColor
                                            status={SentimentEnum.POSITIVE}
                                            className="fs-1 fw-bold text-center"
                                        >
                                            $500.42
                                        </TextWithStatusColor>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    variant="light"
                                    key="light"
                                    text="dark"
                                    className="shadow-sm flex-fill"
                                >
                                    <Card.Body>
                                        <p className="fs-2 text-center fw-bold ">
                                            Est. Target Price 
                                        </p>
                                        <TextWithStatusColor
                                            status={SentimentEnum.POSITIVE}
                                            className="fs-1 fw-bold text-center"
                                        >
                                            $500.42
                                        </TextWithStatusColor>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    variant="light"
                                    key="light"
                                    text="dark"
                                    className="shadow-sm flex-fill"
                                >
                                    <Card.Body>
                                        <p className="fs-2 text-center fw-bold">
                                            Est. Target Price 
                                        </p>
                                        <TextWithStatusColor
                                            status={SentimentEnum.POSITIVE}
                                            className="fs-1 fw-bold text-center"
                                        >
                                            $500.42
                                        </TextWithStatusColor>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Fade>                   
                </Container>
            </>
        </>
    )
};