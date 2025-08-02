import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Spinner, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../asyncThunk/userAsyncThunks";
import { Link } from "react-router-dom";
import NotificationToast from "../../../common/NotificationToast";
import { clearStates } from "../../../slice/userSlice";
import "./login-view.css";

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

      <div className="auth-container">
        {/* Background Image */}
        <div
          className="auth-background"
          style={{
            backgroundImage: `url('https://via.placeholder.com/1920x1080/1a1a1a/666666?text=Historical+Movie+Background')`,
          }}
        />

        {/* Dark Overlay */}
        <div className="auth-overlay" />

        {/* Logo */}
        <div className="auth-logo">
          <h1>RetroLens</h1>
        </div>

        {/* Login Form */}
        <div className="auth-form-container">
          <Card className="auth-form">
            <Card.Body>
              <h2 className="auth-title">Sign In</h2>

              <Form onSubmit={login}>
                <div className="form-group">
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-input"
                    placeholder=" "
                    disabled={loading}
                  />
                  <Form.Label className="form-label">Username</Form.Label>
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

                <Button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>

              <div className="signup-link">
                New to RetroLens?{" "}
                <Link to="/signup" className="auth-link">
                  Sign up now
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginView;
