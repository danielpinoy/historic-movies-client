import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Spinner, Row, Col, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../asyncThunk/userAsyncThunks";
import loginImage from "../../../assets/Logo_RetroLens.png";
import NotificationToast from "../../../common/NotificationToast";
import { clearStates } from "../../../slice/userSlice";

const LoginView = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loginAttempted, setLoginAttempted] = useState(false);

  const { user, loading, error } = useSelector((state) => state.user);

  const login = (event) => {
    event.preventDefault();
    setLoginAttempted(true);
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("danger");
      setShowToast(true);
    } else if (user && loginAttempted) {
      setToastMessage("Login successful! Welcome back!");
      setToastType("success");
      setShowToast(true);
    }
    dispatch(clearStates());
    return () => setLoginAttempted(false);
  }, [user, error, loginAttempted, dispatch]);

  return (
    <>
      <NotificationToast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      <Row className="justify-content-center align-items-center min-vh-100">
        <Col lg={10} xl={8}>
          <Card className="bg-dark text-white border-warning shadow-lg overflow-hidden">
            <Row className="g-0">
              {/* Login Form */}
              <Col md={6}>
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="text-warning fw-bold mb-2">
                      🎬 Welcome Back
                    </h2>
                    <p className="text-light mb-4">
                      Sign in to continue to RetroLens
                    </p>
                  </div>

                  <Form onSubmit={login}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-warning fw-semibold">
                        Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-secondary border-warning text-white"
                        placeholder="Enter your username"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="text-warning fw-semibold">
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-secondary border-warning text-white"
                        placeholder="Enter your password"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="warning"
                      size="lg"
                      className="w-100 fw-semibold text-dark"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <p className="text-light mb-0">
                      Don't have an account?{" "}
                      <a
                        href="/signup"
                        className="text-warning text-decoration-none fw-semibold"
                      >
                        Sign up here
                      </a>
                    </p>
                  </div>
                </Card.Body>
              </Col>

              {/* Image Side */}
              <Col md={6} className="d-none d-md-block">
                <div className="h-100 d-flex align-items-center justify-content-center bg-warning bg-opacity-10">
                  <Image
                    src={loginImage}
                    alt="RetroLens Logo"
                    className="img-fluid p-4"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoginView;
