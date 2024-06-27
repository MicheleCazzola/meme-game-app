import {Button, Col, Navbar, Row} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./HomeComponent.css"
import {API} from "../API.mjs";

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
                <Col className="col-6 d-flex">
                    <NavLink to="/" id="home" style={props.game ? {cursor: "default"} : {cursor: "pointer"}} onClick={handleGoHome}>
                        <Navbar.Brand className="mx-1">
                            <i className="bi bi-emoji-grin"></i> What do you meme?
                        </Navbar.Brand>
                    </NavLink>
                </Col>
                {
                    props.isLoggedIn && !props.game &&
                    <>
                        <Col className="col-6 d-flex justify-content-end">
                            {
                                props.historyView ?
                                    <Button onClick={() => handleLeave()}>
                                        Go home
                                    </Button> :
                                    <Button onClick={() => handleHistory()}>
                                        My past games
                                    </Button>
                            }
                            <Button onClick={() => handleLogout()}>
                                Logout
                            </Button>
                        </Col>
                    </>
                }
            </Row>
        </Navbar>
    );
}

export default HeaderComponent;