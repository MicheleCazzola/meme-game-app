/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {API, SERVER_URL} from "../API.mjs";
import "./GameRoundComponent.css"

function GameRoundComponent(props) {
    let ignore;
    const TIME_PER_ROUND = 30;
    const navigate = useNavigate();
    const [rounds, setRounds] = useState(undefined);    // match data
    const [roundId, setRoundId] = useState(0);  
    const [selected, setSelected] = useState(undefined);    // selected captions
    const [mode, setMode] = useState("waiting");    // waiting, playing, result
    const [results, setResults] = useState([undefined, undefined, undefined]); // T/F for round
    const [choices, setChoices] = useState([undefined, undefined, undefined]); // chosen captions to show later
    const [captionsToShow, setCaptionsToShow] = useState(undefined); // correct captions to show in round summary
    const [missingTime, setMissingTime] = useState(undefined);  // timer state
    const [readyToRegister, setReadyToRegister] = useState(false);  // flag to register data

    // Retrieves game data (meme + raw captions)
    useEffect(() => {
        if (!ignore) {
            ignore = true;
            props.setGame(true);
            API.getGameData(props.isLoggedIn)
                .then(gameData => {
                    setRounds(gameData);
                    setMode("playing");
                    setMissingTime(TIME_PER_ROUND);
                })
                .catch(err => console.log(err));
        }
    }, []);
    
    // Handles 1 second timeout for TIME_PER_ROUND times
    useEffect(() => {
        let t;
        if(mode === "playing") {
            if(missingTime > 0) {
                t = setTimeout(() => {
                    setMissingTime(curr => curr-1);
                }, 1000);
            }
            else if(missingTime === 0) {
                handleConfirm(false);
            }
        }
            
        return () => clearTimeout(t);
    },[missingTime]);

    // Register game result into database
    useEffect(() => {
        if(roundId == 2){
            const obj = rounds.map((round, id) => {
                return {
                    roundId: id+1,
                    memeId: round.memeId,
                    name: round.name,
                    guessed: results[id] || false
                }
            });
            API.saveGameResults(obj)
                .then(() => {})
                .catch(err => console.log(err));
        }
    }, [readyToRegister]);

    // Processes round results
    const processResults = (captions, confirmed) => {
        const correctCaptions = captions
            .map(captionObj => captionObj.captionId)
            .filter(captionId => 
                rounds[roundId].captions
                    .map(currCaption => currCaption.captionId)
                    .includes(captionId)
            );
        const guessed = (selected !== undefined && confirmed) ? correctCaptions.includes(selected) : undefined;
        setCaptionsToShow(!guessed && correctCaptions);
        setChoices(curr => curr.map((elem, index) => index == roundId ? selected : elem));
        setResults(curr => curr.map((elem, index) => index == roundId ? guessed : elem));
    }

    // Handle choice confirmation
    const handleConfirm = (confirmed) => {
        setMode("waiting");
        if(roundId == 2 || !props.isLoggedIn) {
            props.setGame(false);
        }
        API.getCorrectCaptions(rounds[roundId].memeId)
            .then(captions => {
                setMode("result");

                processResults(captions, confirmed);

                if(roundId == 2) {
                    setReadyToRegister(true);
                }
            })
            .catch(err => console.log(err));
    } 

    // Handle choice selection
    const handleSelect = (captionId) => {
        if (mode === "playing") {
            selected == captionId ? setSelected(undefined) : setSelected(captionId);
        }
    }

    const handleNextRound = () => {
        setSelected(undefined);
        setMode("playing");
        setRoundId(curr => curr + 1);
        setMissingTime(TIME_PER_ROUND);
    }

    // Handles navigating to view summary page
    const handleViewSummary = () => {
        const gameResult = results.map((guessed, id) => {
            return {
                roundId: id+1,
                guessed: guessed,
                caption: rounds[id].captions
                    .filter(caption => caption.captionId == choices[id])
                    .map(caption => caption.text)[0],
                meme: rounds[id].name
            };
        });
        props.setGameResult(gameResult);
        props.setGame(false);
        navigate("/game-summary");
    }

    const handleLeave = () => {
        props.setGame(false);
        navigate("/");
    }

    return (
        <Row className="min-vh-100 main justify-content-center align-items-end">
            <Col lg={12}>
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <GameInfo roundId={roundId} isLoggedIn={props.isLoggedIn} mode={mode} missingTime={missingTime} />
                        </Col>
                        <Col lg={8}>
                            <RoundMessage mode={mode} results={results} roundId={roundId} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4}>
                            <Meme rounds={rounds} roundId={roundId} />
                        </Col>
                        <Col lg={8}>
                            {   
                                rounds && 
                                    <Captions captions={rounds[roundId].captions} handleConfirm={handleConfirm}
                                        selected={selected} handleSelect={handleSelect} mode={mode} handleViewSummary={handleViewSummary}
                                        next={props.isLoggedIn ? roundId == 2 ? "gameResults" : "nextRound" : "newGame"}
                                        correctCaptions={captionsToShow} handleNextRound={handleNextRound} handleLeave={handleLeave} />
                            }
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

function GameInfo(props) {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" id="game-info">
            <Row className="align-items-end justify-content-center">
                {   
                    props.isLoggedIn && 
                        <Col lg={props.mode === "playing" && props.missingTime > 0 ? 9 : 12} className="py-1 my-0" as={"h2"}>
                            {`Round ${props.roundId+1}`}
                        </Col>
                }
                <Col lg={3}>
                    {props.mode === "playing" && props.missingTime > 0 && <Timer time={props.missingTime}></Timer>}
                </Col>
            </Row>
        </Container>
    )
}

function Timer(props) {
    return(
        <span className="timer">
            {":" + `${props.time}`.padStart(2, "0")}
        </span>
    )
}

function RoundMessage(props) {
    return (
        <Container fluid className="h-100">
            <Row className="align-items-center h-100">
                <Col lg={12}>
                    {
                        props.mode === "result" && 
                        <Alert className="mb-0"> 
                        {
                            props.results[props.roundId] === true ?
                                "You guessed! +5 points" : props.results[props.roundId] === false ?
                                    "You did not guess! 0 points gained" : "Time expired! 0 points gained"
                        }
                        </Alert>
                    }
                </Col>
            </Row>
        </Container>
    )
}

function Meme(props) {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" id="meme-container">
            <Row>
                <Col lg={12}>
                    {props.rounds && <Image src = {`${SERVER_URL}/${props.rounds[props.roundId].name}`} className="meme" />}
                </Col>
            </Row>
        </Container>
    )
}

function Captions(props) {

    const handleStyle = (element, selected, guessed, solutionNotSelected) => {
        if(props.mode === "playing" && props.selected === element.captionId) return selected;
        if(props.mode === "result") {
            if (!props.correctCaptions && props.selected === element.captionId) return guessed;
            if (props.correctCaptions && props.correctCaptions.includes(element.captionId)) return solutionNotSelected;
            if (props.correctCaptions && props.selected === element.captionId) return selected;
        }
    }

    return (
        <Container fluid>
            {
                props.captions.map((element, index) => 
                    <Row className="my-3" key={element.captionId}>
                        <Col lg={12}>
                            <Card
                                className={
                                    `caption ${props.mode === "playing" && "selectable"}
                                    ${handleStyle(element, "selected", "guessed", "solution")}`
                                }
                                onClick={() => props.handleSelect(element.captionId)}>
                                <Card.Body>
                                    <Card.Text className="h6">
                                        {String.fromCharCode(96+index+1) + ") " + element.text}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )
            }
            <Row className="my-3 actions">
                <Col lg={6}>
                    {
                        props.mode === "playing" && props.selected && 
                            <Button variant="success" onClick={() => props.handleConfirm(true)}>
                                Confirm
                            </Button>
                    }
                    {
                        props.mode === "result" && props.next === "newGame" && 
                            <Button variant="primary" onClick={() => props.handleLeave()}>
                                Go home
                            </Button>
                    }
                    {
                        props.mode === "result" && props.next === "nextRound" &&
                            <Button variant="primary" onClick={() => props.handleNextRound()}>
                                Next round
                            </Button>
                    }
                    {
                        props.mode === "result" && props.next === "gameResults" && 
                            <Button variant="primary" onClick={() => props.handleViewSummary()}>
                                Go to summary
                            </Button>
                    }
                </Col>
                {
                    props.mode === "result" && props.next !== "newGame" &&
                        <Col lg={6} className="d-flex justify-content-end">
                            <Button variant="danger" onClick={() => props.handleLeave()}>
                                {props.next === "gameResults" ? "Go home" : "Leave game"}
                            </Button>
                        </Col>
                }
            </Row>
        </Container>
    );
}

export default GameRoundComponent;