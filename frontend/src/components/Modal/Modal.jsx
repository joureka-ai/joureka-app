import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

const Modal = ({ show, onClose, onConfirm, children, title, onCloseButton, onConfirmButton }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleConfirmClick = (e) => {
    e.preventDefault();
    onConfirm();
  }

  const modalContent = show ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          {title && <div className={styles.modalTitle}>{title}</div>}
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        <div className={styles.modalBody}>{children}</div>
        <div className={styles.modalActions}>
          <button onClick={handleCloseClick} className="custom-button custom-button-sm custom-button-transparent">{onCloseButton}</button>
          <button onClick={handleConfirmClick}
                                className="custom-button custom-button-sm custom-button-orange">{onConfirmButton}</button>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
