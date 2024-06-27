import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { SERVER_URL } from "../API.mjs";
import { Link } from "react-router-dom";
import "./GameSummaryComponent.css"

function GameSummaryComponent(props) {
    const totalPoints = props.gameResult && 
        5 * props.gameResult
            .map(result => result.guessed || 0)
            .reduce((a, b) => a + b);
            
    return (
        <Row className="min-vh-100 main justify-content-center">
            <Col lg={10}>
                <Container fluid>
                    <Row className={props.gameResult && "points"}>
                        {
                            props.gameResult && 
                                <Col as={"h4"}>
                                    Points gained: {totalPoints}
                                </Col>
                        }
                    </Row>
                    <Row className={props.gameResult && totalPoints > 0 && "results justify-content-center"}>
                        {props.gameResult ? 
                            totalPoints > 0 ?
                                props.gameResult.map((result, id) =>
                                    <RoundSummaryComponent 
                                        key={id}
                                        guessed={result.guessed}
                                        roundId={result.roundId}
                                        meme={result.meme}
                                        caption={result.caption} />) 
                                : 
                                <Col lg={12} as={"h2"}>
                                    No guessed memes, try again!
                                </Col>
                            :    
                            <Col lg={12} as={"h2"}>
                                    No results to show
                            </Col>    
                        }
                    </Row>
                    <Row className="actions align-content-center my-3">
                        <Actions />
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

function RoundSummaryComponent(props) {
    return (
        <>
            {props.guessed && 
                <Col lg={4} className="d-flex">
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
                </Col>
            }
        </>
    );
}

function Actions(props) {
    return (
        <>
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
        </>
    );
}

export default GameSummaryComponent;