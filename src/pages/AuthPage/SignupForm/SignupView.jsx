import { useState, useEffect } from "react";
import { Button, Form, Spinner, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../../asyncThunk/userAsyncThunks";
import NotificationToast from "../../../common/NotificationToast";
import { clearStates } from "../../../slice/userSlice";
import "./SignupView.css";
// import imageBackground from "../../../images/background.jpg";

const SignupView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const { loading, error } = useSelector((state) => state.user);

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

      <div className="auth-container">
        {/* Background Image */}
        <div
          className="auth-background"
          style={{
            backgroundImage: `url('/images/background.jpg')`,
          }}
        />

        {/* Dark Overlay */}
        <div className="auth-overlay" />

        {/* Logo */}
        <div className="auth-logo">
          <h1>RetroLens</h1>
        </div>

        {/* Signup Form */}
        <div className="auth-form-container">
          <Card className="auth-form">
            <Card.Body>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">
                Join RetroLens to discover amazing historical movies
              </p>

              <Form onSubmit={signUpSubmit}>
                <div className="form-group">
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                  />
                  <Form.Label className="form-label">Username</Form.Label>
                </div>

                <div className="form-group">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                  />
                  <Form.Label className="form-label">Email Address</Form.Label>
                </div>

                <div className="form-group">
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                  />
                  <Form.Label className="form-label">Password</Form.Label>
                </div>

                <div className="form-group">
                  <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                    className="form-input date-input"
                    disabled={loading}
                  />
                  <Form.Label className="form-label date-label">
                    Date of Birth
                  </Form.Label>
                </div>

                <Button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <div className="signup-link">
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignupView;
