import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, loggedOut }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      className="border-bottom border-warning shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning">
          🎬 RetroLens
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!storedUser && (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="text-light fw-medium mx-2 px-3 py-2 rounded hover-bg-warning"
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className="text-light fw-medium mx-2 px-3 py-2 rounded hover-bg-warning"
                >
                  Signup
                </Nav.Link>
              </>
            )}
            {storedUser && (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className="text-light fw-medium mx-2 px-3 py-2 rounded"
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/users"
                  className="text-light fw-medium mx-2 px-3 py-2 rounded"
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  onClick={loggedOut}
                  className="text-light fw-medium mx-2 px-3 py-2 rounded"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
