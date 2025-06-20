import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../asyncThunk/userAsyncThunks";
import NotificationToast from "../../NotificationToast";
import { clearStates } from "../../../slice/userSlice";

const SignupView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // Add toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const { loading, error } = useSelector((state) => state.user);

  // Watch for errors
  useEffect(() => {
    if (error) {
      console.log(error);
      setToastMessage(error);
      setToastType("danger");
      setShowToast(true);
    }
    // bug fix: notification doesn't repeat appear after clicking link
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
          dispatch(clearStates()); // Clear states before navigating
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
      <Form onSubmit={signUpSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="ExampleName123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="ExampleName123@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-100"
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
    </>
  );
};

export default SignupView;
