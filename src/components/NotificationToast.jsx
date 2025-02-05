import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const NotificationToast = ({ show, message, type, onClose }) => {
  return (
    <ToastContainer position="top-start" className="p-3">
      <Toast
        show={show}
        onClose={onClose}
        delay={3000}
        autohide
        bg={type}
        className="text-white"
      >
        <Toast.Header closeButton>
          <strong className="me-auto">
            {type === "success" ? "Success!" : "Error!"}
          </strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationToast;
