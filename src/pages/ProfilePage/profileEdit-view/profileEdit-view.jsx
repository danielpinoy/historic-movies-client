import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../asyncThunk/userAsyncThunks";
import { useNavigate } from "react-router-dom";

const ProfileEditView = ({ clickUpdate, token }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.user);

  const [updatedUserData, setUpdatedUserData] = useState(user);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    dispatch(editUser({ userData: user, updatedUserData, token }));
    clickUpdate(null);
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    clickUpdate(null);
  };

  const handleBackProfile = () => {
    clickUpdate(null);
  };

  return (
    <Card className="bg-dark text-white border-warning shadow-lg">
      {/* Header */}
      <Card.Header className="bg-warning text-dark text-center py-4 border-0">
        <h2 className="mb-1 fw-bold">✏️ Edit Profile</h2>
        <p className="mb-0 opacity-75">Update your account information</p>
      </Card.Header>

      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Error updating profile</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Username Field */}
          <Form.Group className="mb-4">
            <Form.Label className="text-warning fw-semibold">
              👤 Username
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-warning text-white">
                @
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="Username"
                value={updatedUserData.Username}
                onChange={handleChange}
                required
                minLength={3}
                className="bg-secondary border-warning text-white"
                placeholder="Enter your username"
              />
              <Form.Control.Feedback type="invalid">
                Username must be at least 3 characters long.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">
              Choose a unique username (minimum 3 characters)
            </Form.Text>
          </Form.Group>

          {/* Email Field */}
          <Form.Group className="mb-4">
            <Form.Label className="text-warning fw-semibold">
              📧 Email Address
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-warning text-white">
                ✉️
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="Email"
                value={updatedUserData.Email}
                onChange={handleChange}
                required
                className="bg-secondary border-warning text-white"
                placeholder="your.email@example.com"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Birthday Field */}
          <Form.Group className="mb-5">
            <Form.Label className="text-warning fw-semibold">
              🎂 Date of Birth
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-warning text-white">
                📅
              </InputGroup.Text>
              <Form.Control
                type="date"
                name="Birthday"
                value={updatedUserData.Birthday}
                onChange={handleChange}
                required
                className="bg-secondary border-warning text-white"
              />
              <Form.Control.Feedback type="invalid">
                Please select your date of birth.
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
                disabled={loading}
              >
                {loading ? "Updating..." : "💾 Save Changes"}
              </Button>
            </Col>
            <Col md={6}>
              <Button
                type="button"
                variant="outline-info"
                size="lg"
                className="w-100 fw-semibold"
                onClick={handleChangePassword}
              >
                🔒 Change Password
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                type="button"
                variant="outline-light"
                size="lg"
                className="w-100 fw-semibold"
                onClick={handleBackProfile}
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

export default ProfileEditView;
