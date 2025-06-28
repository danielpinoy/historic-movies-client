import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navigation-bar.css"; // Import the CSS file

export const StickyNavigationBar = ({ user, loggedOut }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8;
      const shouldStick = window.scrollY > heroHeight;
      setIsSticky(shouldStick);

      // Add/remove class to body for padding adjustment
      if (shouldStick) {
        document.body.classList.add("navbar-is-sticky");
      } else {
        document.body.classList.remove("navbar-is-sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("navbar-is-sticky");
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`retro-navbar ${isSticky ? "navbar-sticky" : ""}`}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand-logo">
          <span className="brand-icon">🎬</span>
          <span className="brand-text">RetroLens</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="sticky-navbar-nav"
          className="navbar-toggler-custom"
        />

        <Navbar.Collapse id="sticky-navbar-nav">
          <Nav className="ms-auto">
            {!storedUser ? (
              <>
                <Nav.Link as={Link} to="/login" className="btn-login">
                  LOGIN
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="btn-signup">
                  SIGNUP
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-underline">
                  HOME
                </Nav.Link>
                <Nav.Link as={Link} to="/movies" className="nav-link-underline">
                  MOVIES
                </Nav.Link>
                <Nav.Link as={Link} to="/users" className="nav-link-underline">
                  PROFILE
                </Nav.Link>
                <Nav.Link
                  onClick={loggedOut}
                  className="nav-link-underline nav-link-logout"
                  style={{ cursor: "pointer" }}
                >
                  LOGOUT
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
