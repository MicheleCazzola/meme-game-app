import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom';
import {HeaderComponent} from './components/HeaderComponent';
import { HomeComponent } from './components/HomeComponent';
import { Container, Row } from 'react-bootstrap';

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
                    }></Route>

                </Route>
            </Routes>
        </>
    );
}

export default App
