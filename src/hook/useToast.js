import { useState } from "react";

export const useToast = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const showToast = (message, type = "success") => {
    setMessage(message);
    setType(type);
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  const showSuccess = (msg) => showToast(msg, "success");
  const showError = (msg) => showToast(msg, "danger");
  const showWarning = (msg) => showToast(msg, "warning");
  const showInfo = (msg) => showToast(msg, "info");

  return {
    toastProps: {
      show,
      message,
      type,
      onClose: hideToast,
    },
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  };
};
