import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { SERVER_URL } from "../API.mjs";
import { Link } from "react-router-dom";
import "./GameSummaryComponent.css"

function GameSummaryComponent(props) {
    return (
        <Row className="min-vh-100 main justify-content-center">
            <Col lg={10}>
                <Container fluid>
                    <Row className={props.gameResult && "results"}>
                        {props.gameResult ? props.gameResult.map((result, id) =>
                                <RoundSummaryComponent 
                                    key={id}
                                    guessed={result.guessed}
                                    roundId={result.roundId}
                                    meme={result.meme}
                                    caption={result.caption} />) 
                                : 
                                <Col lg={12} as={"h2"}>
                                    No results to show
                                </Col>
                            }
                    </Row>
                    <Row className="actions align-content-center">
                        <Col lg={6} className="d-flex">
                            <Link to="/game">
                                <Button variant="primary" className="btn-c">New game</Button>
                            </Link>
                        </Col>
                        <Col lg={6} className="d-flex justify-content-end">
                            <Link to="/">
                                <Button variant="danger" className="btn-c">Go home</Button>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

function RoundSummaryComponent(props) {
    return (
        <>
            {props.guessed ? 
                <Col lg={4}>
                    <Container fluid className="guessed">
                        <Row className="title-row">
                            <Col lg={12} as={"h4"} className="d-flex justify-content-center my-2">Round {props.roundId}</Col>
                        </Row>
                        <Row className="meme-row">
                            <Col lg={12}>
                                <Image src={`${SERVER_URL}/${props.meme}`} className="meme"></Image>
                            </Col>
                        </Row>
                        <Row className="py-2 caption-row align-items-center">
                            <Col lg={12}>
                                <Card border="dark" bg="light">
                                    <Card.Body>
                                        <Card.Text>
                                            {props.caption}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Col> :
                <Col lg={4} className="d-flex align-content-center not-guessed">
                    <Container fluid className="not-guessed">
                        <Row className="title-row">
                                <Col lg={12} as={"h4"} className="d-flex justify-content-center my-2">Round {props.roundId}</Col>
                        </Row>
                        <Row className="not-guessed grow">
                            <Col lg={12} as={"h6"} className="d-flex justify-content-center" >
                                Not guessed
                            </Col>
                        </Row>
                    </Container>
                </Col>
        }
        </>
    );
}

export default GameSummaryComponent;