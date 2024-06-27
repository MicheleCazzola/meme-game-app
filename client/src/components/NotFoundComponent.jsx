import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NotFoundComponent.css"

function NotFoundComponent() {
    return (
        <Container fluid>
            <Row as={"h2"} className="main">
                Oops...something went wrong
            </Row>
            <Row className="d-flex py-3" id="end-link">
                <Link to="/">
                    Go home
                </Link>
            </Row>
        </Container>
    );
}

export default NotFoundComponent;