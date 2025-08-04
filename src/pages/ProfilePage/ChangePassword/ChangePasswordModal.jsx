import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../asyncThunk/userAsyncThunks";
import { clearStates } from "../../../slice/userSlice";

const ChangePasswordModal = ({ show, onClose, showSuccess, showError }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // LOCAL error state for the modal
  const [localError, setLocalError] = useState("");

  // Clear form and errors when modal opens
  useEffect(() => {
    if (show) {
      dispatch(clearStates()); // Clear global errors
      setLocalError(""); // Clear local error
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordsMatch(true);
    }
  }, [show, dispatch]);

  const handleChange = (e) => {
    // Clear error when user starts typing
    if (localError) {
      setLocalError("");
    }

    const { name, value } = e.target;
    const newData = { ...passwordData, [name]: value };
    setPasswordData(newData);

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
      console.log("About to change password..."); // DEBUG
      await dispatch(
        changePassword({
          userData: user,
          passwordData,
        })
      ).unwrap();

      console.log("Password change successful, showing toast"); // DEBUG

      // Close modal first, then show success toast
      onClose();

      // Small delay to ensure modal closes before showing toast
      setTimeout(() => {
        showSuccess("Password changed successfully!");
      }, 100);
    } catch (err) {
      console.log("Password change failed, showing error toast:", err); // DEBUG

      // Set local error for modal display
      setLocalError(err || "Password change failed");

      // Show error toast (modal stays open)
      showError(err || "Password change failed");

      console.error("Password change failed:", err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="text-white">
      <Modal.Header closeButton className="bg-dark border-warning">
        <Modal.Title className="text-warning">Change Password</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark">
        {/* Show LOCAL error in the modal */}
        {localError && (
          <Alert variant="danger" className="mb-3">
            {localError}
          </Alert>
        )}

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
