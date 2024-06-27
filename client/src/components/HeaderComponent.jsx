/* eslint-disable react/prop-types */
import {Button, Col, Navbar, Row} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { API } from "../API.mjs";
import "./HomeComponent.css"
import "./HeaderComponent.css"

function HeaderComponent(props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        API.logOut()
            .then(() => {
                props.setIsLoggedIn(false);
                props.setHistoryView(false);
                navigate("/");
            })
            .catch(err => console.log(err));
    }

    const handleGoHome = (event) => {
        if (props.game) {
            event.preventDefault();
        }
        else {
            props.setHistoryView(false);
        }
    }

    const handleLeave = () => {
        props.setHistoryView(false);
        navigate("/");
    }

    const handleHistory = () => {
        props.setHistoryView(true);
        navigate("/history");
    }

    return(
        <Navbar className="bg-primary navbar-dark" fixed="top">
            <Row className="w-100 px-2 py-1 align-items-center">
                <AppLogo game={props.game} handleGoHome={handleGoHome} />
                {
                    props.isLoggedIn && !props.game && 
                        <Actions historyView={props.historyView} handleLogout={handleLogout}
                            handleLeave={handleLeave} handleGoHome={handleGoHome} handleHistory={handleHistory} />
                }
            </Row>
        </Navbar>
    );
}

function AppLogo(props) {
    return (
        <Col className="col-6 d-flex">
            <NavLink to="/" id="home" className={props.game ? "not-active" : "active"} onClick={(event) => props.handleGoHome(event)}>
                <Navbar.Brand className="mx-1">
                    <i className="bi bi-emoji-grin"></i> What do you meme?
                </Navbar.Brand>
            </NavLink>
        </Col>
    )
}

function Actions(props) {
    return (
        <>
            <Col className="col-6 d-flex justify-content-end">
                {
                    props.historyView ?
                        <Button onClick={() => props.handleLeave()}>
                            Go home
                        </Button> :
                        <Button onClick={() => props.handleHistory()}>
                            My past games
                        </Button>
                }
                <Button onClick={() => props.handleLogout()}>
                    Logout
                </Button>
            </Col>
        </>
    )
}

export default HeaderComponent;