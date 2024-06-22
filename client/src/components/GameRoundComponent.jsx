import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../API.mjs";
import "./GameRoundComponent.css"

function GameRoundComponent(props) {

    const navigate = useNavigate();
    const {roundId} = useParams();
    const [rounds, setRounds] = useState(undefined);
    const [selected, setSelected] = useState(undefined);
    const [mode, setMode] = useState("waiting");    // waiting, playing, result
    const [result, setResult] = useState([false, false, false]);
    const [choices, setChoices] = useState([undefined, undefined, undefined]);
    const [captionsToShow, setCaptionsToShow] = useState(undefined);

    let currentRound = rounds && rounds[parseInt(roundId)-1];

    let ignore;
    useEffect(() => {
        console.log(`Ignore: ${ignore}`);
        if (!ignore) {
            ignore = true;
            API.getGameData(props.isLoggedIn)
                .then(gameData => {
                    setRounds(gameData);
                    setMode("playing");
                    console.log("inside");
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleConfirm = () => {
        API.getCorrectCaptions(currentRound.memeId)
            .then(captions => {
                setMode("result");
                const correctCaptions = captions.map(captionObj => captionObj.captionId)
                    .filter(captionId => currentRound.captions.map(currCaption => currCaption.captionId).includes(captionId));
                const guessed = correctCaptions.includes(selected);
                setCaptionsToShow(!guessed && correctCaptions);
                //console.log(roundId);
                console.log(captions, currentRound.captions, correctCaptions);
                setChoices(curr => {
                    return curr.map((elem, index) => {
                        console.log(index, roundId-1, elem, selected);
                        if (index == roundId-1) {
                            return selected;
                        }
                        return elem;
                    })
                });
                setResult(curr => {
                    return curr.map((elem, index) => {
                        if (index == roundId-1) {
                            return guessed;
                        }
                        return elem;
                    })
                });
                console.log(choices, result);
            })
            .catch(err => console.log(err));
    } 

    const handleSelect = (captionId) => {
        if (mode === "playing") {
            setSelected(captionId);
        }
    }

    const handleLeave = () => {

    }

    return (
        <Row className="min-vh-100 main justify-content-center align-items-center">
            <Col lg={4}>
                <Container fluid className="justify-content-center">
                    <Row className="align-items-center">
                        <Col lg={4}>
                            {currentRound && <MemeImg meme={currentRound.name} />}
                        </Col>
                    </Row>
                </Container>
            </Col>
            <Col lg={8}>
                <Container fluid> 
                    {   
                        currentRound && <Captions captions={currentRound.captions} handleConfirm={handleConfirm}
                            selected={selected} handleSelect={handleSelect} mode={mode} nextRound={props.isLoggedIn && roundId < 2 ? parseInt(roundId)+1 : undefined}
                            next={props.isLoggedIn ? roundId == 2 ? "gameResults" : "nextRound" : "newGame"} correctCaptions={captionsToShow}
                            handleLeave={handleLeave} />
                    }
                    {
                        mode === "result" && 
                        <Alert>{result[roundId-1] === true ? "You guessed! +5 points" : "You did not guess! 0 points gained"}</Alert>
                    }
                </Container>
            </Col>
        </Row>
    );
}

function MemeImg(props) {
    //console.log(props);
    return (
        <div>{props.meme}</div>
        /*<Row>
            <Col lg={12}>
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col></Col>
                    </Row>
                </Container>
            </Col>
        </Row>*/
    );
}

function Captions(props) {

    const handleColors = (element, select, correctSelected, correctNotSelected, others) => {
        //console.log(props);
        if(props.mode === "playing" && props.selected === element.captionId) return select;
        if(props.mode === "result") {
            console.log(props.correctCaptions);
            if (!props.correctCaptions && props.selected === element.captionId) return correctSelected;
            if (props.correctCaptions && props.selected === element.captionId) return select;
            if (props.correctCaptions && props.correctCaptions.includes(element.captionId)) return correctNotSelected;
        }
        return others;
    }

    return (
        <>
            {props.captions.map((element, index) => 
                <Row className="my-3" key={element.captionId}>
                    <Col lg={12}>
                        <Card className="caption"
                            border={handleColors(element, "dark", "dark", "dark", "primary")}
                            bg={handleColors(element, "warning", "success", "danger", "light")}
                            onClick={() => props.handleSelect(element.captionId)}>
                            <Card.Body>
                                <Card.Text className="h6">
                                    {String.fromCharCode(96+index+1) + ") " + element.text}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            <Row className="my-3" >
                <Col lg={6}>
                    {
                        props.mode === "playing" && props.selected && <Button variant="success" onClick={() => props.handleConfirm()}>Confirm</Button>
                    }
                    {
                        props.mode === "result" && props.next === "newGame" && 
                            <Link to="/">
                                <Button variant="primary">
                                    Go home
                                </Button>
                            </Link>
                    }
                    {
                        props.mode === "result" && props.next === "nextRound" && 
                            <Link to={`/game/${props.nextRound}`}>
                                <Button variant="primary">
                                    Next round
                                </Button>
                            </Link>
                    }
                    {
                        props.mode === "result" && props.next === "globalResults" && 
                            <Link to={"/game-summary"}>
                                <Button variant="primary">
                                    Go to summary
                                </Button>
                            </Link>
                    }
                </Col>
                <Col lg={6} className="d-flex justify-content-end">
                    <Button variant="danger" onClick={() => props.handleLeave()}>Leave game</Button>
                </Col>
            </Row>
            
        </>
    );
}

export default GameRoundComponent;