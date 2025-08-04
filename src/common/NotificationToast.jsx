import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const NotificationToast = ({ show, message, type, onClose }) => {
  const getToastConfig = (type) => {
    const configs = {
      success: {
        bg: "success",
        icon: "✅",
        title: "Success!",
        textColor: "white",
      },
      danger: {
        bg: "danger",
        icon: "❌",
        title: "Problem!",
        textColor: "white",
      },
      warning: {
        bg: "warning",
        icon: "⚠️",
        title: "Warning!",
        textColor: "dark",
      },
      info: {
        bg: "info",
        icon: "ℹ️",
        title: "Info",
        textColor: "white",
      },
    };
    return configs[type] || configs.info;
  };

  const config = getToastConfig(type);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={show}
        onClose={onClose}
        delay={4000}
        autohide
        bg={config.bg}
        className={`text-${config.textColor} border-0 shadow-lg`}
      >
        <Toast.Header
          closeButton
          className={`bg-${config.bg} text-${config.textColor} border-0`}
        >
          <span className="me-2" style={{ fontSize: "1.2em" }}>
            {config.icon}
          </span>
          <strong className="me-auto fw-bold">{config.title}</strong>
        </Toast.Header>
        <Toast.Body className={`text-${config.textColor} fw-medium`}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationToast;
