import {Button, Col, Form, InputGroup, Navbar, Row} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function HeaderComponent(props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        API.logOut()
            .then(() => {
                props.setIsLoggedIn(false);
                navigate("/login");
            })
            .catch(err => console.log(err));
    }

    const handleHistory = () => {

    }

    return(
        <Navbar className="bg-primary navbar-dark" fixed="top">
            <Row className="w-100 px-2 py-1">
                <Col className="col-6 col-md-4 d-flex">
                    <Link to="/">
                        <Navbar.Brand className="mx-1">
                            <i className="bi bi-emoji-grin"></i> What do you meme?
                        </Navbar.Brand>
                    </Link>
                </Col>
                {
                    props.isLoggedIn && 
                    <>
                        <Col className="col-3 col-md-8 d-flex justify-content-end">
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

export {HeaderComponent};