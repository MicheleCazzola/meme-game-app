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

    return(
        <>
            <Routes>
                <Route path="/" element={
                    <>
                        <HeaderComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                            <Container fluid>
                                <Row className="min-vh-100 main align-items-center justify-content-center">
                                    <Outlet />
                                </Row>
                        </Container>
                    </>
                }>
                    <Route index element={
                        <HomeComponent isLoggedIn={isLoggedIn} />
                    } />
                    <Route path="/login" element={
                        <LoginComponent setIsLoggedIn={setIsLoggedIn} />
                    } />
                    <Route path="/game/:roundId" element={
                        <GameRoundComponent />
                    } />
                    <Route path="/round-summary/:roundId" element={
                        <RoundSummaryComponent />
                    } />
                    <Route path="/game-summary" element={
                        <GameSummaryComponent />
                    } />
                    <Route path="*" element={ 
                        <NotFoundComponent /> 
                    } />

                </Route>
            </Routes>
        </>
    );
}

export default App
