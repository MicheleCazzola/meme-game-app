import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css'
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import LoginComponent from './components/LoginComponent';
import GameRoundComponent from './components/GameRoundComponent';
import GameSummaryComponent from './components/GameSummaryComponent';
import NotFoundComponent from './components/NotFoundComponent';
import HistoryComponent from './components/HistoryComponent';
import { API } from './API.mjs';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [game, setGame] = useState(false);
    const [historyView, setHistoryView] = useState(false);
    const [gameResult, setGameResult] = useState();
    const [waiting, setWaiting] = useState(true);
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        API.getUserInfo()
            .then(result => {
                setIsLoggedIn(true);
                setUser(result);
                setWaiting(false);
            })
            .catch(err => {
                setIsLoggedIn(false);
                setUser(undefined);
                console.log(err);
            })
            .finally(() => {
                setWaiting(false);
            })
    }, []);

    return(
        <>
            <Routes>
                <Route path="/" element={!waiting &&
                    <>
                        <HeaderComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} game={game}
                            historyView={historyView} setHistoryView={setHistoryView} />
                        <Container fluid>
                                    <Outlet />
                        </Container>
                    </>
                }>
                    <Route index element={
                        <HomeComponent isLoggedIn={isLoggedIn} />
                    } />
                    <Route path="/login" element={
                        <LoginComponent setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
                    } />
                    <Route path="/game" element={
                        <GameRoundComponent isLoggedIn={isLoggedIn} game={game} setGame={setGame} setGameResult={setGameResult} />
                    } />
                    <Route path="/game-summary" element={
                        <GameSummaryComponent gameResult={gameResult} />
                    } />
                    <Route path="/history" element={
                        <HistoryComponent user={user} />
                    }></Route>
                    <Route path="*" element={ 
                        <NotFoundComponent /> 
                    } />

                </Route>
            </Routes>
        </>
    );
}

export default App
