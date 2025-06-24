import React, { useState } from "react";
import {
  Button,
  Form,
  Card,
  Alert,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../asyncThunk/userAsyncThunks";
import { useNavigate } from "react-router-dom";

const ChangePasswordView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validated, setValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const newPasswordData = { ...passwordData, [name]: value };
    setPasswordData(newPasswordData);

    // Check if passwords match when typing in confirm password
    if (name === "confirmPassword" || name === "newPassword") {
      setPasswordsMatch(
        newPasswordData.newPassword === newPasswordData.confirmPassword ||
          newPasswordData.confirmPassword === ""
      );
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || !passwordsMatch) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (passwordData.newPassword === passwordData.confirmPassword) {
      dispatch(changePassword({ userData: user, passwordData }));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/users");
    } else {
      setPasswordsMatch(false);
      setValidated(true);
    }
  };

  return (
    <Card className="bg-dark text-white border-warning shadow-lg">
      {/* Header */}
      <Card.Header className="bg-warning text-dark text-center py-4 border-0">
        <h2 className="mb-1 fw-bold">🔒 Change Password</h2>
        <p className="mb-0 opacity-75">Update your account security</p>
      </Card.Header>

      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Password Change Failed</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        <Alert variant="info" className="mb-4">
          <h6 className="alert-heading">📋 Password Requirements</h6>
          <ul className="mb-0 ps-3">
            <li>Use a strong, unique password</li>
            <li>Don't reuse your current password</li>
            <li>Consider using a password manager</li>
          </ul>
        </Alert>

        <Form noValidate validated={validated} onSubmit={handlePasswordSubmit}>
          {/* Current Password */}
          <Form.Group className="mb-4">
            <Form.Label className="text-warning fw-semibold">
              🔑 Current Password
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-warning text-white">
                🔒
              </InputGroup.Text>
              <Form.Control
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="bg-secondary border-warning text-white"
                placeholder="Enter your current password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("current")}
                className="border-warning text-white"
              >
                {showPasswords.current ? "👁️" : "👁️‍🗨️"}
              </Button>
              <Form.Control.Feedback type="invalid">
                Please enter your current password.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* New Password */}
          <Form.Group className="mb-4">
            <Form.Label className="text-warning fw-semibold">
              🆕 New Password
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-warning text-white">
                🔐
              </InputGroup.Text>
              <Form.Control
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="bg-secondary border-warning text-white"
                placeholder="Enter your new password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("new")}
                className="border-warning text-white"
              >
                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
              </Button>
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters long.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Confirm New Password */}
          <Form.Group className="mb-5">
            <Form.Label className="text-warning fw-semibold">
              ✅ Confirm New Password
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-warning text-white">
                🔐
              </InputGroup.Text>
              <Form.Control
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className={`bg-secondary border-warning text-white ${
                  !passwordsMatch ? "is-invalid" : ""
                }`}
                placeholder="Confirm your new password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePasswordVisibility("confirm")}
                className="border-warning text-white"
              >
                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
              </Button>
              <Form.Control.Feedback type="invalid">
                {!passwordsMatch
                  ? "Passwords do not match."
                  : "Please confirm your new password."}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Action Buttons */}
          <Row className="g-3">
            <Col md={6}>
              <Button
                type="submit"
                variant="warning"
                size="lg"
                className="w-100 fw-semibold text-dark"
                disabled={loading || !passwordsMatch}
              >
                {loading ? "Changing..." : "🔐 Change Password"}
              </Button>
            </Col>
            <Col md={6}>
              <Button
                type="button"
                variant="outline-light"
                size="lg"
                className="w-100 fw-semibold"
                onClick={() => navigate("/users")}
              >
                ← Back to Profile
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangePasswordView;
