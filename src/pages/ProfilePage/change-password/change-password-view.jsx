import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../asyncThunk/userAsyncThunks";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

const ChangePasswordView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user, loading, error } = useSelector((state) => state.user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      dispatch(changePassword({ userData: user, passwordData }));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/");
    } else {
      alert("New password and confirm password do not match.");
    }
  };

  return (
    <Form>
      <Form.Group controlId="currentPassword">
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
        />
      </Form.Group>
      <Form.Group controlId="newPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />
      </Form.Group>
      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        variant="primary"
        onClick={handlePasswordSubmit}
        className="me-2 mt-2"
      >
        Change Password
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          navigate("/users");
        }}
        className="mt-2"
      >
        Back
      </Button>
    </Form>
  );
};

export default ChangePasswordView;
