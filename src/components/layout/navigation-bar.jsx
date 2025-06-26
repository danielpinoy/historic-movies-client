import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const StickyNavigationBar = ({ user, loggedOut }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust this value based on your hero section height
      const heroHeight = window.innerHeight * 0.8; // Assuming hero is 80vh
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar ${isSticky ? "navbar-sticky" : ""}`}
      style={{
        backgroundColor: "#2c3e50", // Dark blue-gray background
        borderBottom: "1px solid #34495e",
        transition: "all 0.3s ease",
        zIndex: 1020,
        padding: "0.75rem 0",
      }}
    >
      <Container>
        {/* Logo/Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand-custom"
          style={{
            color: "#f39c12", // Golden/orange color
            fontSize: "1.5rem",
            fontWeight: "700",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🎬 RetroLens
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: "#f39c12",
            color: "#f39c12",
          }}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!storedUser && (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="nav-link-custom"
                  style={{
                    color: "#ecf0f1",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    padding: "0.5rem 1.5rem",
                    margin: "0 0.25rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#f39c12";
                    e.target.style.backgroundColor = "rgba(243, 156, 18, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ecf0f1";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  LOGIN
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className="nav-link-custom"
                  style={{
                    color: "#ecf0f1",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    padding: "0.5rem 1.5rem",
                    margin: "0 0.25rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#f39c12";
                    e.target.style.backgroundColor = "rgba(243, 156, 18, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ecf0f1";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  SIGNUP
                </Nav.Link>
              </>
            )}
            {storedUser && (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className="nav-link-custom"
                  style={{
                    color: "#ecf0f1",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    padding: "0.5rem 1.5rem",
                    margin: "0 0.25rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#f39c12";
                    e.target.style.backgroundColor = "rgba(243, 156, 18, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ecf0f1";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  HOME
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/movies"
                  className="nav-link-custom"
                  style={{
                    color: "#ecf0f1",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    padding: "0.5rem 1.5rem",
                    margin: "0 0.25rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#f39c12";
                    e.target.style.backgroundColor = "rgba(243, 156, 18, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ecf0f1";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  MOVIES
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/users"
                  className="nav-link-custom"
                  style={{
                    color: "#ecf0f1",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    padding: "0.5rem 1.5rem",
                    margin: "0 0.25rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#f39c12";
                    e.target.style.backgroundColor = "rgba(243, 156, 18, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ecf0f1";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  PROFILE
                </Nav.Link>
                <Nav.Link
                  onClick={loggedOut}
                  className="nav-link-custom"
                  style={{
                    color: "#ecf0f1",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    padding: "0.5rem 1.5rem",
                    margin: "0 0.25rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#e74c3c";
                    e.target.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ecf0f1";
                    e.target.style.backgroundColor = "transparent";
                  }}
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
