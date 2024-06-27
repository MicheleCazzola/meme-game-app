import {Button, Col, Container, Row} from "react-bootstrap"
import { Link } from 'react-router-dom';

function HomeComponent(props) {

    return (
        <Row className="min-vh-100 main align-items-center justify-content-center">
            <Col lg={4} className='justify-content-center'>
                <Container fluid>
                    <Row as={"h2"} className='justify-content-center'>
                        <Col lg={12} className='mx-0'>
                            <Container fluid className='d-flex justify-content-center'>What do you meme?</Container>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        {
                            !props.isLoggedIn && 
                            <Col lg={8} className='px-0'>
                                <Container className='d-flex justify-content-between'>
                                    <Link to="/game"><Button variant="primary" className='mx-1'>Play as guest</Button></Link>
                                    <Link to="/login"><Button variant="primary" className='mx-0'>Login</Button></Link>
                                </Container>
                            </Col>
                        }
                        {
                            props.isLoggedIn &&
                            <Col lg={12} className='px-0'>
                                <Container className='d-flex justify-content-center'>
                                    <Link to="/game"><Button variant="primary" className='mx-1'>Play</Button></Link>
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