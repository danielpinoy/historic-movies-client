import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../asyncThunk/userAsyncThunks";

const ProfileEditModal = ({ show, onClose, token }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Birthday: "",
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (show && user) {
      let formattedBirthday = "";
      if (user.Birthday) {
        try {
          const date = new Date(user.Birthday);
          formattedBirthday = date.toISOString().split("T")[0];
        } catch (error) {
          formattedBirthday = "";
        }
      }

      setFormData({
        Username: user.Username || "",
        Email: user.Email || "",
        Birthday: formattedBirthday,
      });
    }
  }, [show, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form data:", formData);

    try {
      await dispatch(
        editUser({
          userData: user,
          updatedUserData: formData,
          token,
        })
      ).unwrap();

      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      if (err.response && err.response.data) {
        console.error("Server response:", err.response.data);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="text-white">
      <Modal.Header closeButton className="bg-dark border-warning">
        <Modal.Title className="text-warning">Edit Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark">
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              placeholder="Username"
              className="bg-secondary text-white border-warning"
              required
              minLength={3}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email"
              className="bg-secondary text-white border-warning"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="date"
              name="Birthday"
              value={formData.Birthday}
              onChange={handleChange}
              className="bg-secondary text-white border-warning"
              required
            />
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
          disabled={loading}
          className="text-dark"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileEditModal;
