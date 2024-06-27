import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { API } from "../API.mjs";
import { Link, useNavigate } from "react-router-dom";

function LoginComponent(props) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const handleLogin = (event) => {
        event.preventDefault();

        API.logIn({username, password})
            .then(result => {
                props.setIsLoggedIn(true);
                props.setUser(result);
                setLoginFailed(false);
                navigate("/");
            })
            .catch(() => setLoginFailed(true));
    }

    const reset = () => {
        setUsername("");
        setPassword("");
        setLoginFailed(false);
    }

    return (
        <Row className="min-vh-100 main align-items-center justify-content-center">
            <Col lg={4}>
                <Row as={"h3"} className="mx-0">Log in to your account</Row>
                <Form onSubmit={(event) => handleLogin(event)} className="mx-0 my-2">
                    <Form.Group className='mb-3'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={username}
                            onChange={(event) => { setUsername(event.target.value);}}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            value={password}
                            onChange={(event) => { setPassword(event.target.value);}}>
                        </Form.Control>
                    </Form.Group>
                    <Container className="d-flex px-0">
                        <Button variant='success' type='Submit'>Login</Button>
                        <Button variant='danger' className="mx-1" onClick={() => reset()}>Reset</Button>
                    </Container> 
                    {loginFailed && <Alert variant="danger" className="my-1">Incorrect username and/or password</Alert>}
                </Form>
                <Container className="d-flex justify-content-end px-0"><Link to="/">Go back</Link></Container>        
            </Col>
        </Row>
    )
}

export default LoginComponent;