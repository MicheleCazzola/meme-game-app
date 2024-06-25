import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import { Container, Row } from 'react-bootstrap';
import LoginComponent from './components/LoginComponent';
import GameRoundComponent from './components/GameRoundComponent';
import RoundSummaryComponent from './components/RoundSummaryComponent';
import GameSummaryComponent from './components/GameSummaryComponent';
import NotFoundComponent from './components/NotFoundComponent';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [game, setGame] = useState(false);
    const [gameResult, setGameResult] = useState();

    return(
        <>
            <Routes>
                <Route path="/" element={
                    <>
                        <HeaderComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} game={game} />
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
                    {/*<Route path="/round-summary/:roundId" element={
                        <RoundSummaryComponent  />
                    } />*/}
                    <Route path="/game-summary" element={
                        <GameSummaryComponent gameResult={gameResult} />
                    } />
                    {/*<Route path="*" element={ 
                        <NotFoundComponent /> 
                    } />*/}

                </Route>
            </Routes>
        </>
    );
}

export default App
