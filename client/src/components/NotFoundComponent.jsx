import { Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function NotFoundComponent() {
    const location = useLocation();
    const nextPage = location.state ? location.state.nextPage || "/" : "/";
    return (
        <Container fluid>
            <Row as={"h2"} className="py-5">
                Oops...something went wrong
            </Row>
            <Row className="d-flex align-content-end" style={{textAlign: "end"}}>
                <Link to={nextPage}>
                    Go back to previous page
                </Link>
            </Row>
        </Container>
    );
}

export default NotFoundComponent;