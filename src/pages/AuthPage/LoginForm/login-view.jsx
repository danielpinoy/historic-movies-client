import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Spinner, Alert, Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../asyncThunk/userAsyncThunks";
import loginImage from "../../../assets/Logo_RetroLens.png";
import NotificationToast from "../../../common/NotificationToast";
import { clearStates } from "../../../slice/userSlice";
const LoginView = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loginAttempted, setLoginAttempted] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { user, loading, error } = useSelector((state) => state.user);
  const login = (event) => {
    event.preventDefault();
    setLoginAttempted(true);
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    console.log("User state:", user);
    console.log("Error state:", error);

    if (error) {
      // console.log("Showing error toast");
      setToastMessage(error);
      setToastType("danger");
      setShowToast(true);
    } else if (user && loginAttempted) {
      // console.log("Showing success toast");
      setToastMessage("Login successful! Welcome back!");
      setToastType("success");
      setShowToast(true);
    }
    // bug fix: notification doesn't repeat appear after clicking link
    dispatch(clearStates());
    // Reset loginAttempted when component unmounts or when navigating away
    return () => setLoginAttempted(false);
  }, [user, error]);

  return (
    <>
      <NotificationToast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={login}>
            <Form.Group className="mt-3">
              <Form.Label>
                <h3>Log In</h3>
              </Form.Label>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                className="mb-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* {error && <Alert variant="danger">{error}</Alert>} */}

            {loading ? (
              <Spinner animation="border" variant="primary" size="sm" />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </Form>
        </Col>
        <Col md={6}>
          <Image src={loginImage} fluid />
        </Col>
      </Row>
    </>
  );
};

export default LoginView;
