import { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/src/collapse.js"
import './App.css'
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import LoginComponent from './components/LoginComponent';
import GameRoundComponent from './components/GameRoundComponent';
import GameSummaryComponent from './components/GameSummaryComponent';
import NotFoundComponent from './components/NotFoundComponent';
import HistoryComponent from './components/HistoryComponent';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [game, setGame] = useState(false);
    const [historyView, setHistoryView] = useState(false);
    const [gameResult, setGameResult] = useState();

    return(
        <>
            <Routes>
                <Route path="/" element={
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
                        <LoginComponent setIsLoggedIn={setIsLoggedIn} />
                    } />
                    <Route path="/game" element={
                        <GameRoundComponent isLoggedIn={isLoggedIn} game={game} setGame={setGame} setGameResult={setGameResult} />
                    } />
                    <Route path="/game-summary" element={
                        <GameSummaryComponent gameResult={gameResult} />
                    } />
                    <Route path="/history" element={
                        <HistoryComponent />
                    }></Route>
                    {<Route path="*" element={ 
                        <NotFoundComponent /> 
                    } />}

                </Route>
            </Routes>
        </>
    );
}

export default App
