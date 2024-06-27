import { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Row, Table } from "react-bootstrap";
import dayjs from "dayjs";
import { API, SERVER_URL } from "../API.mjs";
import "./HistoryComponent.css"
import { Link } from "react-router-dom";


function HistoryComponent(props) {

    const [user, setUser] = useState(undefined);
    const [history, setHistory] = useState([]);

    let ignore = false;
    useEffect(() => {
        if(!ignore) {
            ignore = true;
            API.getHistory()
                .then(historyResult => {
                    API.getUserInfo()
                        .then(userResult => {
                            setHistory(historyResult);
                            setUser(userResult);
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err));
        }
    }, []);

    return (
        <Row className="d-flex justify-content-center main min-vh-100">
            <Col lg={3} className="bg-light">
                <UserInfo username={user && user.username} history={history} ></UserInfo>
            </Col>
            <Col lg={9}>
                <GameHistory history={history} ></GameHistory>
            </Col>
        </Row>
    );
}

function UserInfo(props) {
    const numGames = props.history && props.history.length;
    const guessRate = props.history && numGames > 0 && 
        100 * props.history
            .map(game => game.rounds
                .map(round => round.points)
                .reduce((a, b) => a + b))
    //console.log(props.history  && 
      //  props.history.map(game => game.rounds.map(round => round.points).reduce((a, b) => a+b)).reduce((a, b) => a + b));
        .reduce((a, b) => a + b) / (15 * numGames);

    return (
        <Container fluid className="d-flex flex-wrap h-100 align-items-center user-info">
            <Row className="w-100">
                <Col lg={3} className="user-info">
                    <div>{`@${props.username}`}</div>
                    <div>
                        <strong>Games played: </strong>{numGames}
                    </div>
                    {
                        numGames > 0 && 
                        <div>
                            <strong>Meme guessing rate: </strong>{guessRate.toFixed(2)} %
                        </div>
                    }
                </Col>
            </Row>
        </Container>
    );
}

function GameHistory(props) {
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center py-2">
                <Col as={"h2"}>Games history</Col>
            </Row>
            <Row className="d-flex justify-content-center">
                <Col>
                    {
                        props.history && props.history.length > 0 ? 
                            <PastGamesList history={props.history} /> : 
                            <h4>Still no games played</h4>
                    }
                </Col>
            </Row>
        </Container>
    )
}

function PastGamesList(props) {
    const history = props.history.toSorted((a,b) => dayjs(b.date).diff(dayjs(a.date)));
    return (
        <>
            <Table striped>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Round 1</th>
                        <th>Round 2</th>
                        <th>Round 3</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(game => <PastGame key={game.matchId} date={game.date} points={game.points} rounds={game.rounds} />)}
                </tbody>
            </Table>
        </>
    )
}

function PastGame(props) {

    return (
        <tr>
            <td className="game-info">
                <Container fluid>
                    <Row>
                        <Col>
                            <strong>Date: </strong>{dayjs(props.date).format("YYYY, MMMM DD")}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong>Points: </strong>{`${props.points}`}
                        </Col>
                    </Row>
                </Container>
            </td>
            {props.rounds.map(round => <RoundResult key={round.roundId} meme={round.meme} points={round.points} /> )} 
        </tr>
    )
}

function RoundResult(props) {
    return (
        <td>
            <Card className="my-0 mx-0">
                <Card.Body className={`px-1 py-1 ${props.points === 5 ? "guessed" : "not-guessed"}`}>
                    <Card.Img className={`meme`} src={`${SERVER_URL}/${props.meme}`} />
                    <Card.Text className="py-1">
                        <strong>Points: </strong>{`${props.points}`}
                    </Card.Text>
                </Card.Body>
            </Card>
        </td>
    )
}

export default HistoryComponent;