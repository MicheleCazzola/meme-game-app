import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Button, Col, Container, Row} from "react-bootstrap"
import { useNavigate } from 'react-router-dom';

function HomeComponent(props) {

    const navigate = useNavigate();

    const playMessage = props.isLoggedIn ? "Play" : "Play as guest";

    const handlePlay = () => {

    }

    return (
        <Col lg={4} className='justify-content-center'>
            <Container fluid>
                <Row as={"h2"} className='justify-content-center'>
                    <Col lg={8} className='mx-0'>What do you meme?</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col lg={3} className='px-0'>
                        <Button variant="primary" className='mx-0' onClick={() => handlePlay()}>{playMessage}</Button>
                    </Col>
                </Row>
            </Container>
            
        </Col>
    )
}

export {HomeComponent};