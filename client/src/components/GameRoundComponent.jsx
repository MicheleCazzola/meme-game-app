import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {API, SERVER_URL} from "../API.mjs";
import "./GameRoundComponent.css"

function GameRoundComponent(props) {
    const TIME_PER_ROUND = 10;
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

    let ignore;
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
    
    useEffect(() => {
        let t;
        if(mode === "playing" && missingTime > 0) {
            t = setTimeout(() => {
                const endOfRound = missingTime === 1;
                setMissingTime(curr => curr-1);
                if(endOfRound && mode === "playing"){
                    handleConfirm(false);
                }
            }, 1000);
        }
            
        return () => clearTimeout(t);
    },[missingTime]);

    useEffect(() => {
        if(roundId == 2){
            const obj = rounds.map((round, id) => {
                return {
                    roundId: id+1,
                    memeId: round.memeId,
                    name: round.name,
                    guessed: results[id]
                }
            });
            API.saveGameResults(obj)
                .then(() => {})
                .catch(err => console.log(err));
        }
    }, [readyToRegister]);

    const handleConfirm = (confirmed) => {
        setMode("waiting");
        API.getCorrectCaptions(rounds[roundId].memeId)
            .then(captions => {
                setMode("result");
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

                if(roundId == 2) {
                    setReadyToRegister(true);
                }
            })
            .catch(err => console.log(err));
    } 

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

    const handleViewSummary = () => {
        const r = results.map((guessed, id) => {
            return {
                roundId: id+1,
                guessed: guessed,
                caption: rounds[id].captions
                    .filter(caption => caption.captionId == choices[id])
                    .map(caption => caption.text)[0],
                meme: rounds[id].name
            };
        });
        props.setGameResult(r);
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
                            <Container fluid className="d-flex justify-content-center align-items-center" style={{height: "5rem"}}>
                                <Row>
                                    <Col lg={4}>
                                        {mode === "playing" && missingTime > 0 && <Timer time={missingTime}></Timer>}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg={8}>
                            <Container fluid className="h-100">
                                <Row className="align-items-center h-100">
                                    <Col lg={12}>
                                        {
                                            mode === "result" && 
                                            <Alert className="mb-0">{results[roundId] === true ? "You guessed! +5 points" :
                                                results[roundId] === false ? "You did not guess! 0 points gained" : "Time expired! 0 points gained"}</Alert>
                                        }
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4}>
                            <Container fluid className="d-flex justify-content-center align-items-center" style={{height: "31rem"}}>
                                <Row>
                                    <Col lg={12}>
                                        {rounds && <Image src = {`${SERVER_URL}/${rounds[roundId].name}`} className="meme" />}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg={8}>
                            <Container fluid> 
                                {   
                                    rounds && <Captions captions={rounds[roundId].captions} handleConfirm={handleConfirm}
                                        selected={selected} handleSelect={handleSelect} mode={mode} handleViewSummary={handleViewSummary}
                                        next={props.isLoggedIn ? roundId == 2 ? "gameResults" : "nextRound" : "newGame"} correctCaptions={captionsToShow} handleNextRound={handleNextRound}
                                        handleLeave={handleLeave} />
                                }
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

function Timer(props) {
    return(
        <div className="timer">
            {":" + `${props.time}`.padStart(2, "0")}
        </div>
    )
}

function Captions(props) {

    const handleStyle = (element, selected, guessed, solutionNotSelected) => {
        if(props.mode === "playing" && props.selected === element.captionId) return selected;
        if(props.mode === "result") {
            if (!props.correctCaptions && props.selected === element.captionId) return guessed;
            if (props.correctCaptions && props.selected === element.captionId) return selected;
            if (props.correctCaptions && props.correctCaptions.includes(element.captionId)) return solutionNotSelected;
        }
    }

    return (
        <>
            {props.captions.map((element, index) => 
                <Row className="my-3" key={element.captionId}>
                    <Col lg={12}>
                        <Card
                            className={`caption ${props.mode === "playing" && "selectable"}
                                ${handleStyle(element, "selected", "guessed", "solution")}`}
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
            <Row className="my-3 actions">
                <Col lg={6}>
                    {
                        props.mode === "playing" && props.selected && <Button variant="success" onClick={() => props.handleConfirm(true)}>Confirm</Button>
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
                    &nbsp;
                </Col>
                {/*<Col lg={6} className="d-flex justify-content-end">
                    <Button variant="danger" onClick={() => props.handleLeave()}>Leave game</Button>
                </Col>*/}
            </Row>
            
        </>
    );
}

export default GameRoundComponent;