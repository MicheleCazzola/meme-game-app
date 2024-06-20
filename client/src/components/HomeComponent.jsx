import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Button, Col, Container, Row} from "react-bootstrap"
import { Link, useNavigate } from 'react-router-dom';

function HomeComponent(props) {

    const navigate = useNavigate();

    const handlePlay = () => {

    }

    return (
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
                                <Button variant="primary" className='mx-1' onClick={() => handlePlay()}>Play as guest</Button>
                                <Link to="/login"><Button variant="primary" className='mx-0'>Login</Button></Link>
                            </Container>
                        </Col>
                    }
                    {
                        props.isLoggedIn &&
                        <Col lg={3} className='px-0'>
                            <Container className='d-flex justify-content-center'>
                                <Button variant="primary" className='mx-1' onClick={() => handlePlay()}>Play</Button>
                            </Container>
                        </Col>
                    }
                </Row>
            </Container>
        </Col>
    )
}

export default HomeComponent;