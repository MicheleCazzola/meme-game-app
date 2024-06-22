import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../API.mjs";
import "./GameRoundComponent.css"

function GameRoundComponent(props) {
    const TIME_PER_ROUND = 10;
    const navigate = useNavigate();
    const {roundId} = useParams();
    const [rounds, setRounds] = useState(undefined);
    const [image, setImage] = useState(undefined);
    //const [currentRound, setCurrentRound] = useState(undefined);
    const [selected, setSelected] = useState(undefined);
    const [mode, setMode] = useState("waiting");    // waiting, playing, result
    const [result, setResult] = useState([undefined, undefined, undefined]);
    const [choices, setChoices] = useState([undefined, undefined, undefined]);
    const [captionsToShow, setCaptionsToShow] = useState(undefined);
    const [missingTime, setMissingTime] = useState(undefined);
    
    let currentRound = rounds && rounds[parseInt(roundId)-1];

    let ignore;
    useEffect(() => {
        //console.log(`Ignore: ${ignore}`);
        if (!ignore) {
            ignore = true;
            props.setGame(true);
            API.getGameData(props.isLoggedIn)
                .then(gameData => {
                    setRounds(gameData);
                    
                })
                .catch(err => console.log(err));
        }
    }, []);

    ignore = false;
    useEffect(() => {
        if(!ignore) {
            ignore = true;
            API.getImage(currentRound.name)
            .then(result => {
                setImage(result);
                setMode("playing");
                setMissingTime(TIME_PER_ROUND);
            })
            .catch(err => console.log(err));
        }
    }, [currentRound]);
    
    useEffect(() => {
        let t;
        if(mode === "playing" && missingTime > 0) {
            t = setTimeout(() => {
                const endOfRound = missingTime === 1;
                setMissingTime(curr => curr-1);
                if(endOfRound){
                    handleConfirm();
                }
            }, 1000);
        }
            
        return () => clearTimeout(t);
    },[missingTime]);

    const handleConfirm = () => {
        setMode("waiting");
        API.getCorrectCaptions(currentRound.memeId)
            .then(captions => {
                setMode("result");
                const correctCaptions = captions
                    .map(captionObj => captionObj.captionId)
                    .filter(captionId => currentRound.captions
                        .map(currCaption => currCaption.captionId).includes(captionId));
                const guessed = selected !== undefined ? correctCaptions.includes(selected) : undefined;
                setCaptionsToShow(!guessed && correctCaptions);
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
            })
            .catch(err => console.log(err));
    } 

    const handleSelect = (captionId) => {
        if (mode === "playing") {
            setSelected(captionId);
        }
    }

    const handleNextRound = (currentRoundId) => {
        setSelected(undefined);
        setImage(undefined);
        setMode("waiting");
        //setMissingTime(TIME_PER_ROUND);
        navigate("/game/" + (parseInt(currentRoundId) + 1))
    }

    const handleViewSummary = () => {
        // register
        props.setGame(false);
        navigate("/game-summary")
    }

    const handleLeave = () => {

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
                                    {missingTime}
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
                                        <Alert className="mb-0">{result[roundId-1] === true ? "You guessed! +5 points" :
                                            result[roundId-1] === false ? "You did not guess! 0 points gained" : "Time expired! 0 points gained"}</Alert>
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
                                <Col lg={4}>
                                {image}
                                    {currentRound && <MemeImg meme={rounds && rounds.map(r => r.name)} />}
                                    {image && <img src={image} />}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col lg={8}>
                        <Container fluid> 
                            {   
                                currentRound && <Captions captions={currentRound.captions} handleConfirm={handleConfirm}
                                    selected={selected} handleSelect={handleSelect} mode={mode} roundId={roundId} handleViewSummary={handleViewSummary}
                                    next={props.isLoggedIn ? roundId == 3 ? "gameResults" : "nextRound" : "newGame"} correctCaptions={captionsToShow} handleNextRound={handleNextRound}
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
                            <Button variant="primary" onClick={() => props.handleNextRound(props.roundId)}>
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
                <Col lg={6} className="d-flex justify-content-end">
                    <Button variant="danger" onClick={() => props.handleLeave()}>Leave game</Button>
                </Col>
            </Row>
            
        </>
    );
}

export default GameRoundComponent;