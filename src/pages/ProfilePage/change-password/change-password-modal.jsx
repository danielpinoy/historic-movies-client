import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../asyncThunk/userAsyncThunks";

const ChangePasswordModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (show) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordsMatch(true);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...passwordData, [name]: value };
    setPasswordData(newData);

    // Check if passwords match when typing in confirm password or new password
    if (name === "confirmPassword" || name === "newPassword") {
      setPasswordsMatch(
        newData.newPassword === newData.confirmPassword ||
          newData.confirmPassword === ""
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      await dispatch(
        changePassword({
          userData: user,
          passwordData,
        })
      ).unwrap();

      onClose();
    } catch (err) {
      console.error("Password change failed:", err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="text-white">
      <Modal.Header closeButton className="bg-dark border-warning">
        <Modal.Title className="text-warning">Change Password</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark">
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="bg-secondary text-white border-warning"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="bg-secondary text-white border-warning"
              required
              minLength={6}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className={`bg-secondary text-white border-warning ${
                !passwordsMatch ? "border-danger" : ""
              }`}
              required
            />
            {!passwordsMatch && (
              <div className="text-danger mt-1 small">
                Passwords do not match
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-dark border-warning">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="warning"
          onClick={handleSubmit}
          disabled={loading || !passwordsMatch}
          className="text-dark"
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
