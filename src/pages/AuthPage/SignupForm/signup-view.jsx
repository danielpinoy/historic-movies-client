import { useState, useEffect } from "react";
import { Button, Form, Spinner, Card, Alert, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../../asyncThunk/userAsyncThunks";
import NotificationToast from "../../../common/NotificationToast";
import { clearStates } from "../../../slice/userSlice";

const SignupView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const { loading, error } = useSelector((state) => state.user);

  // Watch for errors
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("danger");
      setShowToast(true);
    }
    dispatch(clearStates());
  }, [error, dispatch]);

  const signUpSubmit = async (event) => {
    event.preventDefault();

    try {
      const resultAction = await dispatch(
        signupUser({
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday,
        })
      );

      if (signupUser.fulfilled.match(resultAction)) {
        // Show success message
        setToastMessage("Registration successful! Please log in.");
        setToastType("success");
        setShowToast(true);

        // Reset form
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");

        // Delay navigation to allow toast to be seen
        setTimeout(() => {
          dispatch(clearStates());
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setToastMessage("Registration failed. Please try again.");
      setToastType("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <NotificationToast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      <Row className="justify-content-center align-items-center min-vh-100">
        <Col lg={6} xl={5}>
          <Card className="bg-dark text-white border-warning shadow-lg">
            {/* Header */}
            <Card.Header className="bg-warning text-dark text-center py-4 border-0">
              <h2 className="mb-1 fw-bold">🎬 Join RetroLens</h2>
              <p className="mb-0 opacity-75">
                Create your account to get started
              </p>
            </Card.Header>

            <Card.Body className="p-5">
              <Form onSubmit={signUpSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-warning fw-semibold">
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                    disabled={loading}
                    className="bg-secondary border-warning text-white"
                  />
                  <Form.Text className="text-muted">
                    Minimum 3 characters, letters and numbers only
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-warning fw-semibold">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-secondary border-warning text-white"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-warning fw-semibold">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-secondary border-warning text-white"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-warning fw-semibold">
                    Date of Birth
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-secondary border-warning text-white"
                  />
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  variant="warning"
                  className="w-100 fw-semibold text-dark"
                  size="lg"
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-light mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-warning text-decoration-none fw-semibold"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SignupView;
