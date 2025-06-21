import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, loggedOut }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <Navbar expand="lg" className="navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          RetroLens
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {" "}
            {/* Push nav items to the right */}
            {!storedUser && (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="nav-link">
                  Signup
                </Nav.Link>
              </>
            )}
            {storedUser && (
              <>
                <Nav.Link as={Link} to="/" className="nav-link">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/users" className="nav-link">
                  Profile
                </Nav.Link>
                <Nav.Link
                  onClick={loggedOut}
                  className="nav-link"
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
