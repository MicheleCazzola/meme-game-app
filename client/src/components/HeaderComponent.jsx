import {Button, Col, Navbar, Row} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./HomeComponent.css"
import API from "../API.mjs";

function HeaderComponent(props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        API.logOut()
            .then(() => {
                props.setIsLoggedIn(false);
                navigate("/");
            })
            .catch(err => console.log(err));
    }

    const handleHistory = () => {

    }

    return(
        <Navbar className="bg-primary navbar-dark" fixed="top">
            <Row className="w-100 px-2 py-1 align-content-center">
                <Col className="col-6 d-flex">
                    <Link to="/" id="home">
                        <Navbar.Brand className="mx-1">
                            <i className="bi bi-emoji-grin"></i> What do you meme?
                        </Navbar.Brand>
                    </Link>
                </Col>
                {
                    props.isLoggedIn && !props.game &&
                    <>
                        <Col className="col-6 d-flex justify-content-end">
                            <Button onClick={() => handleHistory()}>
                                My past games
                            </Button>
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