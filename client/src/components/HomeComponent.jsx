import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Button, Col, Container, Row} from "react-bootstrap"
import { Link, useNavigate } from 'react-router-dom';

function HomeComponent(props) {

    const navigate = useNavigate();

    const handlePlay = () => {

    }

    return (
        <Row className="min-vh-100 main align-items-center justify-content-center">
            <Col lg={4} className='justify-content-center'>
                <Container fluid>
                    <Row as={"h2"} className='justify-content-center'>
                        <Col lg={8} className='mx-0'>What do you meme?</Col>
                    </Row>
                    <Row className='justify-content-center'>
                        {
                            !props.isLoggedIn && 
                            <Col lg={6} className='px-0'>
                                <Container className='d-flex justify-content-between'>
                                    <Link to="/game/1"><Button variant="primary" className='mx-1'>Play as guest</Button></Link>
                                    <Link to="/login"><Button variant="primary" className='mx-0'>Login</Button></Link>
                                </Container>
                            </Col>
                        }
                        {
                            props.isLoggedIn &&
                            <Col lg={3} className='px-0'>
                                <Container className='d-flex justify-content-center'>
                                    <Link to="/game/1"><Button variant="primary" className='mx-1'>Play</Button></Link>
                                </Container>
                            </Col>
                        }
                    </Row>
                </Container>
            </Col>
        </Row>
    )
}

export default HomeComponent;